import React, { useState } from 'react';
import Header from '../components/Header';
import AlbumCard from '../components/AlbumCard';
import { mockAlbums } from '../lib/mockAlbums';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [btnHover, setBtnHover] = useState(false);

  // Filtros dos álbuns
  const safeAlbums = mockAlbums || [];
  const trendingAlbums = safeAlbums.slice(0, 5);
  const topRatedAlbums = safeAlbums.filter(a => a.rating >= 4.5);
  const newReleases = safeAlbums.slice(3, 8);

  return (
    <>
      {/* Truque para esconder scrollbar sem arquivo CSS externo */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: #121215; }
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
              {/* Hero Section */}
              <section
                style={{
                  position: 'relative',
                  borderRadius: '40px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(90deg, #1d5083 0%, #2c83bd 100%)'
                }}
              >
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '576px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#caf3f8ff'
                    }}
                  >
                    <Sparkles size={12} /> <span>Sugestão do dia</span>
                  </div>

                  <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px', lineHeight: 1.1 }}>
                    Descubra um novo jeito de curtir música.
                  </h1>
                  
                  <p style={{ color: '#d1d5db', marginBottom: '32px', fontSize: '18px' }}>
                    Avalie, compartilhe e descubra o que seus amigos estão ouvindo em tempo real.
                  </p>
                  
                  <button
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '12px 32px',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      transform: btnHover ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.2s',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Começar a Avaliar
                  </button>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    transform: 'translate(33%, -50%)',
                    pointerEvents: 'none',
                    background: 'rgba(99, 102, 241, 0.2)'
                  }}
                />
              </section>

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

function SectionRow({ title, albums }) {
  const [btnHover, setBtnHover] = useState(false);

  if (!albums || albums.length === 0) return null;

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          {title}
        </h2>
        
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: btnHover ? 'white' : '#6b7280',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'color 0.2s'
          }}
        >
          Ver Mais
          <div style={{ transform: btnHover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s', display: 'flex' }}>

          </div>
        </button>
      </div>

      <div
        className="hide-scrollbar" 
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '16px',
          scrollSnapType: 'x mandatory'
        }}
      >
        {albums.map((album, index) => (
          <div key={`${album.id}-${index}`} style={{ scrollSnapAlign: 'start' }}>
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </section>
  );
}