import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import AlbumCard from '../components/AlbumCard';
import { Flame, Star, Sparkles, Globe } from 'lucide-react';

export default function AlbumList({ apiEndpoint }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Define o visual baseado na rota atual
  const getPageConfig = () => {
    switch (location.pathname) {
      case '/trending':
        return {
          title: 'Em Alta',
          description: 'Os álbuns que estão movimentando a comunidade. Baseado no volume de reviews da última semana.',
          icon: <Flame size={48} />,
          color: '#ec8134de', 
          gradient: 'rgba(255, 124, 31, 0.14)'
        };
      case '/top-rated':
        return {
          title: 'Melhores Avaliações',
          description: 'A elite da música: estes são os álbuns com as maiores médias de todos os tempos no Scorefy.',
          icon: <Star size={48} fill="#fabf0dff" />,
          color: '#fcc00dff',
          gradient: 'rgba(248, 188, 7, 0.16)'
        };
      case '/releases':
        return {
          title: 'Novos Lançamentos',
          description: 'Fique atualizado com as novidades mais recentes que acabaram de chegar ao nosso catálogo.',
          icon: <Sparkles size={48} />,
          color: '#3b82f6',
          gradient: 'rgba(59, 131, 246, 0.21)'
        };
      default:
        return {
          title: 'Explorar',
          description: 'Descubra novos sons na nossa biblioteca completa.',
          icon: <Globe size={48} />,
          color: '#ffffff',
          gradient: 'rgba(255, 255, 255, 0.1)'
        };
    }
  };

  const config = getPageConfig();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000${apiEndpoint}`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id_album,
          title: item.title,
          artist: item.artist || item.nome_artista,
          image: item.image,
          rating: item.rating !== undefined ? item.rating : 0,
          year: item.year,
          genre: item.genre
        }));
        setAlbums(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setLoading(false);
      });
  }, [apiEndpoint]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
      <Header />

      {/* --- HERO HEADER --- */}
      <div style={{ 
        background: `linear-gradient(180deg, ${config.gradient} 0%, rgba(18, 18, 21, 0) 100%)`,
        padding: '64px 24px 32px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: '32px' }}>
          
          {/* Ícone grande c fundo */}
          <div style={{ 
            padding: '24px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '24px', 
            color: config.color,
            boxShadow: `0 8px 32px -8px ${config.gradient}`,
            backdropFilter: 'blur(10px)'
          }}>
            {config.icon}
          </div>

          <div style={{ paddingBottom: '4px' }}>
            <span style={{ 
              textTransform: 'uppercase', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              letterSpacing: '0.1em', 
              color: config.color,
              marginBottom: '8px',
              display: 'block'
            }}>
              Coleção Curada
            </span>
            <h1 style={{ fontSize: '56px', fontWeight: '900', margin: '0 0 12px 0', lineHeight: '1', letterSpacing: '-0.03em' }}>
              {config.title}
            </h1>
            <p style={{ fontSize: '18px', color: '#9ca3af', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
              {config.description}
            </p>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* CONTADOR */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '32px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e5e7eb' }}>
            {loading ? 'Carregando...' : `${albums.length} Álbuns encontrados`}
          </span>
        </div>

        {/* GRID DE ÁLBUNS */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#9ca3af' }}>
            Carregando coleção...
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '24px' 
          }}>
            {albums.map((album) => (
              <div key={album.id}>
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}