const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(cors());
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
      range: `${sheetName}!A2:G`,
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
        videos: parseLinks(row[6])
      };
    });
    res.json(investigaciones);
  } catch (error) {
    console.error('Error al leer Google Sheets:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// NUEVO: Endpoint para extraer el contenido del documento de Google Docs
app.get('/api/investigacion/:tema', async (req, res) => {
  try {
    const temaBuscado = decodeURIComponent(req.params.tema);
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const docs = google.docs({ version: 'v1', auth: client });

    // 1. Buscar en Sheets la fila correspondiente al tema
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:G`,
    });
    
    const rows = response.data.values || [];
    const row = rows.find(r => r[0].trim().toLowerCase() === temaBuscado.trim().toLowerCase());
    
    if (!row) return res.status(404).json({ error: 'Tema no encontrado' });

    const data = {
      tema: row[0] || 'Sin tema',
      autor: row[1] || 'Anónimo',
      titulo: row[3] || 'Sin título',
      documentos: parseLinks(row[4]),
      imagenes: parseLinks(row[5]),
      videos: parseLinks(row[6])
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

    for (const line of lines) {
      const text = line.trim();
      if (!text) continue;

      // Buscar si es etiqueta de IMAGEN (ej. [IMAGEN_1.jpg] o [IMAGEN_1])
      const matchImagen = text.match(/\[IMAGEN_(\d+)/i);
      if (matchImagen) {
        const index = parseInt(matchImagen[1], 10) - 1; // Array es 0-indexed
        if (data.imagenes[index]) {
          const imgId = extractDriveId(data.imagenes[index]);
          // En lugar de enviar un link de Google, enviamos un link a nuestro propio servidor (proxy)
          blocks.push({ type: 'image', url: `http://localhost:5000/api/image/${imgId}` });
        }
        continue;
      }

      // Buscar si es etiqueta de VIDEO (ej. [VIDEO_1.mp4] o [VIDEO_1])
      const matchVideo = text.match(/\[VIDEO_(\d+)/i);
      if (matchVideo) {
        const index = parseInt(matchVideo[1], 10) - 1;
        if (data.videos[index]) {
          const vidId = extractDriveId(data.videos[index]);
          // Reproductor incrustado optimizado
          blocks.push({ type: 'video', url: `https://drive.google.com/file/d/${vidId}/preview` });
        }
        continue;
      }

      // Si no es etiqueta, es texto
      blocks.push({ type: 'text', content: text });
    }

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
