import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AlbumCard from '../components/AlbumCard';
import { mockAlbums } from '../lib/mockAlbums';
import { ArrowRight, Sparkles, Disc, Music } from 'lucide-react';


import billieImg from '../assets/Billie.jpg';
import taylorImg from '../assets/Taylor2.jpg';
import addisonImg from '../assets/addison.png';
import logoAddison from '../assets/addisonlogo.png';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // --- LÓGICA DO CARROSSEL ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      type: 'gradient',
      bg: 'linear-gradient(90deg, #0e4277ff 0%, #267fbbff 100%)',
      badge: 'Recomendado',
      badgeColor: '#caf3f8ff',
      icon: <Sparkles size={12} />,
      title: 'Descubra um novo jeito de curtir música.',
      desc: 'Avalie, compartilhe e descubra o que seus amigos estão ouvindo em tempo real.',
      btnText: 'Começar a Avaliar'
    },
    {
      id: 2,
      type: 'image',
      bg: billieImg,
      badge: 'Álbum em Destaque',
      badgeColor: '#5fc7f0ff',
      icon: <Disc size={12} />,
      title: 'HIT ME HARD AND SOFT',
      titleColor: '#83ecffff',
      overlay: 'linear-gradient(90deg, #0a3a5aff 0%, #103b63aa 30%, rgba(11, 83, 131, 0) 70%)',
      desc: 'Confira as avaliações do álbum eleito como "Melhor da Década" pelos nossos usuários.',
      btnText: 'Visitar Álbum'
    },
    {
      id: 3,
      type: 'image',
      bg: taylorImg,
      badge: 'Lançamento',
      badgeColor: '#fde68a',
      icon: <Music size={12} />,
      title: 'THE LIFE OF A SHOWGIRL',
      titleColor: '#f8dfb0ff',
      overlay: 'linear-gradient(90deg, #4b240dff 0%, #451a03aa 30%, rgba(92, 39, 10, 0) 80%)',
      desc: 'Confira as reações mistas da comunidade ao lançamento mais recente de Taylor Swift.',
      btnText: 'Visitar Álbum'
    },
    {
      id: 4,
      type: 'image',
      bg: addisonImg,
      badge: 'Em Alta',
      badgeColor: '#feffc4ff',
      icon: <Music size={12} />,
      title: 'ADDISON',
      titleImage: logoAddison,
      overlay: 'linear-gradient(90deg, #d4af36f3 0%, #58440baa 30%, rgba(128, 91, 12, 0) 80%)',
      desc: 'De celebridade da internet à indicada ao Grammy, conheça o álbum da Revelação do Ano pelo Scorefy.',
      btnText: 'Visitar Álbum'
    }
  ];

  // Timer: muda o banner a cada 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);
  // --- FIM LÓGICA CARROSSEL ---

  const safeAlbums = mockAlbums || [];
  const trendingAlbums = safeAlbums.slice(0, 5);
  const topRatedAlbums = safeAlbums.filter(a => a.rating >= 4.5);
  const newReleases = safeAlbums.slice(3, 8);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          body { 
            margin: 0; 
            background-color: #121215; 
            /* RESTAURADO: Fonte Plus Jakarta Sans */
            font-family: 'Plus Jakarta Sans', sans-serif; 
          }
        `}
      </style>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#121215',
          color: 'white',
          paddingBottom: '80px',
          boxSizing: 'border-box'
        }}
      >
        <Header onSearch={setSearchQuery} />

        <main
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px'
          }}
        >
          {searchQuery ? (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                Resultados para "{searchQuery}"
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '24px'
                }}
              >
                {safeAlbums
                  .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(album => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
              </div>
            </div>
          ) : (
            <>
              {/* --- HERO SECTION (CARROSSEL) --- */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '400px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Slides */}
                {slides.map((slide, index) => {
                  const isActive = index === currentSlide;

                  return (
                    <div
                      key={slide.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        zIndex: isActive ? 10 : 0,
                        background: slide.type === 'gradient' ? slide.bg : `url(${slide.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '32px 48px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Overlay para inagens */}
                      {slide.type === 'image' && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: slide.overlay || 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                            zIndex: -1
                          }}
                        />
                      )}

                      {/* Conteúdo do Slide */}
                      <div style={{ position: 'relative', zIndex: 20, maxWidth: '600px' }}>

                        {/* Badge */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: slide.badgeColor
                          }}
                        >
                          {slide.icon} <span>{slide.badge}</span>
                        </div>

                        {/* Título */}
                        {slide.titleImage ? (
                          <div
                            role="img"
                            aria-label={slide.title}
                            style={{
                              height: '120px', 
                              marginBottom: '5px',
                              width: '110%',

                              backgroundColor: slide.titleColor || '#6adbdfff',

                              maskImage: `url(${slide.titleImage})`,
                              WebkitMaskImage: `url(${slide.titleImage})`, 

                              maskSize: 'contain',
                              WebkitMaskSize: 'contain',

                              maskRepeat: 'no-repeat',
                              WebkitMaskRepeat: 'no-repeat',

                              maskPosition: 'left center',
                              WebkitMaskPosition: 'left center'
                            }}
                          />
                        ) : (
                          <h1
                            style={{
                              fontSize: slide.titleSize || '40px',
                              color: slide.titleColor || 'white',
                              fontWeight: '900',
                              marginBottom: '12px',
                              lineHeight: 1.1,
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                          >
                            {slide.title}
                          </h1>
                        )}

                        {/* Descrição */}
                        <p
                          style={{
                            color: '#e5e7eb',
                            marginBottom: '24px',
                            fontSize: '16px',
                            maxWidth: '480px',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          {slide.desc}
                        </p>

                        {/* Botão */}
                        <HeroButton text={slide.btnText} />
                      </div>

                      {/* Decoração para o slide Gradiente */}
                      {slide.type === 'gradient' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            filter: 'blur(80px)',
                            transform: 'translate(33%, -50%)',
                            pointerEvents: 'none',
                            background: 'rgba(99, 102, 241, 0.2)'
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Navegação do banner */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '12px',
                    zIndex: 30
                  }}
                >
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: idx === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.3)',
                        transform: idx === currentSlide ? 'scale(1.2)' : 'scale(1)',
                        padding: 0
                      }}
                      aria-label={`Ir para slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <SectionRow title="Em Alta" albums={trendingAlbums} />
              <SectionRow title="Melhores Avaliações" albums={topRatedAlbums} />
              <SectionRow title="Novos Lançamentos" albums={newReleases} />
            </>
          )}
        </main>
      </div>
    </>
  );
}

function HeroButton({ text }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '12px 32px',
        borderRadius: '9999px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {text}
    </button>
  );
}

function SectionRow({ title, albums }) {
  const [btnHover, setBtnHover] = useState(false);

  if (!albums || albums.length === 0) return null;

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          {title}
        </h2>

        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: btnHover ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 16px',
            borderRadius: '100px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease'
          }}
        >
          Ver Mais
          <div style={{ transform: btnHover ? 'translateX(2px)' : 'translateX(0)', transition: 'transform 0.2s', display: 'flex' }}>
            <ArrowRight size={14} />
          </div>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '16px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {albums.map((album, index) => (
          <div key={`${album.id}-${index}`} style={{ scrollSnapAlign: 'start' }}>
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}