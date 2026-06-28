import React, { useState, useEffect } from 'react';
import { 
  Library, 
  MapPin, 
  Users, 
  MonitorPlay, 
  MessageSquareWarning, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

const THEMES = [
  {
    title: 'Apuestas Deportivas',
    description: 'Análisis del monopolio de plataformas de apuestas y la hipercomercialización del deporte.',
    badge: 'Economía',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <Library className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Desigualdad Estructural',
    description: 'Impacto en la gentrificación, limpieza social y el precio excluyente de los boletos.',
    badge: 'Sociedad',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    icon: <MapPin className="w-6 h-6 text-rose-600 dark:text-rose-400" />
  },
  {
    title: 'Género y Feminismo',
    description: 'Condiciones de las jugadoras, dinámicas de acoso y violencia en el ecosistema del fútbol.',
    badge: 'Derechos',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Tecnologías y Control',
    description: 'Comparativa histórica de infraestructuras de vigilancia y medios entre 1986 y 2026.',
    badge: 'Historia',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    icon: <MonitorPlay className="w-6 h-6 text-rose-600 dark:text-rose-400" />
  },
  {
    title: 'Discursos de Odio',
    description: 'Racismo, clasismo y xenofobia amplificados en redes sociales durante el megaevento.',
    badge: 'Cultura Digital',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <MessageSquareWarning className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
  }
];

const ARCHIVE_ITEMS = [
  {
    id: 1,
    img: '/imagenes/imagen_1.jpg',
    title: 'Título de la Investigación aquí',
    description: 'Aquí se visualizará el resumen del documento extraído de Google Drive, con los metadatos relevantes del archivo documental.',
    tag: 'Documento'
  },
  {
    id: 2,
    img: '/imagenes/imagen_2.jpg',
    title: 'Análisis sobre el impacto en sedes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tag: 'Investigación'
  },
  {
    id: 3,
    img: '/imagenes/imagen_3.jpg',
    title: 'Documento en espera de carga',
    description: 'Este espacio está reservado para mostrar el contenido dinámico una vez que la integración con la base de datos y Google Drive esté lista.',
    tag: 'Archivo'
  },
  {
    id: 4,
    img: '/imagenes/imagen_4.jpg',
    title: 'Registro fotográfico del evento',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at erat in purus viverra dignissim.',
    tag: 'Fotoperiodismo'
  },
  {
    id: 5,
    img: '/imagenes/imagen_5.jpg',
    title: 'Reporte de monitoreo digital',
    description: 'Aquí se visualizará un extracto del informe técnico correspondiente a la sección de tecnologías de vigilancia.',
    tag: 'Análisis'
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors duration-300 selection:bg-emerald-200 dark:selection:bg-emerald-900/50">
        
        {/* Navbar */}
        <nav className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="font-serif text-xl font-semibold tracking-wide">
              Memoria Mundial
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Inicio</a>
              <a href="#" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Archivo</a>
              <a href="#" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Metodología</a>
              <a href="#" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Acerca de</a>
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
          {/* Hero Banner Full-Width */}
          <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
            {/* Imagen de fondo local */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/imagenes/hero-banner.jpg')", backgroundPosition: "center 10%" }}
            />
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-stone-950/80 to-transparent" />
            
            {/* Contenido centrado */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-wide drop-shadow-lg">
                Memoria del Mundial
              </h1>
              <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Un archivo documental interdisciplinario con enfoque crítico sobre el impacto sociopolítico y cultural en México 2026.
              </p>
              <button className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-900">
                Explorar el Archivo <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Archivo Visual (Masonry) */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="mb-12 text-center md:text-left">
              <h2 className="font-serif text-3xl font-semibold">Últimas Investigaciones</h2>
              <div className="h-1 w-20 bg-rose-600 mt-4 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* Masonry Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {ARCHIVE_ITEMS.map((item) => (
                <div 
                  key={item.id} 
                  className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="overflow-hidden bg-stone-100 dark:bg-stone-950 flex items-center justify-center">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400 mb-2 block transition-colors duration-300">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 leading-tight mb-2 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grid de Ejes de Investigación */}
          <section className="max-w-7xl mx-auto px-6 py-12 pb-24">
            <div className="mb-12 text-center md:text-left">
              <h2 className="font-serif text-3xl font-semibold">Ejes de Investigación</h2>
              <div className="h-1 w-20 bg-emerald-600 mt-4 rounded-full mx-auto md:mx-0"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {THEMES.map((theme, index) => (
                <div 
                  key={index} 
                  className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-stone-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200 dark:hover:shadow-black/20 cursor-pointer flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-100 dark:border-stone-800 group-hover:scale-110 transition-transform">
                      {theme.icon}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-300 ${theme.badgeColor}`}>
                      {theme.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-3 text-stone-900 dark:text-stone-100 transition-colors duration-300">
                    {theme.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed flex-grow transition-colors duration-300">
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 py-8 text-center text-stone-500 text-sm transition-colors duration-300">
          <p>© 2026 Proyecto Universitario Memoria Mundial. Archivo Crítico Documental.</p>
        </footer>
      </div>
    </div>
  );
}
