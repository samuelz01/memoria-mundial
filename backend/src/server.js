const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());

// Cargar mediaMappings
let mediaMappings = [];
try {
  const mappingsPath = path.join(__dirname, 'mediaMappings.json');
  mediaMappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'));
} catch (e) {
  console.error("No se pudo cargar mediaMappings.json:", e.message);
}
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Configurar autenticación con Google (Añadiendo scopes para Docs)
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/documents.readonly'
  ],
});

// Helper para extraer el ID de Google Drive de un link
const extractDriveId = (link) => {
  if (!link) return null;
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const idMatch = link.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
};

// Helper para convertir string separado por comas o saltos de línea en un arreglo limpio
const parseLinks = (cellValue) => {
  if (!cellValue) return [];
  return cellValue
    .split(/[\n,]+/)
    .map(link => link.trim())
    .filter(link => link.length > 0);
};

// Endpoint principal para obtener todas las investigaciones
app.get('/api/investigaciones', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:H`,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return res.json([]);
    const investigaciones = rows.map((row, index) => {
      return {
        id: index + 1,
        tema: row[0] || 'Sin tema',
        autor: row[1] || 'Anónimo',
        correo: row[2] || '',
        titulo: row[3] || 'Sin título',
        documentos: parseLinks(row[4]),
        imagenes: parseLinks(row[5]),
        videos: parseLinks(row[6]),
        portada: row[7] ? (row[7].startsWith('/imagenes') ? row[7] : extractDriveId(row[7])) : null
      };
    });
    res.json(investigaciones);
  } catch (error) {
    console.error('Error al leer Google Sheets:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// NUEVO: Endpoint para extraer el contenido del documento de Google Docs
app.get('/api/investigacion/:id', async (req, res) => {
  try {
    const param = decodeURIComponent(req.params.id);
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const docs = google.docs({ version: 'v1', auth: client });

    // 1. Buscar en Sheets la fila correspondiente al tema
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:H`,
    });
    
    const rows = response.data.values || [];
    let row;
    if (!isNaN(param) && Number.isInteger(parseFloat(param))) {
      const targetId = parseInt(param, 10);
      row = rows[targetId - 1];
    } else {
      row = rows.find(r => r[0] && r[0].trim().toLowerCase() === param.trim().toLowerCase());
    }
    
    if (!row) return res.status(404).json({ error: 'Investigación no encontrada' });

    const data = {
      tema: row[0] || 'Sin tema',
      autor: row[1] || 'Anónimo',
      correo: row[2] || '',
      titulo: row[3] || 'Sin título',
      documentos: parseLinks(row[4]),
      imagenes: parseLinks(row[5]),
      videos: parseLinks(row[6]),
      portada: row[7] ? (row[7].startsWith('/imagenes') ? row[7] : extractDriveId(row[7])) : null
    };

    if (data.documentos.length === 0) {
      return res.json({ metadata: data, blocks: [] });
    }

    // 2. Extraer ID del documento de Google
    const docId = extractDriveId(data.documentos[0]);
    if (!docId) {
      return res.json({ metadata: data, blocks: [{ type: 'text', content: 'No se pudo leer el ID del documento.' }] });
    }

    // 3. Leer el Documento usando Docs API
    let docData;
    try {
      const docRes = await docs.documents.get({ documentId: docId });
      docData = docRes.data;
    } catch (e) {
      console.error("Error al leer Docs API:", e.message);
      return res.json({ metadata: data, blocks: [{ type: 'text', content: 'Error al leer el documento de Google Docs. Asegúrate de que el documento está compartido y la API está habilitada.' }] });
    }

    // 4. Parsear texto y crear bloques
    let fullText = '';
    if (docData.body && docData.body.content) {
      docData.body.content.forEach(el => {
        if (el.paragraph) {
          el.paragraph.elements.forEach(sub => {
            if (sub.textRun) fullText += sub.textRun.content;
          });
        }
      });
    }

    const blocks = [];
    const lines = fullText.split('\n');

    const authorMapping = mediaMappings.find(m => m.correo === data.correo);
    let availableMedia = (authorMapping && authorMapping.media) ? [...authorMapping.media] : [];

    for (const line of lines) {
      const text = line.trim();
      if (!text) continue;

      // 1. Revisar exclusiones ("QUITAR")
      if (authorMapping && authorMapping.quitar && authorMapping.quitar.length > 0) {
        const shouldSkip = authorMapping.quitar.some(q => text.toLowerCase().includes(q.toLowerCase()));
        if (shouldSkip) continue;
      }

      // 2. Revisar si la línea contiene un tag multimedia exacto
      if (availableMedia.length > 0) {
        let textToProcess = text;
        let processedAny = false;
        
        while (textToProcess) {
           let earliestIndex = -1;
           let earliestTagPos = textToProcess.length;
           
           for (let i = 0; i < availableMedia.length; i++) {
              const m = availableMedia[i];
              const pos = textToProcess.indexOf(m.tag);
              if (pos !== -1 && pos < earliestTagPos) {
                  earliestTagPos = pos;
                  earliestIndex = i;
              }
           }
           
           if (earliestIndex !== -1) {
              const m = availableMedia[earliestIndex];
              const beforeTag = textToProcess.substring(0, earliestTagPos);
              const afterTag = textToProcess.substring(earliestTagPos + m.tag.length);
              
              if (beforeTag.trim()) {
                  blocks.push({ type: 'text', content: beforeTag.trim() });
              }
              
              const driveId = extractDriveId(m.url);
              if (driveId) {
                  if (m.type === 'image') blocks.push({ type: 'image', url: `http://localhost:5000/api/image/${driveId}`, source: m.source || '' });
                  if (m.type === 'video') blocks.push({ type: 'video', url: `https://drive.google.com/file/d/${driveId}/preview`, source: m.source || '' });
              }
              
              textToProcess = afterTag;
              processedAny = true;
              availableMedia.splice(earliestIndex, 1);
           } else {
              break;
           }
        }
        
        if (processedAny) {
           if (textToProcess.trim()) {
              blocks.push({ type: 'text', content: textToProcess.trim() });
           }
           continue; // Ya procesamos esta línea
        }
      }

      // Fallback antiguo: Buscar si es etiqueta de IMAGEN (ej. [IMAGEN_1.jpg] o [IMAGEN_1])
      const matchImagen = text.match(/\[IMAGEN_(\d+)/i);
      if (matchImagen) {
        const index = parseInt(matchImagen[1], 10) - 1; // Array es 0-indexed
        if (data.imagenes[index]) {
          const imgId = extractDriveId(data.imagenes[index]);
          blocks.push({ type: 'image', url: `http://localhost:5000/api/image/${imgId}` });
        }
        continue;
      }

      // Fallback antiguo: Buscar si es etiqueta de VIDEO (ej. [VIDEO_1.mp4] o [VIDEO_1])
      const matchVideo = text.match(/\[VIDEO_(\d+)/i);
      if (matchVideo) {
        const index = parseInt(matchVideo[1], 10) - 1;
        if (data.videos[index]) {
          const vidId = extractDriveId(data.videos[index]);
          blocks.push({ type: 'video', url: `https://drive.google.com/file/d/${vidId}/preview` });
        }
        continue;
      }

      // Si no es etiqueta, es texto
      blocks.push({ type: 'text', content: text });
    }
    
    // Agregar Autor y Contacto al final del documento
    blocks.push({ type: 'text', content: '---' });
    blocks.push({ type: 'text', content: `Escrito por: ${data.autor}` });
    blocks.push({ type: 'text', content: `Contacto: ${data.correo}` });

    res.json({ metadata: data, blocks });

  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ error: 'Error procesando la investigación' });
  }
});

// NUEVO: Proxy de imágenes para saltar la seguridad y errores 429 de Google Drive
app.get('/api/image/:id', (req, res) => {
  const fileId = req.params.id;
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  const request = https.get(url, (response) => {
    // Si Google redirige (302/303), seguimos la redirección
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      https.get(response.headers.location, (redirectResponse) => {
        res.writeHead(redirectResponse.statusCode, redirectResponse.headers);
        redirectResponse.pipe(res);
      }).on('error', (e) => res.status(500).end());
    } else {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    }
  });

  request.on('error', (e) => {
    console.error("Error en proxy de imagen:", e);
    res.status(500).end();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
