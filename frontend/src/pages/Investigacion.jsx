import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, FileText, User } from 'lucide-react';

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
    const groupedBlocks = [];
    for (let i = 0; i < blocks.length; i++) {
       const b = blocks[i];
       if (b.type === 'image' || b.type === 'video') {
         const group = [b];
         while (i + 1 < blocks.length && (blocks[i+1].type === 'image' || blocks[i+1].type === 'video')) {
           group.push(blocks[i+1]);
           i++;
         }
         groupedBlocks.push({ type: 'media_group', items: group });
       } else {
         groupedBlocks.push(b);
       }
    }

    return (
      <div className="space-y-6 text-lg text-stone-800 dark:text-stone-300 leading-relaxed font-serif">
        {groupedBlocks.map((block, index) => {
          if (block.type === 'text') {
            // Un pequeño truco para detectar títulos (ej: "La Evolución de la Seguridad y el Acceso")
            const isHeading = block.content.length < 80 && !block.content.endsWith('.') && !block.content.endsWith(',') && !block.content.includes(':');
            
            // Ignorar el Autor del documento original (ya lo mostramos arriba)
            if (block.content.toLowerCase().startsWith('autor:')) return null;

            if (block.content === '---') {
              return <hr key={index} className="my-12 border-stone-200 dark:border-stone-800" />;
            }
            if (block.content.startsWith('Escrito por:')) {
              return <p key={index} className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-8">{block.content}</p>;
            }
            if (block.content.startsWith('Contacto:')) {
              return (
                <p key={index} className="text-md text-emerald-600 dark:text-emerald-400 font-medium mb-12">
                  <a href={`mailto:${block.content.replace('Contacto: ', '').trim()}`} className="hover:underline">
                    {block.content}
                  </a>
                </p>
              );
            }

            if (isHeading && index !== blocks.length - 1) {
              return <h2 key={index} className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-12 mb-6 leading-tight">{block.content}</h2>;
            }
            return <p key={index}>{block.content}</p>;
          }
          
          if (block.type === 'media_group') {
            const isSingle = block.items.length === 1;
            const gridClass = isSingle 
              ? 'columns-1' 
              : block.items.length === 2 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

            return (
              <div key={index} className={`my-12 w-full ${gridClass}`}>
                {block.items.map((media, mIdx) => (
                  <figure key={mIdx} className="flex flex-col rounded-2xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
                    {media.type === 'image' ? (
                      <img src={media.url} alt="Evidencia visual" className="w-full h-auto object-cover max-h-[700px]" loading="lazy" />
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
                    {media.source && (
                      <figcaption className="p-4 bg-stone-50 dark:bg-stone-950 text-sm italic text-stone-500 dark:text-stone-400 text-center border-t border-stone-200 dark:border-stone-800">
                        {media.source}
                      </figcaption>
                    )}
                  </figure>
                ))}
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
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors duration-300 selection:bg-emerald-200 dark:selection:bg-emerald-900/50">
        
        {/* Navbar */}
        <nav className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex flex-shrink-0 items-center gap-3 transition-transform hover:scale-105">
              <ArrowLeft className="w-5 h-5 text-stone-500" />
              <span className="font-serif text-sm font-medium tracking-wider text-stone-600 dark:text-stone-400">Volver al Archivo</span>
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
        <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12 md:py-20">
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
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-6 border border-emerald-200 dark:border-emerald-800/50">
                  {data.metadata.tema}
                </span>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-stone-900 dark:text-stone-100 leading-tight">
                  {data.metadata.titulo}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                    <User className="w-5 h-5" />
                    <span className="font-medium text-lg">{data.metadata.autor}</span>
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
