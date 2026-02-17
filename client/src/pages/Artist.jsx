import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AlbumCard from '../components/AlbumCard';
import { mockAlbums } from '../lib/mockAlbums';
import { BadgeCheck, User, Disc, Star } from 'lucide-react';

export default function Artist() {
  const { artistName } = useParams();
  const navigate = useNavigate();
  
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Decodifica o nome da URL (ex: "Billie%20Eilish" -> "Billie Eilish")
  const decodedName = decodeURIComponent(artistName);

  useEffect(() => {
    // Filtra os álbuns que pertencem a este artista
    const albums = mockAlbums.filter(a => a.artist.toLowerCase() === decodedName.toLowerCase());
    setArtistAlbums(albums);

    // Calcula a média de notas do artista 
    if (albums.length > 0) {
      const total = albums.reduce((acc, curr) => acc + curr.rating, 0);
      setAverageRating((total / albums.length).toFixed(1));
    }
  }, [decodedName]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
      <Header />

      {/* GRADIENTE FUNDO */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '500px',
          background: `radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(18, 18, 21, 1) 70%)`,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '64px' }}>
        
        {/* === HEADER DO ARTISTA === */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          
          {/* Avatar do Artista */}
          <div 
            style={{ 
              width: '180px', 
              height: '180px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <User size={64} color="rgba(255,255,255,0.2)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '56px', fontWeight: '900', margin: 0, letterSpacing: '-0.04em' }}>
  {decodedName}
</h1>
<VerifiedBadge />
            </div>

            {/* Estatísticas */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Disc size={16} color="#9ca3af" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>{artistAlbums.length} Lançamentos</span>
              </div>
              
              {artistAlbums.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Star size={16} color="#facc15" fill="#facc15" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>Média {averageRating}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

        {/* === DISCOGRAFIA === */}
        <section>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>Discografia</h2>
          
          {artistAlbums.length > 0 ? (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '24px' 
              }}
            >
              {artistAlbums.map(album => (
                <div 
                  key={album.id} 
                  onClick={() => navigate(`/album/${album.id}`)}
                  style={{ cursor: 'pointer' }}
                >

                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              Nenhum álbum encontrado para este artista no banco de dados.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="36" 
      height="36" 
      style={{ marginTop: '8px', flexShrink: 0 }}
    >
      <path 
        fill="#1d9bf0" 
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.867 3.447.014.21.025.418.025.63 0 2.21 1.71 4 3.918 4 .47 0 .92-.086 1.336-.25.52 1.333 1.818 2.25 3.337 2.25s2.816-.917 3.337-2.25c.416.164.866.25 1.336.25 2.21 0 3.918-1.79 3.918-4 0-.212-.01-.42-.025-.63A4.05 4.05 0 0 0 22.5 12.5z" 
      />
      <path 
        fill="white" 
        d="M10.25 15.5l-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5z" 
      />
    </svg>
  );
}