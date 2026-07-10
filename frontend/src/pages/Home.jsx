import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Sun, Moon, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';



const themeColors = [
  'text-rose-600 dark:text-rose-400',
  'text-indigo-600 dark:text-indigo-400',
  'text-sky-600 dark:text-sky-400',
  'text-amber-600 dark:text-amber-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-violet-600 dark:text-violet-400',
  'text-fuchsia-600 dark:text-fuchsia-400',
  'text-orange-600 dark:text-orange-400'
];

const themeHoverClasses = [
  'hover:border-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:border-rose-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30',
  'hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:border-indigo-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/30',
  'hover:border-sky-600 hover:text-sky-600 hover:bg-sky-50 dark:hover:border-sky-400 dark:hover:text-sky-400 dark:hover:bg-sky-950/30',
  'hover:border-amber-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:border-amber-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30',
  'hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:border-emerald-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30',
  'hover:border-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:hover:border-violet-400 dark:hover:text-violet-400 dark:hover:bg-violet-950/30',
  'hover:border-fuchsia-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:border-fuchsia-400 dark:hover:text-fuchsia-400 dark:hover:bg-fuchsia-950/30',
  'hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:border-orange-400 dark:hover:text-orange-400 dark:hover:bg-orange-950/30'
];

const getThemeColor = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return themeColors[Math.abs(hash) % themeColors.length];
};

const getThemeHoverClass = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return themeHoverClasses[Math.abs(hash) % themeHoverClasses.length];
};

const formatTitle = (title) => {
  if (!title) return 'Sin título';
  const smallWords = ['de', 'en', 'el', 'la', 'los', 'las', 'y', 'del', 'al', 'un', 'una', 'unos', 'unas', 'sobre', 'con', 'por', 'para', 'vs'];
  return title.toLowerCase().split(' ').map((word, i) => {
    if (i !== 0 && smallWords.includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const simplifyTheme = (rawTheme) => {
  if (!rawTheme) return 'Otro';
  return rawTheme.split('->')[0].split('-')[0].trim();
};

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

export default function Home({ isDark, toggleTheme }) {
  const [archiveItems, setArchiveItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState({});
  
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchInvestigaciones = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/investigaciones');
        const data = await response.json();
        
        const formattedItems = data
          .filter(t => !t.autor.toLowerCase().includes('rovelo'))
          .map((t, index) => {
            const simpleTheme = simplifyTheme(t.tema);
            return {
              id: t.id,
              img: t.portada 
                ? (t.portada.startsWith('/imagenes') ? t.portada : `http://localhost:5000/api/image/${t.portada}`)
                : '/imagenes/no-portada.webp',
              title: formatTitle(t.titulo),
              description: `Autor: ${formatTitle(t.autor)}`,
              tag: simpleTheme,
              colorClass: getThemeColor(simpleTheme),
              isFallback: !t.portada
            };
          });
        
        // Revolver (shuffle) los elementos aleatoriamente
        for (let i = formattedItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [formattedItems[i], formattedItems[j]] = [formattedItems[j], formattedItems[i]];
        }
        
        setArchiveItems(formattedItems);
      } catch (error) {
        console.error("Error cargando investigaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestigaciones();
  }, []);

  const dynamicThemes = Array.from(new Set(archiveItems.map(item => item.tag))).filter(Boolean).sort();

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matchedThemes = dynamicThemes.filter(theme => 
      theme.toLowerCase().includes(query)
    );
    const matchedAuthors = archiveItems
      .filter(item => item.description.toLowerCase().includes(query))
      .map(item => item.description.replace('Autor: ', ''));
    const matchedTitles = archiveItems
      .filter(item => item.title.toLowerCase().includes(query))
      .map(item => item.title);
      
    const combined = Array.from(new Set([...matchedThemes, ...matchedAuthors, ...matchedTitles])).slice(0, 8);
    setSuggestions(combined);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  }, [searchQuery, archiveItems]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    if (dynamicThemes.includes(suggestion)) {
      setSelectedFilter(suggestion);
    } else {
      setSelectedFilter(null);
    }
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

  const filteredItems = archiveItems.filter((item) => {
    const matchesFilter = selectedFilter ? item.tag === selectedFilter : true;
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
        
        <nav className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link 
              to="/" 
              onClick={() => {
                setActiveTab('inicio');
                setSearchQuery('');
                setSelectedFilter(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-shrink-0 items-center gap-3 transition-transform hover:opacity-80"
            >
              <img src="/imagenes/logo.webp" className="h-14 w-auto drop-shadow-sm" alt="Memoria Mundial Logo" />
              <span className="font-serif text-lg font-semibold tracking-wide text-stone-800 dark:text-stone-200">Memoria del Mundial</span>
            </Link>
            
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
              <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url('/imagenes/hero-banner.webp')", backgroundPosition: "center 10%" }}
                />
                <div className="absolute inset-0 bg-black/30" />
                
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

              <section id="archivo-section" className="max-w-7xl mx-auto px-6 pt-10 pb-4 scroll-mt-24">
                <div className="flex flex-col gap-6">
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
                    
                    {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedFilter(null); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        aria-label="Limpiar búsqueda"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

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

                  <div className="flex flex-wrap justify-center gap-3 pb-4">
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
                    {dynamicThemes.map((filter, index) => {
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
                              : `border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 ${getThemeHoverClass(filter)}`
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="max-w-7xl mx-auto px-6 py-10 pb-24">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-stone-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Cargando investigaciones desde Google Drive...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
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
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {filteredItems.map((item) => (
                      <Link 
                        to={`/investigacion/${item.id}`}
                        key={item.id} 
                        className="block break-inside-avoid relative group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121214] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      >
                        <div className={`flex items-center justify-center w-full bg-stone-50 dark:bg-[#1a1a1c] ${item.isFallback ? 'aspect-[4/3] p-8' : ''}`}>
                          <img 
                            src={item.img} 
                            alt={item.title} 
                            className={`w-full ${item.isFallback ? 'h-full object-contain opacity-30 mix-blend-multiply dark:mix-blend-screen' : 'h-auto object-cover block'} group-hover:scale-105 transition-all duration-700 ease-in-out ${loadedImages[item.id] ? 'opacity-100 blur-none' : 'opacity-0 blur-md scale-110'}`}
                            loading="lazy"
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                            onError={(e) => { 
                              e.target.src = '/imagenes/logo.webp';
                              e.target.className = 'w-full h-full object-contain opacity-30 mix-blend-multiply dark:mix-blend-screen group-hover:scale-105 transition-all duration-700 ease-in-out';
                              e.target.parentElement.classList.add('aspect-[4/3]', 'p-8');
                            }}
                          />
                        </div>
                        <div className="p-5 flex flex-col items-center text-center">
                          <span className={`inline-block px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] uppercase tracking-wider font-bold mb-3 transition-colors duration-300 ${item.colorClass}`}>
                            {item.tag}
                          </span>
                          <h3 className="font-sans text-lg font-semibold text-stone-900 dark:text-stone-100 leading-snug mb-2 transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {item.title}
                          </h3>
                          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'metodologia' && <MethodologyPage />}
          {activeTab === 'acerca' && <AboutPage />}
        </main>

        <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 py-8 text-center text-stone-500 text-sm transition-colors duration-300">
          <p>© 2026 Proyecto Universitario Memoria Mundial. Archivo Crítico Documental.</p>
        </footer>
      </div>
    </div>
  );
}
