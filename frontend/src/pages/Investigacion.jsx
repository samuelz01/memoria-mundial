import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, FileText, User } from 'lucide-react';

const themeColors = [
  'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50',
  'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50',
  'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/50',
  'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
  'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50',
  'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50',
  'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-200 dark:border-fuchsia-800/50',
  'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50'
];

const getThemeColor = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return themeColors[Math.abs(hash) % themeColors.length];
};

const simplifyTheme = (rawTheme) => {
  if (!rawTheme) return 'Otro';
  // Soporta guiones, guiones largos, el signo mayor que (>) y la flecha unicode (→)
  return rawTheme.split(/[-–—>→]/)[0].trim();
};

const cleanString = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '').trim();
};

export default function Investigacion({ isDark, toggleTheme }) {
  const { temaId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        // Llamar al nuevo endpoint que extrae y formatea el texto de Google Docs
        const response = await fetch(`http://localhost:5000/api/investigacion/${encodeURIComponent(temaId)}`);
        if (!response.ok) {
          if (response.status === 404) {
            setData({
              metadata: {
                tema: decodeURIComponent(temaId),
                titulo: 'Investigación en progreso...',
                autor: 'Equipo Memoria Mundial',
                correo: '',
                documentos: []
              },
              blocks: []
            });
            return;
          }
          throw new Error('Error al conectar con el servidor');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('No pudimos cargar la información. Verifica que el servidor backend esté corriendo y la API de Docs habilitada.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [temaId]);

  const isDavidRojas = data?.metadata?.autor?.includes('Rojas') || data?.metadata?.autor?.includes('Gamaliel') || (data?.blocks?.some(b => b.type === 'text' && b.content.includes('david.rojas@cua.uam.mx')));
  const isAnaSofia = data?.metadata?.autor?.includes('Ana') || data?.metadata?.autor?.includes('Sofía') || data?.metadata?.autor?.includes('Gutiérrez');
  const isPerlaValeria = data?.metadata?.autor?.toLowerCase().includes("perla");
  const isGaelGlobal = data?.metadata?.autor?.toLowerCase().includes("gael");

  let displayTitulo = data?.metadata?.titulo;
  if (isDavidRojas) {
    displayTitulo = "El freno a los discursos de odio en redes sociales tras el mundial de futbol 2026";
  } else if (isAnaSofia && displayTitulo) {
    displayTitulo = displayTitulo.charAt(0).toUpperCase() + displayTitulo.slice(1);
  } else if (isGaelGlobal) {
    displayTitulo = "Irán vs Estados Unidos";
  }

  const displayAutor = isDavidRojas ? "David Gamaliel Rojas Bernal" : data?.metadata?.autor;

  const renderBlocks = (blocks) => {
    if (!blocks || blocks.length === 0) {
      return (
        <div className="prose prose-stone dark:prose-invert max-w-none prose-lg">
          <p className="lead italic text-stone-500 text-center py-10">
            Estamos redactando esta investigación. Pronto estará disponible.
          </p>
        </div>
      );
    }

    // Agrupar bloques consecutivos multimedia
    let groupedBlocks = [];
    let currentGroup = null;

    blocks.forEach((block) => {
      if (block.type === 'image' || block.type === 'video') {
        if (!currentGroup) {
          currentGroup = { type: 'media_group', items: [] };
          groupedBlocks.push(currentGroup);
        }
        currentGroup.items.push(block);
      } else {
        currentGroup = null;
        groupedBlocks.push(block);
      }
    });

    const isSamuel = data?.metadata?.autor?.includes('Samuel Mijangos');
    const isCarlos = data?.metadata?.autor?.includes('Rivera Tapia') || data?.metadata?.autor?.includes('Carlos Leonardo');
    
    // Si es Samuel o Carlos, reordenamos los bloques para que las imágenes queden antes de los párrafos que las deben rodear
    if (isSamuel || isCarlos) {
      let imgCount = 0;
      for (let i = 0; i < groupedBlocks.length; i++) {
        if (groupedBlocks[i].type === 'media_group' && groupedBlocks[i].items.length === 1) {
          imgCount++;
          
          let moveUpBy = 0;
          if (isSamuel && [1, 4, 7, 9].includes(imgCount)) {
            moveUpBy = imgCount === 1 ? 2 : 1;
          } else if (isCarlos && [2, 5].includes(imgCount)) {
            moveUpBy = 1; // Para Carlos, movemos la imagen 1 posición arriba para que quede justo después del subtítulo y el párrafo fluya a su lado
          }

          if (moveUpBy > 0 && i - moveUpBy > 0) {
            const imgBlock = groupedBlocks.splice(i, 1)[0];
            groupedBlocks.splice(i - moveUpBy, 0, imgBlock);
          }
        }
      }
    }

    const isIanGlobal = data?.metadata?.autor?.includes('Campos') || data?.metadata?.autor?.includes('Ian');

    // Mover la imagen 8 de Ian para que quede después del subtítulo "Conclusión"
    if (isIanGlobal) {
      const idxConclusion = groupedBlocks.findIndex(b => b.type === 'text' && /conclusi[oó]n/i.test(b.content));
      let imgCount = 0;
      let idx8 = -1;
      for (let i = 0; i < groupedBlocks.length; i++) {
        if (groupedBlocks[i].type === 'media_group' && groupedBlocks[i].items.length === 1) {
          imgCount++;
          if (imgCount === 8) {
            idx8 = i;
            break;
          }
        }
      }
      
      if (idx8 !== -1 && idxConclusion !== -1 && idx8 > idxConclusion) {
        const imgBlock = groupedBlocks.splice(idx8, 1)[0];
        groupedBlocks.splice(idxConclusion + 1, 0, imgBlock);
      }
    }

    let singleImageCount = 0;

    // ----- INICIO PRE-PROCESAMIENTO PARA LISTAS DE IAN -----
    if (isIanGlobal) {
      const listHeaders = [
        "De manera aproximada:",
        "Esto significa que:",
        "Los principales compradores de este tipo de entradas suelen pertenecer a alguno de los siguientes grupos:",
        "Existen diversos factores que explican el incremento de los precios:"
      ];
      
      const stopPhrases = ["A estos costos", "Esta comparación", "También existe", "Además, el"];
      
      let newGrouped = [];
      let currentList = null;

      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          if (listHeaders.includes(text)) {
            currentList = { type: 'custom_list', header: text, items: [] };
            newGrouped.push(currentList);
          } else if (currentList) {
            // Verificar si es un subtítulo o una frase de parada
            const isSubtitle = [ 
                "Introducción", "¿Cuánto cuestan los boletos?", "Comparación con la canasta básica", "Comparación con el salario de los mexicanos", "¿Quién puede pagar estos boletos?", "¿Por qué son tan caros?", "Consecuencias sociales", "Conclusión",
                // Daniela
                "Marcas oficiales: la exclusividad como inversión", "Marcas no patrocinadoras: creatividad frente a la exclusividad", "Piratería: el mercado paralelo del Mundial", "Fuentes consultadas"
            ].includes(text.replace(/^[#\s]+/, ''));
            const isStopPhrase = stopPhrases.some(phrase => text.startsWith(phrase));
            
            if (isSubtitle || isStopPhrase || text.startsWith("(") || text === "") {
              currentList = null;
              newGrouped.push(block);
            } else {
              currentList.items.push(text);
            }
          } else {
            newGrouped.push(block);
          }
        } else {
          currentList = null;
          newGrouped.push(block);
        }
      }
      
      groupedBlocks = newGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO IAN -----

    // ----- INICIO PRE-PROCESAMIENTO PARA DANIELA -----
    const isDanielaGlobal = data?.metadata?.autor?.includes('Jiménez') || data?.metadata?.autor?.includes('Daniela');
    if (isDanielaGlobal) {
      let newGrouped = [];
      let inFuentes = false;
      let fuentesList = null;

      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          if (text === "Fuentes consultadas") {
            inFuentes = true;
            fuentesList = { type: 'custom_list', header: text, items: [] };
            newGrouped.push(fuentesList);
          } else if (inFuentes && (text.includes("Disponible en:") || text.includes("http"))) {
            fuentesList.items.push(text);
          } else {
            newGrouped.push(block);
          }
        } else {
          newGrouped.push(block);
        }
      }
      
      // Mover la imagen 3 para que flote junto a los párrafos de ambush marketing (Levi's)
      const idxLevi = newGrouped.findIndex(b => b.type === 'text' && b.content.includes("Aunque estas marcas no pueden utilizar logotipos"));
      
      // Encontrar la imagen 3 (es el 3er bloque de tipo media_group con items.length === 1)
      let imgCount = 0;
      let idxImg3 = -1;
      for (let i = 0; i < newGrouped.length; i++) {
        if (newGrouped[i].type === 'media_group' && newGrouped[i].items.length === 1) {
          imgCount++;
          if (imgCount === 3) {
            idxImg3 = i;
            break;
          }
        }
      }

      if (idxImg3 !== -1 && idxLevi !== -1 && idxImg3 > idxLevi) {
        // Mover la imagen JUSTO ANTES del párrafo de Levi's
        const imgBlock = newGrouped.splice(idxImg3, 1)[0];
        // Como eliminamos algo después de idxLevi, idxLevi sigue siendo el mismo índice para el párrafo
        newGrouped.splice(idxLevi, 0, imgBlock);
      }

      groupedBlocks = newGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO DANIELA -----

    // ----- INICIO PRE-PROCESAMIENTO PARA DIEGO PANINI -----
    const isDiegoPanini = data?.metadata?.titulo?.toLowerCase().includes("panini") && data?.metadata?.autor?.toLowerCase().includes("diego");
    if (isDiegoPanini) {
      let newGrouped = [];
      let inFuentes = false;
      let fuentesList = null;

      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          
          if (text === "Referencias:") {
            inFuentes = true;
            fuentesList = { type: 'custom_list', header: text, items: [] };
            newGrouped.push(fuentesList);
          } else if (inFuentes && (text.includes("http") || text.includes("Tienda Panini") || text.includes("colaboradores") || text.includes("Jáuregui") || text.includes("Google Gemini") || text.includes("Sopibecario") || text.includes("LUJO?"))) {
            fuentesList.items.push(text);
          } else {
            // Check if we are at the paragraph after the table
            if (text.startsWith("Si tenemos en cuenta que este mundial cuenta con 48 selecciones")) {
               // Inject table BEFORE this block
               newGrouped.push({ type: 'diego_panini_table' });
               newGrouped.push(block);
            } else {
               newGrouped.push(block);
            }
          }
        } else {
          newGrouped.push(block);
        }
      }
      groupedBlocks = newGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO DIEGO PANINI -----

    // ----- INICIO PRE-PROCESAMIENTO DAVID ROJAS -----
    const isDavidRojas = data?.metadata?.autor?.includes('Rojas') || data?.metadata?.autor?.includes('Gamaliel') || (groupedBlocks?.some(b => b.type === 'text' && b.content.includes('david.rojas@cua.uam.mx')));
    if (isDavidRojas) {
      let newGrouped = [];
      let inQuote = false;
      let pendingQuote = "";
      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          if (text === '2026') continue; // Eliminar el "2026" que está solo
          
          // Detectar inicio de cita que no termina en la misma línea
          if (!inQuote && (text.startsWith('“') || text.startsWith('"') || text.startsWith('«')) && !text.match(/["”»][.,;!?]*$/)) {
            inQuote = true;
            pendingQuote = block.content;
            continue;
          }
          
          // Si estamos dentro de una cita, seguir acumulando
          if (inQuote) {
            pendingQuote += " " + block.content;
            if (text.match(/["”»][.,;!?]*$/)) {
              newGrouped.push({ type: 'text', content: pendingQuote });
              inQuote = false;
              pendingQuote = "";
            }
            continue;
          }
          
          newGrouped.push(block);
        } else {
          if (inQuote) {
            newGrouped.push({ type: 'text', content: pendingQuote });
            inQuote = false;
            pendingQuote = "";
          }
          newGrouped.push(block);
        }
      }
      if (inQuote) {
        newGrouped.push({ type: 'text', content: pendingQuote });
      }
      groupedBlocks = newGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO DAVID ROJAS -----

    // ----- INICIO PRE-PROCESAMIENTO ANA SOFIA -----
    if (isAnaSofia) {
      let tempGrouped = [];
      let inReferencias = false;
      let referenciasList = [];
      let currentList = null;
      let authorBlocks = [];
      let listPatterns = [
        "Repunte delictivo:", "Foco rojo:", "Impunidad estructural:",
        "Normalización de la violencia sexual:", "La cultura del encubrimiento:", "Brecha y cosificación:",
        "El factor alcohol y apuestas:", "Saturación de líneas de ayuda:"
      ];
      
      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          
          // Eliminar el texto hardcodeado de la imagen
          if (text.includes("Cortesía de Pexels") || text.includes("Elementos policiales reprimiendo manifestaciones feministas") || text.includes("(pie de foto:")) {
             continue; 
          }
          
          if (text.toLowerCase().replace(/[:.]/g, '') === "referencias") {
             inReferencias = true;
             continue;
          }

          if (text.match(/^(?:---?\\s*)?(Escrito por|Contacto|Autor|Correo)/i)) {
              inReferencias = false;
              authorBlocks.push(block);
              continue;
          }
          
          if (inReferencias) {
             if (text) { 
               let lines = text.split('\n').filter(line => line.trim() !== '');
               referenciasList.push(...lines);
             }
             continue;
          }
          
          let isListItem = listPatterns.some(pattern => text.includes(pattern));
          if (isListItem) {
             let cleanText = text.replace(/^[•\-]\s*/, '');
             let prefix = listPatterns.find(pattern => cleanText.includes(pattern));
             if (prefix && !cleanText.includes('**' + prefix)) {
                 cleanText = cleanText.replace(prefix, `**${prefix}**`);
             }
             if (!currentList) {
                currentList = { type: 'custom_list', items: [] };
                tempGrouped.push(currentList);
             }
             currentList.items.push(cleanText);
             continue;
          } else {
             currentList = null;
          }
          
          tempGrouped.push(block);
        } else {
          currentList = null;
          tempGrouped.push(block);
        }
      }
      
      if (referenciasList.length > 0) {
        tempGrouped.push({
          type: 'custom_list',
          header: 'Referencias',
          items: referenciasList
        });
      }

      if (authorBlocks.length > 0) {
        tempGrouped.push(...authorBlocks);
      }
      
      groupedBlocks = tempGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO ANA SOFIA -----

    // ----- INICIO PRE-PROCESAMIENTO PERLA VALERIA -----
    if (isPerlaValeria) {
      let tempGrouped = [];
      let image4Block = null;
      
      let imgCount = 0;
      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'media_group') {
          let hasImage4 = false;
          block.items.forEach(item => {
             if (item.type === 'image') {
                imgCount++;
                item.perlaImageIndex = imgCount;
             }
             if (item.perlaImageIndex === 4) {
                hasImage4 = true;
             }
          });
          if (hasImage4 && !image4Block) {
             image4Block = block;
             image4Block.isImage4Target = true;
             continue; 
          }
        }
        tempGrouped.push(block);
      }
      
      let finalGrouped = [];
      for (let i = 0; i < tempGrouped.length; i++) {
        let block = tempGrouped[i];
        if (block.type === 'text') {
           let text = block.content;
           if (text.includes("El estudio identificó 89 mil publicaciones ofensivas")) {
             text = text.replace("89 mil publicaciones ofensivas", "**89 mil publicaciones ofensivas**");
             text = text.replace("13 veces mayor", "**13 veces mayor**");
             text = text.replace("11 % correspondía a ataques con contenido racista", "**11 % correspondía a ataques con contenido racista**");
             text = text.replace("225 mil publicaciones fueron enviadas a revisión humana", "**225 mil publicaciones fueron enviadas a revisión humana**");
             text = text.replace("181 mil comentarios de odio fueron ocultados automáticamente", "**181 mil comentarios de odio fueron ocultados automáticamente**");
             text = text.replace("mil cuentas fueron canalizadas para investigaciones adicionales", "**mil cuentas fueron canalizadas para investigaciones adicionales**");
             block.content = text;
           }
           
           finalGrouped.push(block);
           
           if (text.includes("Reportes periodísticos también documentaron incidentes en entidades como Morelos, Hidalgo, Nuevo León y Veracruz")) {
              if (image4Block) {
                 finalGrouped.push(image4Block);
                 image4Block = null;
              }
           }
        } else {
           finalGrouped.push(block);
        }
      }
      
      groupedBlocks = finalGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO PERLA VALERIA -----

    // ----- INICIO PRE-PROCESAMIENTO PARA SINUHE -----
    const isSinuheGlobal = data?.metadata?.autor?.toLowerCase().includes("sinuh");
    if (isSinuheGlobal) {
      let tempGrouped = [];
      for (let i = 0; i < groupedBlocks.length; i++) {
        let block = groupedBlocks[i];
        if (block.type === 'text') {
          let text = block.content.trim();
          if (
            text.includes("NOTA (La imagen 4 es una cuadrícula") ||
            text.includes("(Video de YouTube)") ||
            text.toLowerCase() === "(imagen de facebook)" ||
            text.includes("Autor Sinuhé Ramsés Barrios Hernández") ||
            text.toLowerCase().includes("imagen generada con ia")
          ) {
            continue;
          }

          // Separar "Fuente verificable principal:" del resto del bloque de la BBC
          if (text.startsWith("Fuente verificable principal:")) {
            let secondPart = text.replace("Fuente verificable principal:", "").trim();
            tempGrouped.push({ type: 'text', content: "Fuente verificable principal" });
            if (secondPart) tempGrouped.push({ type: 'text', content: secondPart });
            continue;
          }
        }
        tempGrouped.push(block);
      }

      // Unir el título de BBC Sport y su link si quedaron separados
      let newGrouped = [];
      for (let i = 0; i < tempGrouped.length; i++) {
        let block = tempGrouped[i];
        if (block.type === 'text' && block.content.trim().startsWith("[BBC Sport")) {
           if (i + 1 < tempGrouped.length && tempGrouped[i+1].type === 'text' && tempGrouped[i+1].content.trim().startsWith("(")) {
              let mergedBlock = { type: 'text', content: block.content.trim() + "\n" + tempGrouped[i+1].content.trim() };
              newGrouped.push(mergedBlock);
              i++; // saltar el siguiente
              continue;
           }
        }
        newGrouped.push(block);
      }
      
      
      let combinedGrouped = [];
      for (let i = 0; i < newGrouped.length; i++) {
        let block = newGrouped[i];
        if (block.type === 'media_group') {
          let hasVideo = block.items.some(item => item.type === 'video');
          let lastBlock = combinedGrouped[combinedGrouped.length - 1];
          let lastHasVideo = lastBlock && lastBlock.type === 'media_group' && lastBlock.items.some(item => item.type === 'video');
          
          // Si ninguno de los dos tiene video, entonces unimos (imágenes con imágenes)
          if (lastBlock && lastBlock.type === 'media_group' && !hasVideo && !lastHasVideo) {
            lastBlock.items = lastBlock.items.concat(block.items);
          } else {
            combinedGrouped.push(block);
          }
        } else {
          combinedGrouped.push(block);
        }
      }
      groupedBlocks = combinedGrouped;
    }
    // ----- FIN PRE-PROCESAMIENTO SINUHE -----

    // Función para renderizar enlaces y markdown links con colores rotativos
    const renderTextWithLinks = (text) => {
      // Reemplaza los enlaces markdown [Texto](URL) por tags <a>. Permite saltos de línea entre ] y (
      const markdownRegex = /\[([^\]]+)\]\s*\(\s*(https?:\/\/[^\s\)]+)\s*\)/g;
      
      if (text.match(markdownRegex)) {
        let parts = text.split(markdownRegex);
        // parts will contain: [ "text before ", "Texto", "URL", " text after" ]
        let result = [];
        for (let i = 0; i < parts.length; i++) {
          if (i % 3 === 0) {
            // Normal text
            if (parts[i]) result.push(<span key={i}>{parts[i]}</span>);
          } else if (i % 3 === 1) {
            // Link text
            const linkText = parts[i];
            const url = parts[i+1];
            result.push(
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 font-extrabold underline decoration-emerald-500/50 decoration-2 underline-offset-4 transition-all">
                {linkText}
              </a>
            );
            i++; // Skip the url part
          }
        }
        return result;
      }

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (!text.match(urlRegex)) return text;
      const parts = text.split(urlRegex);
      const colors = ['text-blue-500 hover:text-blue-700', 'text-fuchsia-500 hover:text-fuchsia-700', 'text-amber-500 hover:text-amber-700', 'text-indigo-500 hover:text-indigo-700', 'text-rose-500 hover:text-rose-700'];
      let linkCount = 0;
      return parts.map((part, i) => {
        if (part.match(urlRegex)) {
          const colorClass = colors[linkCount % colors.length];
          linkCount++;
          return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={`underline font-bold transition-colors ${colorClass}`}>{part}</a>;
        }
        return part;
      });
    };

    // Función para renderizar el texto final con matemáticas en línea
    const renderFinalText = (textObj) => {
      const nodes = Array.isArray(textObj) ? textObj : [textObj];
      const mathRegex = /(\b\d+(?:\.\d+)?(?:-\d+)?\+?\s*(?:µg\/m³|tCO₂e|CO₂|toneladas|millones|%)\b|tCO₂e|CO₂|µg\/m³|PM2\.5|O₃)/g;
      
      const processNode = (node) => {
        if (typeof node === 'string') {
          const parts = node.split(mathRegex);
          if (parts.length === 1) return node;
          return parts.map((part, i) => {
            if (part.match(mathRegex)) {
              return <code key={i} className="font-mono text-stone-600 dark:text-stone-400 text-[0.95em] px-0.5">{part}</code>;
            }
            return part;
          });
        }
        return node;
      };

      return nodes.map((node, i) => <React.Fragment key={i}>{processNode(node)}</React.Fragment>);
    };

    const renderContent = (text) => {
      if (typeof text !== 'string') return text;
      const parts = text.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
           return <strong key={i} className="font-black text-stone-900 dark:text-white bg-emerald-100/30 px-1 rounded-sm">{part}</strong>;
        }
        return renderFinalText(renderTextWithLinks(part));
      });
    };

    return (
      <div className={`article-content ${isDavidRojas ? 'space-y-3' : 'space-y-6'} flow-root`}>
        {groupedBlocks.map((block, index) => {
          if (block.type === 'custom_list') {
            return (
              <div key={index} className="mb-8">
                {block.header === "Fuentes consultadas" || block.header === "Referencias" ? (
                  <h3 className="text-3xl font-extrabold tracking-tight mt-12 mb-6 text-stone-900 dark:text-white border-b-4 border-emerald-500/60 pb-2 inline-block">
                    {block.header}
                  </h3>
                ) : (
                  <p className="text-stone-800 dark:text-stone-300 font-article text-xl md:text-2xl leading-[1.8] tracking-[0.01em] mb-4">{block.header}</p>
                )}
                <ul className="list-disc pl-10 space-y-4 text-stone-800 dark:text-stone-300 font-article text-xl md:text-2xl leading-[1.8] tracking-[0.01em]">
                  {block.items.map((line, idx) => {
                    // Dar un poco de margen extra a "Final:" y sus subelementos
                    const isSubItem = line.startsWith("Categorías");
                    return (
                      <li key={idx} className={`${isSubItem ? 'pl-8 list-circle marker:text-emerald-400' : 'pl-1 marker:text-emerald-600'} break-all`}>
                        {renderContent(line.replace(/^[•\-]\s*/, ''))}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }

          if (block.type === 'diego_panini_table') {
            return (
              <div key={index} className="my-14 overflow-x-auto rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121214]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-600 text-white">
                      <th className="p-4 border-b border-stone-200 dark:border-stone-700 font-semibold">Edición Mundialista</th>
                      <th className="p-4 border-b border-stone-200 dark:border-stone-700 font-semibold">Precio por Sobre (MXN)</th>
                      <th className="p-4 border-b border-stone-200 dark:border-stone-700 font-semibold">Contenido del Sobre</th>
                      <th className="p-4 border-b border-stone-200 dark:border-stone-700 font-semibold">Costo Mínimo para Llenar el Álbum</th>
                    </tr>
                  </thead>
                  <tbody className="text-stone-700 dark:text-stone-300">
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Francia 98'</td><td className="p-4">$1.50</td><td className="p-4">5 estampas</td><td className="p-4">$168</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Japón/Corea 2002</td><td className="p-4">$2.00</td><td className="p-4">5 estampas</td><td className="p-4">$232</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Alemania 2006</td><td className="p-4">$3.00</td><td className="p-4">5 estampas</td><td className="p-4">$357</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Sudáfrica 2010</td><td className="p-4">$5.50</td><td className="p-4">5 estampas</td><td className="p-4">$700</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Brasil 2014</td><td className="p-4">$6.00</td><td className="p-4">5 estampas</td><td className="p-4">$760</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Rusia 2018</td><td className="p-4">$14.00</td><td className="p-4">5 estampas</td><td className="p-4">$1,910</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border-b border-stone-100 dark:border-stone-800">
                      <td className="p-4">Qatar 2022</td><td className="p-4">$18.00</td><td className="p-4">5 estampas</td><td className="p-4">$2,412</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                      <td className="p-4 font-semibold">Mex/USA/Can 2026</td><td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">$24.00</td><td className="p-4">7 estampas</td><td className="p-4 font-semibold text-rose-600 dark:text-rose-400">$3,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }

          if (block.type === 'text') {
            const blockClean = cleanString(block.content);
            const titleClean = cleanString(data.metadata.titulo);
            
            // Ocultar si el texto (en los primeros 3 bloques) es exactamente el título o sumamente similar
            const isDuplicateTitle = index < 3 && blockClean.length > 10 && 
              (blockClean === titleClean || titleClean.includes(blockClean) || blockClean.includes(titleClean));
            
            if (isDuplicateTitle) {
              return null;
            }

            const contentStr = block.content.trim();

            // Ocultar etiqueta de ChatGPT literal
            if (contentStr.toLowerCase().includes("imagen generada con ia") || contentStr.toLowerCase().includes("chatgpt")) {
              return null;
            }

            // Ignorar bloques de texto que sean solo etiquetas de imágenes ("Imagen 1", "Imagen", etc.)
            if (/^imagen(\s+\d+)?$/i.test(contentStr)) {
              return null;
            }


            // Ocultar título duplicado específico de Ian
            if (block.content.trim() === "El Mundial 2026: cuando vivir el fútbol se convierte en un lujo") {
              return null;
            }

            // Resaltar información de contacto o autor (generalmente al final, o al inicio)
            if (block.content.match(/^(?:---?\s*)?(Escrito por|Contacto|Autor|Correo)/i)) {
              return (
                <div key={index} className="flex justify-center my-6">
                  <p className="text-center font-bold text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 drop-shadow-sm">
                    {block.content.replace(/^(?:---?\s*)/, '')}
                  </p>
                </div>
              );
            }

            // Convertir ciertas frases en Subtítulos bonitos
            const subtitlesList = [
              "Fase 1: Postulación y viabilidad",
              "Fase 2: Candidatura oficial",
              "Fase 3: Campaña de promoción y lobby",
              "Fase 4: La votación final",
              "¿Quién decide la sede?",
              "El Mundial como plataforma publicitaria",
              "Patrocinadores oficiales",
              "Marcas no patrocinadoras",
              "Marketing de emboscada",
              "Estrategias publicitarias",
              "Redes sociales",
              "Uso de futbolistas y celebridades",
              "Productos edición Mundial",
              "Competencia entre marcas",
              "Conclusión",
              "Sorteo de la Copa del Mundo",
              "Inauguración",
              "México",
              "Coreanos en México",
              "Pato Merlin",
              "Japón vs Brasil",
              "Paraguay vs Alemania",
              "Tim Payne",
              "Publicidad Contraproducente",
              "La Invasión Alienígena en Brasil vs Escocia",
              "Menciones Honoríficas",
              "Trending topics México 11 junio 2026",
              "Portadas periodicos México 12 junio 2026",
              "Introducción",
              "¿Cuánto cuestan los boletos?",
              "Comparación con la canasta básica",
              "Comparación con el salario de los mexicanos",
              "¿Quién puede pagar estos boletos?",
              "¿Por qué son tan caros?",
              "Consecuencias sociales",
              "Marcas oficiales: la exclusividad como inversión",
              "Marcas no patrocinadoras: creatividad frente a la exclusividad",
              "Piratería: el mercado paralelo del Mundial",
              "Fuentes consultadas",
              "Fuente verificable principal",
              "La Huella de Carbono y el Impacto Climático del Mundial 2026 en la Ciudad de México: 1970/1986 vs 2026",
              "Apartado adicional: La Contaminación Generada por Gianni Infantino y sus Viajes en Jet Privado durante el Mundial 2026",
              "La Evolución de la Contaminación Atmosférica y la Huella Local",
              "Gráfica comparativa (descripción textual para visualización)",
              "Incremento en Consumo de Alcohol, Drogas y Generación de Basura",
              "Conclusión sobre el impacto que genera el mundial",
              "La estrategia de comunicación y la hipocresía institucional",
              "Sesgos de género e impunidad en el fútbol",
              "Incremento de violencia doméstica",
              "¿Qué dicen los ciudadanos?",
              "Referencias"
            ];
            
            // Revisar si el bloque coincide con la lista (ignorando mayúsculas y puntos)
            const matchedSubtitle = subtitlesList.find(sub => {
              const cleanedBlock = contentStr.toLowerCase().replace(/[:.]/g, '');
              const cleanedSub = sub.toLowerCase().replace(/[:.]/g, '');
              return cleanedBlock === cleanedSub;
            });
            
            // Renderizar un subtítulo con estilo destacado
            if (matchedSubtitle) {
              return (
                <h3 key={index} className="text-3xl font-extrabold tracking-tight mt-12 mb-6 text-stone-900 dark:text-white border-b-4 border-emerald-500/60 pb-2 inline-block">
                  {contentStr.replace(/^[#\s]+/, '')}
                </h3>
              );
            }

            // Ignorar bloques de texto que son fuentes sueltas que ya se asignaron a imágenes (después de subtítulos)
            if (/^fuente:?\s*.+$/i.test(block.content.trim()) && block.content.trim().length < 150) {
              return null;
            }

            // Ocultar las etiquetas y fragmentos rotos de imágenes de Ian
            if (isIanGlobal) {
              if (contentStr.toLowerCase().includes("agregar imagen")) return null;
              if (contentStr === "(" || contentStr === ")") return null;
              if (contentStr.startsWith(":") && contentStr.endsWith(")")) return null;
            }

            // renderFinalText was moved up
            // Detectar citas (empiezan y terminan con comillas, formato específico, o la fuente de la BBC)
            const isSinuheBBCQuote = isSinuheGlobal && contentStr.startsWith("[BBC Sport");
            
            // Para David Rojas, el usuario pidió que las comillas sean texto normal, no blockquote
            if (!isDavidRojas && (contentStr.startsWith('“') || contentStr.startsWith('"') || (contentStr.length > 50 && contentStr.startsWith('«')) || isSinuheBBCQuote)) {
              return (
                <blockquote key={index} className="pl-6 border-l-4 border-emerald-500 dark:border-emerald-600 my-10 italic text-xl md:text-2xl font-serif text-stone-700 dark:text-stone-400">
                  {renderFinalText(renderTextWithLinks(block.content))}
                </blockquote>
              );
            }

            // Sub-subtitulos específicos
            const boldSubtitles = [
              "Comparación:",
              "Cálculo de contaminación:",
              "Opinión y postura de Infantino/FIFA:",
              "Sus partidos fueron:"
            ];
            if (boldSubtitles.includes(contentStr)) {
              return <p key={index} className="text-stone-900 dark:text-stone-100 font-extrabold text-2xl md:text-3xl mt-12 mb-4 tracking-wide">{contentStr}</p>;
            }

            // Aplicar renderContent al texto normal que ya incluye llamadas a renderFinalText y renderTextWithLinks
            return <p key={index} className="text-stone-800 dark:text-stone-300 font-article text-xl md:text-2xl leading-[1.8] tracking-[0.01em] hyphens-auto" style={{ textAlign: "justify" }}>
              {renderContent(block.content)}
            </p>;
          }
          
          if (block.type === 'media_group') {
            const isSingle = block.items.length === 1;
            const isSamuel = data?.metadata?.autor?.includes('Samuel Mijangos');
            const isCarlos = data?.metadata?.autor?.includes('Rivera Tapia') || data?.metadata?.autor?.includes('Carlos Leonardo');
            const isAngel = data?.metadata?.autor?.includes('Quintero') || data?.metadata?.autor?.includes('Ángel');
            const isElisa = data?.metadata?.autor?.includes('Grimaldo') || data?.metadata?.autor?.includes('Elisa');
            const isIanMedia = data?.metadata?.autor?.includes('Campos') || data?.metadata?.autor?.includes('Ian');
            const isDiegoMemes = data?.metadata?.titulo?.toLowerCase().includes("memes") && data?.metadata?.autor?.toLowerCase().includes("diego");
            const isDiegoPanini = data?.metadata?.titulo?.toLowerCase().includes("panini") && data?.metadata?.autor?.toLowerCase().includes("diego");
            const isGael = data?.metadata?.autor?.toLowerCase().includes("gael");
            
            let containerClass = "my-12 w-full clear-both";
            let figureClass = "group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-[#121214] relative";
            let imageClass = "w-full h-auto object-contain max-h-[800px] transition-all duration-700";
            let figcaptionClass = "py-3 px-4 text-sm font-semibold tracking-wide text-stone-700 dark:text-stone-200 italic text-center bg-stone-50/80 dark:bg-black/70 backdrop-blur-md opacity-90 group-hover:opacity-0 transition-all duration-500 border-none absolute bottom-0 w-full z-20 pointer-events-none";

            if (isGael) {
              figureClass = "group flex flex-col transition-all duration-700 relative z-10 hover:z-50 mix-blend-multiply dark:mix-blend-normal w-full max-w-2xl mx-auto";
              imageClass += " contrast-125 saturate-[1.5] hover:saturate-[2.5] hover:brightness-110 hover:scale-[1.03] hover:rotate-1 filter drop-shadow-[0_10px_20px_rgba(34,211,238,0.3)] hover:drop-shadow-[0_20px_40px_rgba(217,70,239,0.6)] transition-all duration-700 ease-out";
            }

            if (isPerlaValeria && block.isImage4Target) {
                containerClass = "md:float-right md:w-1/3 lg:w-1/3 md:ml-8 mb-6 mt-2 relative z-10 clear-none bg-stone-100 dark:bg-[#1a1a1c] border-4 border-stone-800 rounded-xl p-2 shadow-lg";
            }

            if (isSinuheGlobal) {
              figureClass = "group flex flex-col rounded-2xl overflow-hidden transition-all duration-700 relative bg-transparent border-none shadow-none hover:shadow-none";
              imageClass += " mix-blend-multiply dark:mix-blend-normal";
            }

            const uniqueSources = [...new Set(block.items.map(m => m.source).filter(Boolean))];
            let hasSharedSource = uniqueSources.length === 1 && block.items.length > 1;
            let sharedSourceText = hasSharedSource ? uniqueSources[0] : null;

            if (isElisa) {
              if (block.items.length >= 6) {
                figureClass += " scale-90 hover:scale-[2.5] hover:z-[100] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] cursor-zoom-in origin-center";
              } else {
                figureClass += " scale-90 hover:scale-[1.7] hover:z-[100] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] cursor-zoom-in";
              }
            } else if (isIanMedia) {
              const effectType = index % 5;
              if (effectType === 0) {
                figureClass += " hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:z-50 cursor-pointer blur-[2px] hover:blur-none";
              } else if (effectType === 1) {
                figureClass += " hover:rotate-3 hover:shadow-[0_25px_50px_rgba(16,185,129,0.3)] hover:z-50 cursor-pointer grayscale hover:grayscale-0";
              } else if (effectType === 2) {
                figureClass += " hover:-rotate-3 hover:shadow-[0_25px_50px_rgba(59,130,246,0.3)] hover:z-50 cursor-pointer sepia hover:sepia-0";
              } else if (effectType === 3) {
                figureClass += " hover:scale-[1.35] hover:z-[70] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] cursor-zoom-in";
              } else {
                figureClass += " hover:skew-x-2 hover:-translate-x-2 hover:shadow-[20px_20px_40px_rgba(0,0,0,0.3)] hover:z-50 cursor-pointer brightness-50 hover:brightness-110";
              }
            }

            if (isSingle) {
              singleImageCount++;
              
              if (isSamuel) {
                switch(singleImageCount) {
                  case 1:
                    // Flota izquierda, incrustada en el párrafo siguiente
                    containerClass = "md:float-left md:w-[45%] md:mr-10 mb-8 mt-2 relative z-10 clear-none";
                    break;
                  case 2:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " grayscale hover:grayscale-0 hover:scale-[1.03]";
                    break;
                  case 3:
                    containerClass = "w-full max-w-4xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.10] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]";
                    break;
                  case 4:
                    // Flota derecha
                    containerClass = "md:float-right md:w-[45%] md:ml-10 mb-8 mt-2 relative z-10 clear-none";
                    imageClass += " sepia hover:sepia-0 hover:scale-105";
                    break;
                  case 5:
                    containerClass = "w-full md:w-[115%] md:-ml-[7.5%] my-16 relative z-10 clear-both";
                    figureClass = "flex flex-col rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-[#121214] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]";
                    break;
                  case 6:
                    containerClass = "w-full max-w-3xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " -rotate-2 hover:rotate-2";
                    imageClass += " hover:scale-110";
                    break;
                  case 7:
                    // Flota izquierda
                    containerClass = "md:float-left md:w-[50%] md:mr-10 mb-8 mt-2 relative z-10 clear-none";
                    imageClass += " blur-[2px] hover:blur-none";
                    break;
                  case 8:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " contrast-150 hover:contrast-100 hover:scale-105";
                    break;
                  case 9:
                    // Círculo mucho más grande y llamativo, flotando a la derecha
                    containerClass = "md:float-right md:w-[50%] md:ml-10 mb-8 mt-2 relative z-10 clear-none";
                    figureClass += " !rounded-full aspect-square border-4 !border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                    imageClass += " !h-full hover:scale-110";
                    break;
                  case 10:
                    // Efecto de opacidad parcial que se vuelve opaco y brillante
                    containerClass = "w-full max-w-4xl mx-auto my-12 relative z-10 clear-both";
                    imageClass += " opacity-60 hover:opacity-100 hover:brightness-125 transition-all duration-700";
                    break;
                  case 11:
                    // Efecto de saturación extrema con zoom
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    figureClass += " border-b-8 border-b-emerald-600";
                    imageClass += " saturate-50 hover:saturate-200 hover:scale-[1.04] transition-all duration-700";
                    break;
                  default:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " hover:scale-105";
                    break;
                }
              } else if (isCarlos) {
                switch(singleImageCount) {
                  case 1:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " contrast-125 saturate-150 hover:saturate-200 transition-all duration-700 hover:scale-105 rounded-xl border-4 border-white shadow-xl";
                    break;
                  case 2:
                    // Flota izquierda
                    containerClass = "md:float-left md:w-[45%] md:mr-10 mb-8 mt-2 relative z-10 clear-none";
                    imageClass += " sepia-[.3] hover:sepia-0 hover:scale-[1.02] transition-all";
                    break;
                  case 3:
                    containerClass = "w-full max-w-4xl mx-auto my-12 relative z-10 clear-both";
                    figureClass = "flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 bg-stone-100 hover:shadow-[0_20px_50px_rgba(8,112,184,0.7)] hover:-translate-y-2 relative";
                    break;
                  case 4:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " hue-rotate-15 hover:hue-rotate-0 hover:scale-110 transition-all duration-500";
                    break;
                  case 5:
                    // Flota derecha
                    containerClass = "md:float-right md:w-[45%] md:ml-10 mb-8 mt-2 relative z-10 clear-none";
                    figureClass += " -rotate-3 hover:rotate-0 relative";
                    imageClass += " hover:scale-[1.05]";
                    break;
                  case 6:
                    containerClass = "w-full md:w-[110%] md:-ml-[5%] my-16 relative z-10 clear-both";
                    imageClass += " brightness-90 hover:brightness-110 saturate-[1.2] hover:scale-[1.02] transition-all";
                    break;
                  case 7:
                    containerClass = "w-full max-w-2xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " !rounded-[4rem] border-8 !border-stone-100 shadow-[0_0_40px_rgba(255,255,255,0.2)]";
                    imageClass += " hover:scale-110 object-cover";
                    break;
                  case 8:
                    containerClass = "w-full max-w-4xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " border-l-8 border-l-indigo-500";
                    imageClass += " grayscale-[0.8] hover:grayscale-0 hover:scale-105 transition-all duration-700";
                    break;
                  case 9:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    figureClass += " border-b-8 border-b-blue-500 shadow-2xl";
                    imageClass += " hover:brightness-125 transition-all duration-500";
                    break;
                  case 10:
                    containerClass = "w-full max-w-5xl mx-auto my-14 relative z-10 clear-both";
                    imageClass += " hover:scale-[1.08] sepia-[.5] hover:sepia-0 transition-all duration-1000";
                    break;
                  case 11:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    figureClass += " border-t-8 border-t-red-500 rounded-none shadow-[0_20px_50px_rgba(239,68,68,0.3)]";
                    imageClass += " hover:scale-105 transition-all";
                    break;
                  default:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " hover:scale-105";
                    break;
                }
              } else if (isAngel) {
                switch(singleImageCount) {
                  case 1:
                    containerClass = "w-full max-w-4xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " rounded-2xl border border-stone-200/50 dark:border-stone-800 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2";
                    imageClass += " grayscale-[0.6] hover:grayscale-0 hover:scale-[1.03] transition-all duration-700";
                    break;
                  case 2:
                    containerClass = "w-full max-w-4xl mx-auto my-20 relative z-10 clear-both";
                    figureClass += " rounded-3xl border border-stone-100 dark:border-stone-800/50 shadow-md hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] scale-90 hover:scale-[1.15] transition-all duration-700 ease-in-out";
                    imageClass += " brightness-95 hover:brightness-105 transition-all duration-700";
                    break;
                  default:
                    containerClass = "w-full my-12 relative z-10 clear-both";
                    imageClass += " hover:scale-105";
                    break;
                }
              } else if (isDanielaGlobal) {
                switch(singleImageCount) {
                  case 1:
                  case 2:
                    containerClass = "w-full max-w-2xl mx-auto my-12 relative z-10 clear-both"; // Smaller size
                    figureClass += " border-2 border-stone-100 dark:border-stone-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out";
                    imageClass += " hover:scale-[1.02] contrast-[1.05] saturate-[1.1] transition-all duration-500";
                    break;
                  case 3:
                    containerClass = "md:float-right md:w-[65%] lg:w-[60%] md:ml-10 mb-8 mt-2 relative z-10 clear-none";
                    figureClass += " border-2 border-stone-100 dark:border-stone-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 ease-out";
                    imageClass += " hover:scale-[1.03] contrast-[1.05] saturate-[1.1] transition-all duration-700";
                    break;
                  case 4:
                    containerClass = "w-full max-w-5xl mx-auto my-16 relative z-10 clear-both";
                    figureClass += " !rounded-3xl border border-stone-200/40 shadow-lg hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)] transition-all duration-700 overflow-hidden";
                    imageClass += " scale-[1.05] hover:scale-100 brightness-95 hover:brightness-110 saturate-[0.8] hover:saturate-[1.2] transition-all duration-1000 ease-in-out cursor-pointer";
                    break;
                  case 5:
                    containerClass = "w-full max-w-4xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " border-b-8 border-b-emerald-600 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-700";
                    imageClass += " sepia-[0.3] hover:sepia-0 contrast-[1.1] hover:contrast-125 transition-all duration-700 cursor-pointer";
                    break;
                  case 6:
                    containerClass = "w-full md:w-[110%] md:-ml-[5%] my-16 relative z-10 clear-both";
                    figureClass += " shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)] transition-all duration-1000";
                    imageClass += " grayscale-[0.5] hover:grayscale-0 hover:scale-[1.04] transition-all duration-1000 ease-out";
                    break;
                  default:
                    containerClass = "w-full max-w-4xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " border border-stone-100 dark:border-stone-800 shadow-lg hover:shadow-2xl hover:-rotate-1 transition-all duration-700";
                    imageClass += " hover:scale-[1.05] contrast-[1.1] transition-all duration-700";
                    break;
                }
              } else if (isSinuheGlobal) {
                switch(singleImageCount) {
                  case 1:
                    containerClass = "w-full max-w-4xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.1] hover:rotate-2 z-10 hover:z-40";
                    imageClass += " contrast-125 saturate-[1.2] hover:saturate-[1.5] cursor-pointer";
                    break;
                  case 2:
                    containerClass = "w-full max-w-6xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.08] hover:-translate-y-3 z-10 hover:z-40";
                    imageClass += " blur-[1px] hover:blur-none saturate-[1.3] hover:saturate-[1.6] cursor-pointer";
                    break;
                  default:
                    containerClass = "w-full max-w-3xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.1] hover:-rotate-2 z-10 hover:z-40";
                    imageClass += " sepia-[0.3] hover:sepia-0 saturate-150 hover:saturate-200 transition-all duration-1000 cursor-pointer";
                    break;
                }
              } else if (isDiegoMemes) {
                switch(singleImageCount) {
                  case 1:
                    containerClass = "w-full max-w-4xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(236,72,153,0.3)] border border-pink-500/20";
                    imageClass += " contrast-[1.1] hover:saturate-[1.3] transition-all duration-500 cursor-pointer";
                    break;
                  case 2:
                    containerClass = "w-full max-w-5xl mx-auto my-14 relative z-10 clear-both";
                    figureClass += " hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_15px_40px_rgba(139,92,246,0.3)] border border-purple-500/20";
                    imageClass += " hover:contrast-[1.2] transition-all duration-500 cursor-pointer";
                    break;
                  default:
                    containerClass = "w-full max-w-3xl mx-auto my-12 relative z-10 clear-both";
                    figureClass += " hover:scale-[1.04] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] border border-blue-500/20";
                    imageClass += " hover:saturate-[1.2] transition-all duration-500 cursor-pointer";
                    break;
                }
              } else if (isIanMedia && singleImageCount === 8) {
                containerClass = "lg:w-2/3 float-right ml-6 mb-4 mt-16 md:mt-20 relative z-10 clear-none";
                figureClass = "group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-[#121214] relative";
                imageClass += " hover:scale-105";
              } else if (isIanMedia && singleImageCount === 2) {
                containerClass = "w-full my-12 relative z-10 clear-both";
                figureClass = "group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-[#121214] relative hover:scale-[1.02] hover:z-50 cursor-pointer";
              } else if (isIanMedia && singleImageCount === 1) {
                containerClass = "w-full my-12 relative z-10 clear-both";
                figureClass = "group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-[#121214] relative saturate-150 contrast-105";
              } else {
                containerClass = "w-full my-12 relative z-10 clear-both";
                imageClass += " hover:scale-105";
              }
            } else if (isSinuheGlobal) {
              // Si no es single (ej. un grid de imágenes), aplicar efectos generales a las imágenes en Sinuhe
              containerClass = "my-14 w-full clear-both";
              figureClass += " border-none shadow-none hover:shadow-none !overflow-visible z-10 hover:!z-50 group-hover/grid:scale-75 group-hover/grid:opacity-30 group-hover/grid:blur-[3px] hover:!scale-[2.2] hover:!opacity-100 hover:!blur-none transition-all duration-700 ease-out origin-center cursor-zoom-in";
              imageClass += " contrast-[1.15] saturate-[1.2] hover:saturate-150 transition-all duration-700 ease-out";
            } else if (isDiegoMemes) {
              containerClass = "my-14 w-full clear-both";
              figureClass += " !overflow-visible z-10 hover:!z-50 group-hover/grid:scale-90 group-hover/grid:opacity-50 hover:!scale-[1.8] hover:!opacity-100 transition-all duration-500 ease-out origin-center cursor-zoom-in !bg-transparent !shadow-none !border-none";
              imageClass += " contrast-[1.05] hover:contrast-[1.2] hover:saturate-[1.1] transition-all duration-500 ease-out rounded-xl";
            }

            let gridClass = "";
            if (isDiegoMemes && block.items.length > 1 && block.items.every(m => m.type === 'video')) {
              if (!(isPerlaValeria && block.isImage4Target)) containerClass = "my-16 w-full max-w-3xl mx-auto clear-both";
              gridClass = "grid grid-cols-1 gap-16 relative z-10";
            } else if (block.items.length === 2) {
              if (!(isPerlaValeria && block.isImage4Target)) containerClass = "my-14 w-full clear-both";
              gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 group/grid";
            } else if (block.items.length === 4) {
              if (!(isPerlaValeria && block.isImage4Target)) containerClass = "my-14 w-full clear-both";
              gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 group/grid";
            } else if (block.items.length > 2) {
              if (!(isPerlaValeria && block.isImage4Target)) containerClass = "my-14 w-full clear-both";
              gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 group/grid";
            }

            if (isAnaSofia && block.items.length > 2) {
              containerClass = "my-14 w-full max-w-4xl mx-auto clear-both";
              gridClass = "grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 group/grid";
            }

            if (isSinuheGlobal && block.items.some(item => item.type === 'video')) {
              containerClass = "w-full max-w-5xl mx-auto my-16 relative z-10 clear-both";
              figureClass = "group flex flex-col overflow-hidden w-full h-full rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.2)] border-4 border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-[0_40px_100px_rgba(16,185,129,0.4)] transition-all duration-700 hover:-translate-y-2 bg-black";
            }

            let imageWrapperClass = "overflow-hidden w-full h-full " + ((isSinuheGlobal || isDiegoMemes || isDavidRojas || isAnaSofia || isPerlaValeria || isGael) ? "bg-transparent flex justify-center items-center" : "bg-stone-100 dark:bg-stone-900");

            if (isDiegoMemes && block.items.length > 1 && block.items.some(m => m.type === 'video')) {
              const diegoImages = block.items.filter(m => m.type === 'image');
              const diegoVideos = block.items.filter(m => m.type === 'video');
              
              let dImgGridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 group/grid";
              if (diegoImages.length > 2) dImgGridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 group/grid";

              return (
                <div key={index} className="my-16 w-full max-w-5xl mx-auto clear-both">
                  {diegoImages.length > 0 && (
                    <div className={dImgGridClass}>
                      {diegoImages.map((media, mIdx) => {
                        const imgBorders = ["border-2 border-pink-500/50", "border-2 border-blue-500/50", "border-2 border-purple-500/50", "border-2 border-emerald-500/50"];
                        const currentBorder = imgBorders[mIdx % imgBorders.length];
                        return (
                          <figure key={'img-'+mIdx} className={figureClass}>
                            <div className={imageWrapperClass}>
                              <img src={media.url} alt="Evidencia visual" className={`${imageClass} ${currentBorder}`} loading="lazy" />
                            </div>
                            {(media.source && !hasSharedSource) && (
                              <figcaption className={figcaptionClass}>{media.source}</figcaption>
                            )}
                          </figure>
                        );
                      })}
                    </div>
                  )}
                  
                  {diegoVideos.length > 0 && (
                    <div className="grid grid-cols-1 gap-16 relative z-10 mt-16 max-w-3xl mx-auto">
                      {diegoVideos.map((media, mIdx) => {
                        const videoEffects = [
                          "hover:scale-[1.05] hover:-translate-y-2 border-2 border-pink-500/30 shadow-[0_15px_40px_rgba(236,72,153,0.2)] hover:border-pink-500/60",
                          "hover:scale-[1.05] hover:rotate-2 hover:-translate-y-1 border-2 border-indigo-500/30 shadow-[0_15px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/60",
                          "hover:scale-[1.05] hover:-translate-x-2 border-2 border-fuchsia-500/30 shadow-[0_15px_40px_rgba(217,70,239,0.2)] hover:border-fuchsia-500/60"
                        ];
                        const effect = videoEffects[mIdx % videoEffects.length];
                        const finalFigureClass = "group flex flex-col overflow-hidden w-full h-full rounded-2xl transition-all duration-700 bg-black " + effect;

                        return (
                          <figure key={'vid-'+mIdx} className={finalFigureClass}>
                            <div className="relative w-full aspect-video bg-black">
                              <iframe src={media.url} className="absolute top-0 left-0 w-full h-full border-0" allow="autoplay; encrypted-media" allowFullScreen title="Video de investigación"></iframe>
                            </div>
                            {(media.source && !hasSharedSource) && (
                              <figcaption className={figcaptionClass}>{media.source}</figcaption>
                            )}
                          </figure>
                        );
                      })}
                    </div>
                  )}
                  {hasSharedSource && (
                    <div className="mt-8 flex justify-center">
                      <span className="py-2 px-6 rounded-full text-sm font-semibold tracking-wide text-stone-500 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/80 shadow border border-stone-200 dark:border-stone-700">
                        {sharedSourceText.toLowerCase().includes('fuente') ? sharedSourceText : `Fuente: ${sharedSourceText}`}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={index} className={containerClass}>
                <div className={gridClass || "relative z-10"}>
                  {block.items.map((media, mIdx) => {
                    let finalFigureClass = figureClass;
                    let finalImageClass = imageClass;
                    if (isDiegoMemes) {
                      if (media.type === 'video') {
                        const videoEffects = [
                          "hover:scale-[1.05] hover:-translate-y-2 border-2 border-pink-500/30 shadow-[0_15px_40px_rgba(236,72,153,0.2)] hover:border-pink-500/60",
                          "hover:scale-[1.05] hover:rotate-2 hover:-translate-y-1 border-2 border-indigo-500/30 shadow-[0_15px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/60",
                          "hover:scale-[1.05] hover:-translate-x-2 border-2 border-fuchsia-500/30 shadow-[0_15px_40px_rgba(217,70,239,0.2)] hover:border-fuchsia-500/60"
                        ];
                        const effect = videoEffects[mIdx % videoEffects.length];
                        finalFigureClass = "group flex flex-col overflow-hidden w-full h-full rounded-2xl transition-all duration-700 bg-black " + effect;
                      } else {
                        const imgBorders = ["border-2 border-pink-500/50", "border-2 border-blue-500/50", "border-2 border-purple-500/50", "border-2 border-emerald-500/50"];
                        finalImageClass += " " + imgBorders[mIdx % imgBorders.length];
                      }
                    } else if (isDiegoPanini) {
                      if (media.type === 'image') {
                        const peculiarFigureStyles = [
                          // 1. The Minimalist (Thin elegant border)
                          "group flex flex-col overflow-hidden transition-all duration-700 border border-stone-200 dark:border-stone-700 shadow-md hover:shadow-2xl hover:-translate-y-2 rounded-xl bg-white dark:bg-[#121214] relative z-10 hover:z-50",
                          // 2. The Floating Glow (Subtle glowing edge)
                          "group flex flex-col overflow-hidden transition-all duration-700 border border-emerald-400/20 hover:border-emerald-400/50 shadow-[0_5px_15px_rgba(16,185,129,0.1)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.25)] rounded-2xl hover:-translate-y-3 bg-transparent relative z-10 hover:z-50",
                          // 3. The Asymmetric Leaf (One corner rounded, thin border)
                          "group flex flex-col overflow-hidden transition-all duration-700 border border-sky-400/30 hover:border-sky-400/60 shadow-lg hover:shadow-2xl rounded-tr-3xl rounded-bl-3xl hover:rounded-xl hover:rotate-1 bg-sky-50/10 dark:bg-sky-900/10 relative z-10 hover:z-50",
                          // 4. The Neon Line (Extremely thin neon border)
                          "group flex flex-col overflow-hidden transition-all duration-700 border border-rose-500/40 hover:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] rounded-lg hover:-translate-y-2 bg-transparent relative z-10 hover:z-50",
                          // 5. The Vintage Thin (Amber thin border, tilt)
                          "group flex flex-col overflow-hidden transition-all duration-700 border border-amber-500/30 hover:border-amber-500/60 shadow-md hover:shadow-xl rounded-md hover:-rotate-1 bg-amber-50 dark:bg-amber-900/10 relative z-10 hover:z-50"
                        ];
                        const peculiarImageStyles = [
                          "w-full h-auto object-contain max-h-[800px] transition-all duration-700 hover:scale-[1.03]", // Minimalist
                          "w-full h-auto object-contain max-h-[800px] transition-all duration-700 hover:scale-[1.04] brightness-105", // Floating Glow
                          "w-full h-auto object-contain max-h-[800px] transition-all duration-700 contrast-[1.05] hover:contrast-100", // Asymmetric
                          "w-full h-auto object-contain max-h-[800px] transition-all duration-700 hover:scale-[1.04] saturate-[1.1] hover:saturate-125", // Neon Line
                          "w-full h-auto object-contain max-h-[800px] transition-all duration-700 sepia-[0.2] hover:sepia-0 hover:scale-[1.02]" // Vintage Thin
                        ];
                        
                        // Use singleImageCount to guarantee sequential effects regardless of text blocks between them
                        const sequentialCount = isSingle ? singleImageCount : singleImageCount + mIdx;
                        const effectIndex = (sequentialCount - 1) % peculiarFigureStyles.length;
                        finalFigureClass = peculiarFigureStyles[effectIndex];
                        finalImageClass = peculiarImageStyles[effectIndex];
                      }
                    } else if (isDavidRojas) {
                      const currentImageIndex = isSingle ? singleImageCount : singleImageCount + mIdx;
                      if (media.type === 'image') {
                        if (currentImageIndex === 1) {
                          // Imagen principal: sin efectos rotativos, pero conservando la transparencia para quitar el margen blanco
                          finalFigureClass = "group flex flex-col bg-transparent relative z-10 mix-blend-multiply dark:mix-blend-normal";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        } else {
                          finalFigureClass = "group flex flex-col transition-all duration-700 blur-[2px] hover:blur-none hover:saturate-150 hover:-translate-y-4 bg-transparent relative z-10 hover:z-50 mix-blend-multiply dark:mix-blend-normal";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        }
                      }
                    } else if (isAnaSofia) {
                      const currentImageIndex = isSingle ? singleImageCount : singleImageCount + mIdx;
                      if (media.type === 'video') {
                        media.source = "Cortesía de Pexels";
                        hasSharedSource = false;
                        finalFigureClass = "group flex flex-col bg-black relative z-10 hover:z-50 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl rounded-2xl overflow-hidden";
                      } else if (media.type === 'image') {
                        if (!isSingle) {
                          finalFigureClass = "group flex flex-col bg-transparent relative z-10 hover:z-50 mix-blend-multiply transition-all duration-500 hover:scale-[1.30] cursor-zoom-in";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px] mix-blend-multiply";
                        } else {
                          const distinctEffects = [
                            "group flex flex-col transition-all duration-700 sepia-[.7] hover:sepia-0 hover:scale-[1.08] hover:-rotate-2 bg-transparent relative z-10 hover:z-50 mix-blend-multiply cursor-zoom-in",
                            "group flex flex-col transition-all duration-700 blur-[2px] hover:blur-none hover:saturate-150 hover:-translate-y-4 bg-transparent relative z-10 hover:z-50 mix-blend-multiply cursor-zoom-in",
                            "group flex flex-col transition-all duration-700 grayscale hover:grayscale-0 hover:scale-[1.1] hover:rotate-3 bg-transparent relative z-10 hover:z-50 mix-blend-multiply cursor-zoom-in",
                            "group flex flex-col transition-all duration-700 brightness-75 hover:brightness-110 hover:contrast-125 hover:saturate-200 hover:-translate-x-2 bg-transparent relative z-10 hover:z-50 mix-blend-multiply cursor-zoom-in"
                          ];
                          finalFigureClass = distinctEffects[(currentImageIndex - 1) % distinctEffects.length];
                          finalImageClass = "w-full h-auto object-contain max-h-[800px] mix-blend-multiply";

                          if (currentImageIndex === 1) {
                             finalFigureClass = "group flex flex-col bg-transparent relative z-10 hover:z-50 mix-blend-multiply transition-all duration-500 cursor-zoom-in";
                             finalImageClass = "w-full h-auto object-contain max-h-[800px] mix-blend-multiply hover:scale-[1.05] transition-all duration-500";
                          }
                        }
                        
                        if (currentImageIndex === 1) {
                          media.source = "Intervención en publicidad oficial de la CDMX.";
                        } else if (currentImageIndex === 2 || currentImageIndex === 3) {
                          media.source = "Elementos policiales reprimiendo manifestaciones feministas en la CDMX mediante el uso de gas y equipo antimotines.";
                        } else {
                          media.source = null;
                        }
                        hasSharedSource = false;
                      }
                    } else if (isPerlaValeria) {
                      const currentImageIndex = media.perlaImageIndex || (isSingle ? singleImageCount : singleImageCount + mIdx);
                      if (media.type === 'image') {
                        if (currentImageIndex === 1) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 rounded-xl overflow-hidden p-1 bg-gradient-to-r from-green-500 via-white to-red-500 hover:scale-[1.02] shadow-lg";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px] rounded-lg bg-white";
                        } else if (currentImageIndex === 2) {
                          finalFigureClass = "group flex flex-col transition-all duration-700 w-1/2 md:w-1/3 mx-auto hover:w-full max-w-full overflow-hidden";
                          finalImageClass = "w-full h-auto object-contain transition-all duration-700";
                        } else if (currentImageIndex === 3) {
                          finalFigureClass = "group flex flex-col w-3/4 mx-auto transition-all duration-500 hover:-translate-y-2 hover:rotate-1 mix-blend-multiply bg-transparent relative z-10 cursor-zoom-in";
                          finalImageClass = "w-full h-auto object-contain max-h-[600px] mix-blend-multiply drop-shadow-md";
                        } else if (currentImageIndex === 4) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 hover:scale-[1.02] rounded-xl overflow-hidden shadow-md";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        } else if (currentImageIndex === 5) {
                          finalFigureClass = "group flex flex-col transition-all duration-700 blur-[4px] hover:blur-none hover:scale-[1.05]";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        } else if (currentImageIndex === 6) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 w-3/4 mx-auto border-4 border-blue-900 dark:border-blue-900 shadow-lg hover:shadow-xl rounded-xl overflow-hidden hover:rotate-1";
                          finalImageClass = "w-full h-auto object-contain";
                        } else if (currentImageIndex === 7) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 grayscale hover:grayscale-0 hover:scale-[1.05] rounded-xl overflow-hidden shadow-lg cursor-zoom-in mx-auto";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        } else if (currentImageIndex === 8) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 sepia-[.6] hover:sepia-0 hover:scale-[1.04] rounded-xl overflow-hidden shadow-xl ring-4 ring-stone-200 dark:ring-stone-800 cursor-zoom-in mx-auto";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px]";
                        } else if (currentImageIndex >= 9) {
                          finalFigureClass = "group flex flex-col transition-all duration-500 bg-white p-3 pb-10 -rotate-2 hover:rotate-0 hover:scale-[1.05] shadow-2xl mx-auto border border-stone-200 dark:border-stone-800 dark:bg-[#1a1a1c] cursor-zoom-in";
                          finalImageClass = "w-full h-auto object-contain max-h-[800px] rounded-sm";
                        }
                      }
                    }
                    
                    return (
                    <figure key={mIdx} className={finalFigureClass}>
                      {media.type === 'image' ? (
                        <div className={imageWrapperClass}>
                          <img src={media.url} alt="Evidencia visual" className={finalImageClass} loading="lazy" />
                        </div>
                      ) : (
                        <div className="relative w-full aspect-video bg-black">
                          <iframe 
                            src={media.url} 
                            className="absolute top-0 left-0 w-full h-full border-0" 
                            allow="autoplay; encrypted-media" 
                            allowFullScreen
                            title="Video de investigación"
                          ></iframe>
                        </div>
                      )}
                      {(media.source && !hasSharedSource) && (
                        <figcaption className={figcaptionClass}>
                          {media.source}
                        </figcaption>
                      )}
                    </figure>
                    );
                  })}
                </div>
                {hasSharedSource && (
                  <div className="mt-8 flex justify-center">
                    <span className="py-2 px-6 rounded-full text-sm font-semibold tracking-wide text-stone-500 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/80 shadow border border-stone-200 dark:border-stone-700">
                      {sharedSourceText.toLowerCase().includes('fuente') ? sharedSourceText : `Fuente: ${sharedSourceText}`}
                    </span>
                  </div>
                )}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-stone-50 dark:bg-[#09090b] text-stone-800 dark:text-stone-300 transition-colors duration-300 flex flex-col">
        
        {/* Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#09090b]/80 border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar al Archivo</span>
            </Link>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isDark ? <Sun className="w-5 h-5 text-stone-300" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>
          </div>
        </nav>

        {/* Contenido */}
        <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12 md:py-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-stone-500 font-medium animate-pulse">Extrayendo investigación de Google Docs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800/50">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
              <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:underline">Volver al inicio</Link>
            </div>
          ) : (
            <article className="animate-fade-in">
              {/* Encabezado del Artículo */}
              <header className="mb-16 text-center">
                <span className={`inline-block px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 border ${getThemeColor(simplifyTheme(data.metadata.tema))}`}>
                  {simplifyTheme(data.metadata.tema)}
                </span>
                
                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-10 text-stone-900 dark:text-stone-100 leading-[1.15]">
                  {displayTitulo}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-6">
                  <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800/50 px-6 py-3 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm">
                    <User className="w-6 h-6 text-indigo-500" />
                    <span className="font-bold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">{displayAutor}</span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-stone-200 dark:bg-stone-800 mt-12 mx-auto"></div>
              </header>

              {/* Cuerpo del Artículo (Extraído y Renderizado Mágicamente) */}
              <div className="article-content">
                {renderBlocks(data.blocks)}
              </div>
            </article>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 py-12 mt-20">
          <div className="max-w-4xl mx-auto px-6 text-center text-stone-500 text-sm">
            <p>© 2026 Proyecto Universitario Memoria Mundial.</p>
            <p className="mt-2 text-stone-400">Plataforma impulsada por React y Google Workspace</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
