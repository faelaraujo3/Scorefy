import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { mockAlbums } from '../lib/mockAlbums';
import { User, Pencil, MapPin, Search, X, Plus, Star, StarHalf, Check, Disc, Heart } from 'lucide-react';

// Mocks de reviews do usuário para visualização
const MOCK_REVIEWS = [
  { id: 101, albumId: 1, rating: 5, date: '15 Fev 2026', text: 'Perfeito.' },
  { id: 102, albumId: 7, rating: 4.5, date: '10 Fev 2026', text: 'Um dos melhores álbuns pop recentes. Quase perfeito.' },
  { id: 103, albumId: 2, rating: 4, date: '28 Jan 2026', text: 'Muito bom, mas achei algumas faixas repetitivas pro meio do disco.' },
  { id: 104, albumId: 5, rating: 5, date: '12 Jan 2026', text: 'Energia pura do começo ao fim!' },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados salvos do usuário
  const [profileData, setProfileData] = useState({
    name: 'fael',
    bio: 'Ouvindo de tudo um pouco.',
    location: 'João Monlevade, MG',
    favoriteAlbumId: 1
  });

  // Estado temporário para o formulário de edição
  const [tempData, setTempData] = useState({ ...profileData });
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [showAlbumDropdown, setShowAlbumDropdown] = useState(false);

  // Top 5 Álbuns Favoritos (Slots)
  const [topAlbums, setTopAlbums] = useState([null, null, null, null, null]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  // Paginação de Reviews
  const [visibleReviews, setVisibleReviews] = useState(2);

  const handleSaveProfile = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const openSlotModal = (index) => {
    setActiveSlot(index);
    setModalSearch('');
    setModalOpen(true);
  };

  const selectTopAlbum = (album) => {
    const newTop = [...topAlbums];
    newTop[activeSlot] = album;
    setTopAlbums(newTop);
    setModalOpen(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.4;
    for (let i = 0; i < fullStars; i++) stars.push(<Star key={`f-${i}`} size={16} fill="#facc15" color="#facc15" />);
    if (hasHalfStar) stars.push(<StarHalf key="h" size={16} fill="#facc15" color="#facc15" />);
    const currentCount = stars.length;
    for (let i = 0; i < (5 - currentCount); i++) stars.push(<Star key={`e-${i}`} size={16} color="#1f2937" fill="rgba(31, 41, 55, 0.5)" />);
    return stars;
  };

  const currentFavoriteAlbum = mockAlbums.find(a => a.id === (isEditing ? tempData.favoriteAlbumId : profileData.favoriteAlbumId));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
      <Header hideSearch={true} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* === SEÇÃO DO PERFIL (HEADER) === */}
        <section style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
            {/* Avatar Grande */}
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(to top right, #3be7e7ff, #e770ffff)', padding: '4px', flexShrink: 0 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#121215', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={64} color="white" />
              </div>
            </div>

            {/* Informações */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxWidth: '500px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>{profileData.name}</h1>
              
              {!isEditing ? (
                <>
                  {profileData.bio && <p style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>{profileData.bio}</p>}
                  {profileData.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '14px' }}>
                      <MapPin size={16} /> {profileData.location}
                    </div>
                  )}
                  {currentFavoriteAlbum && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
                      <Heart size={16} color="#ef4444" fill="#ef4444" />
                      <span style={{ fontSize: '13px', color: '#9ca3af' }}>Álbum Favorito:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={currentFavoriteAlbum.image} alt={currentFavoriteAlbum.title} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{currentFavoriteAlbum.title}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <textarea
                    value={tempData.bio}
                    onChange={e => setTempData({...tempData, bio: e.target.value})}
                    placeholder="Adicione uma biografia..."
                    rows={3}
                    style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}>
                    <MapPin size={18} color="#9ca3af" />
                    <input
                      value={tempData.location}
                      onChange={e => setTempData({...tempData, location: e.target.value})}
                      placeholder="Sua localização"
                      style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                  
                  {/* Dropdown de Álbum Favorito */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}>
                      <Disc size={18} color="#9ca3af" />
                      <input
                        placeholder="Buscar álbum favorito..."
                        value={albumSearchQuery}
                        onChange={(e) => {
                          setAlbumSearchQuery(e.target.value);
                          setShowAlbumDropdown(true);
                        }}
                        onFocus={() => setShowAlbumDropdown(true)}
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    {showAlbumDropdown && albumSearchQuery && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', backgroundColor: '#1a1a20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto', zIndex: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        {mockAlbums.filter(a => a.title.toLowerCase().includes(albumSearchQuery.toLowerCase())).map(album => (
                          <div
                            key={album.id}
                            onClick={() => {
                              setTempData({...tempData, favoriteAlbumId: album.id});
                              setAlbumSearchQuery(album.title);
                              setShowAlbumDropdown(false);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <img src={album.image} alt={album.title} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{album.title}</div>
                              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{album.artist}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '12px 24px', 
    borderRadius: '9999px', 
    backgroundColor: isEditing ? '#10b981' : 'white', 
    border: 'none', 
    color: isEditing ? 'white' : 'black', 
    fontWeight: 'bold', 
    fontSize: '14px',
    cursor: 'pointer', 
    transition: 'transform 0.2s, background-color 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}
>
  {isEditing ? <><Check size={18} /> Salvar</> : <><Pencil size={18} /> Editar Perfil</>}
</button>
        </section>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

        {/* === SEÇÃO TOP 5 ÁLBUNS === */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Álbuns Favoritos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {topAlbums.map((album, index) => (
              <div
                key={index}
                onClick={() => openSlotModal(index)}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '16px',
                  backgroundColor: album ? 'transparent' : 'rgba(255,255,255,0.02)',
                  border: album ? 'none' : '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = album ? 'transparent' : 'rgba(255,255,255,0.1)';
                }}
              >
                {album ? (
                  <>
                    <img src={album.image} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                      <Edit3 size={24} color="white" />
                    </div>
                  </>
                ) : (
                  <Plus size={32} color="rgba(255,255,255,0.2)" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* === SEÇÃO MINHAS REVIEWS === */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Minhas Reviews Recentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_REVIEWS.slice(0, visibleReviews).map(review => {
              const album = mockAlbums.find(a => a.id === review.albumId);
              if (!album) return null;
              return (
                <div key={review.id} style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
                  <img src={album.image} alt={album.title} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{album.title}</h3>
                        <p style={{ margin: '4px 0 12px 0', fontSize: '14px', color: '#9ca3af' }}>{album.artist}</p>
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{review.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.rating)}</div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(126, 194, 211, 0.2)', padding: '2px 8px', borderRadius: '6px', color: '#a5f3fc' }}>{review.rating}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', color: '#e5e7eb', lineHeight: '1.5' }}>"{review.text}"</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {visibleReviews < MOCK_REVIEWS.length && (
            <button onClick={() => setVisibleReviews(prev => prev + 2)} style={{ marginTop: '24px', width: '100%', padding: '14px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              Ver Mais Reviews
            </button>
          )}
        </section>
      </main>

      {/* === MODAL DE BUSCA DE ÁLBUM === */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: '#18181c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Escolha um Álbum</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input autoFocus value={modalSearch} onChange={e => setModalSearch(e.target.value)} placeholder="Pesquisar em álbuns..." style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 44px', color: 'white', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }} className="no-scrollbar">
              {mockAlbums.filter(a => a.title.toLowerCase().includes(modalSearch.toLowerCase()) || a.artist.toLowerCase().includes(modalSearch.toLowerCase())).map(album => (
                <div key={album.id} onClick={() => selectTopAlbum(album)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <img src={album.image} alt={album.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{album.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{album.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}