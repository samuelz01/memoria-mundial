import React, { useState, useEffect, useRef } from 'react';
import { 
  Search,
  ArrowRight,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { temas } from './data';

const FILTER_THEMES = [
  'Tecnologías', 'Expresión cultural', 'Discurso de odio', 'Origen de los jugadores', 
  'Fast Fashion', 'Género / Feminismo', 'Desaparecidos', 'Álbum Panini', 
  'Irán y guerras', 'Apuestas deportivas', 'Desigualdad estructural', 
  'Monopolio', 'Festejo', 'Publicidad', 'Cobertura de medios'
];

const themeDetails = {
  1: { tag: 'Investigación', descripcion: 'Comparación (1970 / 1986 - 2026) en México.' },
  2: { tag: 'Cultura', descripcion: 'Expresión cultural e identidad (memes, etc.).' },
  3: { tag: 'Sociedad', descripcion: 'Discurso de odio en Copas: Nacionalismo y prejuicios.' },
  4: { tag: 'Deporte', descripcion: 'Nacionales vs. extranjeros.' },
  5: { tag: 'Medio Ambiente', descripcion: 'Huella de carbono y Clima.' },
  6: { tag: 'Derechos', descripcion: 'Jugadoras y Violencia sexual.' },
  7: { tag: 'Derechos Humanos', descripcion: 'Visibilización de desaparecidos en México (ejemplos en EE. UU. y Canadá).' },
  8: { tag: 'Cultura Popular', descripcion: 'El fenómeno del Álbum Panini.' },
  9: { tag: 'Geopolítica', descripcion: 'Irán y guerras globales.' },
  10: { tag: 'Economía', descripcion: 'Apuestas deportivas.' },
  11: { tag: 'Sociedad', descripcion: 'Desigualdad estructural.' },
  12: { tag: 'Economía', descripcion: 'Hipercomercialización y Merchandising.' },
  13: { tag: 'Sociedad', descripcion: 'Festejo y Destrozos.' },
  14: { tag: 'Comunicación', descripcion: 'Publicidad (integrada).' },
  15: { tag: 'Medios', descripcion: 'Cobertura de los medios.' }
};

const heights = ['h-64', 'h-80', 'h-96'];
const bgLights = ['bg-stone-100', 'bg-slate-100', 'bg-gray-100', 'bg-zinc-100', 'bg-neutral-100'];
const bgDarks = ['dark:bg-stone-900', 'dark:bg-slate-900', 'dark:bg-gray-900', 'dark:bg-zinc-900', 'dark:bg-neutral-900'];

const archiveItems = temas.map((t) => {
  const details = themeDetails[t.id] || { tag: 'Archivo', descripcion: '' };
  return {
    id: t.id,
    img: t.imagen,
    title: t.titulo,
    description: details.descripcion,
    tag: details.tag,
    heightClass: heights[t.id % heights.length],
    bgLight: bgLights[t.id % bgLights.length],
    bgDark: bgDarks[t.id % bgDarks.length]
  };
});

const MethodologyPage = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in">
    <div className="mb-12 text-center">
      <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-stone-900 dark:text-stone-100">
        Metodología de Investigación
      </h2>
      <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-lg">
        Un enfoque documental interdisciplinario y crítico para analizar el megaevento desde los márgenes.
      </p>
      <div className="h-1 w-20 bg-rose-600 mt-6 rounded-full mx-auto"></div>
    </div>

    <div className="space-y-12 text-stone-700 dark:text-stone-300 leading-relaxed text-base md:text-lg">
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400">1. Archivo Documental Físico y Digital</h3>
        <p className="mb-4">
          Nuestra base metodológica reposa en el rastreo y curaduría de documentos oficiales, licitaciones de infraestructura, contratos de publicidad estatal y registros de prensa local. A través de este archivo digitalizado, pretendemos confrontar las promesas oficiales de desarrollo con la distribución real de los presupuestos y la transformación del espacio urbano.
        </p>
      </section>

      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400">2. Perspectiva de Género e Interseccionalidad</h3>
        <p className="mb-4">
          Investigamos la precarización laboral y la violencia sistemática en el contexto del turismo masivo. Por medio de entrevistas con colectivas y organizaciones en los alrededores de los estadios, documentamos el incremento de la especulación inmobiliaria y sus consecuencias en las trabajadoras informales y residentes locales.
        </p>
      </section>

      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400">3. Análisis de Discurso en Entornos Digitales</h3>
        <p className="mb-4">
          Con herramientas de análisis semántico y recolección de datos públicos, analizamos la polarización y la proliferación de discursos xenófobos y nacionalistas en plataformas digitales durante el periodo de preparación y ejecución de la Copa del Mundo.
        </p>
      </section>

      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400">4. Mapeo Satelital y Catastro Crítico</h3>
        <p className="mb-4">
          Colaboramos con urbanistas para trazar de forma geoespacial los procesos de gentrificación y desplazamiento forzado a lo largo de las zonas circundantes a los estadios Azteca (CDMX), BBVA (Monterrey) y Akron (Guadalajara).
        </p>
      </section>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in">
    <div className="mb-12 text-center">
      <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-stone-900 dark:text-stone-100">
        Acerca del Proyecto
      </h2>
      <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-lg">
        Memoria del Mundial 2026: Una iniciativa colectiva para registrar las realidades alternas al megaevento.
      </p>
      <div className="h-1 w-20 bg-rose-600 mt-6 rounded-full mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-700 dark:text-stone-300">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-stone-900 dark:text-stone-100">¿Qué es este Archivo?</h3>
        <p className="leading-relaxed">
          <strong>Memoria Mundial 2026</strong> es un archivo digital independiente, transdisciplinario y de libre acceso. Nace con el propósito de contraponer una memoria histórica crítica frente a los discursos institucionales hipercomerciales que acompañan a la Copa Mundial de la FIFA en México, Estados Unidos y Canadá.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-semibold mb-4 text-stone-900 dark:text-stone-100">Nuestra Misión</h3>
        <p className="leading-relaxed">
          Buscamos visibilizar las problemáticas urbanas, laborales y de derechos humanos que los megaeventos deportivos suelen ocultar bajo una narrativa triunfalista. Mediante la recopilación de datos, ensayos y fotoperiodismo de campo, construimos una memoria viva de los impactos reales en las comunidades locales.
        </p>
      </div>

      <div className="md:col-span-2 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-2/3">
          <h3 className="font-serif text-2xl font-semibold mb-4 text-stone-900 dark:text-stone-100">Participación Ciudadana</h3>
          <p className="leading-relaxed mb-4">
            Este es un proyecto abierto. Académicos, activistas, periodistas y ciudadanos interesados en aportar testimonios, fotografías o documentos sobre las transformaciones en sus comunidades son bienvenidos a colaborar con nuestro equipo de investigación.
          </p>
          <button className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
            Contactar al Equipo
          </button>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img src="/imagenes/logo.webp" className="h-32 w-auto opacity-80 dark:opacity-60" alt="Logo de fondo" />
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState({});
  
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
    }
  }, []);

  // Update suggestions dynamically as user types
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = FILTER_THEMES.filter(theme => 
      theme.toLowerCase().includes(query)
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  }, [searchQuery]);

  // Click outside listener for autocomplete suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setSelectedFilter(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Filter items based on selectedFilter (category) and searchQuery (typed query)
  const filteredItems = archiveItems.filter((item) => {
    const matchesFilter = selectedFilter ? item.title === selectedFilter : true;
    const matchesSearch = searchQuery.trim() !== '' 
      ? (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesFilter && matchesSearch;
  });

  const scrollToArchivo = () => {
    setActiveTab('inicio');
    setTimeout(() => {
      const element = document.getElementById('archivo-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors duration-300 selection:bg-emerald-200 dark:selection:bg-emerald-900/50">
        
        {/* Navbar */}
        <nav className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo Clickeable */}
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('inicio');
                setSearchQuery('');
                setSelectedFilter(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-shrink-0 items-center gap-3 transition-transform hover:scale-105"
            >
              <img src="/imagenes/logo.webp" className="h-16 w-auto" alt="Memoria Mundial Logo" />
              <span className="font-serif text-sm font-medium tracking-wider text-stone-600 dark:text-stone-400">Memoria del Mundial</span>
            </a>
            
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <button 
                onClick={() => {
                  setActiveTab('inicio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className={`transition-colors focus:outline-none ${activeTab === 'inicio' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'hover:text-emerald-700 dark:hover:text-emerald-400 text-stone-600 dark:text-stone-300'}`}
              >
                Inicio
              </button>
              <button 
                onClick={scrollToArchivo} 
                className="hover:text-emerald-700 dark:hover:text-emerald-400 text-stone-600 dark:text-stone-300 transition-colors focus:outline-none"
              >
                Archivo
              </button>
              <button 
                onClick={() => setActiveTab('metodologia')} 
                className={`transition-colors focus:outline-none ${activeTab === 'metodologia' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'hover:text-emerald-700 dark:hover:text-emerald-400 text-stone-600 dark:text-stone-300'}`}
              >
                Metodología
              </button>
              <button 
                onClick={() => setActiveTab('acerca')} 
                className={`transition-colors focus:outline-none ${activeTab === 'acerca' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'hover:text-emerald-700 dark:hover:text-emerald-400 text-stone-600 dark:text-stone-300'}`}
              >
                Acerca de
              </button>
            </div>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-5 h-5 text-stone-300" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          {activeTab === 'inicio' && (
            <div className="animate-fade-in">
              {/* Hero Banner Full-Width con Fondo Nítido y Texto Tricolor */}
              <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
                {/* Imagen de fondo local sin blur */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url('/imagenes/hero-banner.webp')", backgroundPosition: "center 10%" }}
                />
                {/* Overlay oscuro ligero para máxima nitidez */}
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Contenido centrado */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-wide drop-shadow-lg">
                    <span className="text-green-600">Memoria</span>{' '}
                    <span className="text-white">del</span>{' '}
                    <span className="text-red-600">Mundial</span>
                  </h1>
                  <p className="text-lg md:text-xl text-stone-100 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    Un archivo documental interdisciplinario con enfoque crítico sobre el impacto sociopolítico y cultural en México 2026.
                  </p>
                  <button 
                    onClick={scrollToArchivo}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-900"
                  >
                    Explorar el Archivo <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </section>

              {/* Buscador y Barra de Filtros */}
              <section id="archivo-section" className="max-w-7xl mx-auto px-6 pt-10 pb-4 scroll-mt-24">
                <div className="flex flex-col gap-6">
                  {/* Buscador */}
                  <div ref={searchContainerRef} className="relative max-w-2xl mx-auto w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-stone-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => { if (searchQuery) setShowSuggestions(true); }}
                      className="block w-full pl-11 pr-16 py-3.5 border border-stone-200 dark:border-stone-700 rounded-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm"
                      placeholder="Buscar investigaciones, documentos, autores..." 
                    />
                    
                    {/* Clear search button */}
                    {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedFilter(null); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        aria-label="Limpiar búsqueda"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    {/* Autocomplete Dropdown Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 focus:outline-none">
                        {suggestions.map((suggestion, idx) => (
                          <li 
                            key={idx}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className={`px-5 py-3 cursor-pointer text-sm transition-colors ${
                              idx === activeSuggestionIndex 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium' 
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                            }`}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Filtros Horizontales (Píldoras) */}
                  <div className="flex overflow-x-auto whitespace-nowrap gap-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                      onClick={() => { setSelectedFilter(null); setSearchQuery(''); }}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:-translate-y-0.5 ${
                        !selectedFilter 
                          ? 'border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-700 dark:border-emerald-700' 
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      Todos
                    </button>
                    {FILTER_THEMES.map((filter, index) => {
                      const isActive = selectedFilter === filter;
                      return (
                        <button 
                          key={index}
                          onClick={() => {
                            if (isActive) {
                              setSelectedFilter(null);
                            } else {
                              setSelectedFilter(filter);
                              setSearchQuery(''); 
                            }
                          }}
                          className={`px-5 py-2 rounded-full border text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:-translate-y-0.5 ${
                            isActive
                              ? 'border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-700 dark:border-emerald-700'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Grid Asimétrico (Mosaico de 15 Tarjetas) */}
              <section className="max-w-7xl mx-auto px-6 py-10 pb-24">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-stone-100/50 dark:bg-stone-900/30 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
                    <p className="text-stone-500 dark:text-stone-400 text-lg">No se encontraron investigaciones para tu búsqueda o filtro.</p>
                    <button 
                      onClick={() => { setSelectedFilter(null); setSearchQuery(''); }}
                      className="mt-4 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                    {filteredItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`break-inside-avoid relative group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 ${item.bgLight} ${item.bgDark} shadow-sm hover:shadow-xl transition-all duration-300`}
                      >
                        <div className={`overflow-hidden flex items-center justify-center w-full ${item.heightClass}`}>
                          <img 
                            src={item.img} 
                            alt={item.title} 
                            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out ${loadedImages[item.id] ? 'opacity-100 blur-none' : 'opacity-0 blur-md scale-110'}`}
                            loading="lazy"
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          />
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400 mb-2 block transition-colors duration-300">
                            {item.tag}
                          </span>
                          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 leading-tight mb-2 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'metodologia' && <MethodologyPage />}
          {activeTab === 'acerca' && <AboutPage />}
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 py-8 text-center text-stone-500 text-sm transition-colors duration-300">
          <p>© 2026 Proyecto Universitario Memoria Mundial. Archivo Crítico Documental.</p>
        </footer>
      </div>
    </div>
  );
}
