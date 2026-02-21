import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, Pencil, MapPin, Search, X, Plus, Star, StarHalf, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 
import { useParams } from 'react-router-dom';

export default function Profile() {
  const { id } = useParams(); 
  const { user } = useAuth();

  // Decide qual perfil carregar: o do ID da URL ou o do usuário logado
  const profileIdToFetch = id || user?.id_user;

  // Verifica se o perfil sendo visualizado é o do usuário logado
  const isMyProfile = user && user.id_user === Number(profileIdToFetch);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dados do Perfil (Agora inclui a imagem)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    imagem_url: 'default_avatar.png',
    reviews: []
  });

  const [topAlbumsSlots, setTopAlbumsSlots] = useState([null, null, null, null, null]);
  const [tempData, setTempData] = useState({});
  
  // Estados do Modal de Álbuns
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Estados do Modal de Foto de Perfil
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  useEffect(() => {
    if (profileIdToFetch) {
      fetchProfile();
    }
  }, [profileIdToFetch]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${profileIdToFetch}`);
      const data = await res.json();    

      if (data.user) {
        setProfileData({
          name: data.user.nome || data.user.username,
          bio: data.user.bio || '',
          location: data.user.localizacao || '',
          imagem_url: data.user.imagem_url || 'default_avatar.png',
          reviews: data.reviews || []
        });
        
        // Inicializa dados temporários
        setTempData({
            name: data.user.nome || data.user.username,
            bio: data.user.bio || '',
            location: data.user.localizacao || '',
            imagem_url: data.user.imagem_url || 'default_avatar.png'
        });

        const slots = [null, null, null, null, null];
        if (data.favorites) {
          data.favorites.forEach((fav, index) => {
            if (index < 5) slots[index] = fav;
          });
        }
        setTopAlbumsSlots(slots);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      setLoading(false);
    }
  };

  // --- SALVAR ---
  const handleSaveProfile = async () => {
    const favoriteIds = topAlbumsSlots
      .filter(album => album !== null)
      .map(album => album.id_album);

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id_user}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: tempData.name,
          bio: tempData.bio,
          localizacao: tempData.location,
          imagem_url: tempData.imagem_url, // Enviando a nova foto pro banco
          albuns_favoritos: favoriteIds
        })
      });

      if (res.ok) {
        setProfileData(prev => ({
          ...prev,
          name: tempData.name,
          bio: tempData.bio,
          location: tempData.location,
          imagem_url: tempData.imagem_url
        }));
        setIsEditing(false);
      } else {
        alert("Erro ao salvar perfil");
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };

  const handleStartEditing = () => {
    setTempData({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        imagem_url: profileData.imagem_url
    });
    setIsEditing(true);
  };

  // --- FAVORITOS ---
  const openSlotModal = (index) => {
    setActiveSlot(index);
    setModalSearch('');
    setSearchResults([]);
    setModalOpen(true);
  };

  const selectTopAlbum = (album) => {
    const newSlots = [...topAlbumsSlots];
    newSlots[activeSlot] = album;
    setTopAlbumsSlots(newSlots);
    setModalOpen(false);
    if (!isEditing) handleStartEditing();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (modalSearch.length > 2) {
        fetch(`http://localhost:5000/api/busca?q=${encodeURIComponent(modalSearch)}`)
          .then(res => res.json())
          .then(data => setSearchResults(data.albuns || []));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [modalSearch]);

  const removeTopAlbum = (e, index) => {
    e.stopPropagation();
    const newSlots = [...topAlbumsSlots];
    newSlots[index] = null;
    setTopAlbumsSlots(newSlots);
    if (!isEditing) handleStartEditing();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    for (let i = 0; i < fullStars; i++) stars.push(<Star key={i} size={14} fill="#facc15" color="#facc15" />);
    if (hasHalf) stars.push(<StarHalf key="h" size={14} fill="#facc15" color="#facc15" />);
    return stars;
  };

  if (!user && isMyProfile) return <div style={{ color: 'white', padding: 40 }}>Faça login para ver seu perfil.</div>;
  if (loading) return <div style={{ color: 'white', padding: 40 }}>Carregando...</div>;

  // Decide qual imagem mostrar no preview (A do banco ou a que está sendo editada)
  const currentAvatar = isEditing ? tempData.imagem_url : profileData.imagem_url;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
      <Header hideSearch={true} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* HEADER PERFIL */}
        <section style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
            
            {/* AVATAR MODERNIZADO */}
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#222', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                border: '4px solid #18181b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                {currentAvatar && currentAvatar !== 'default_avatar.png' ? (
                   <img src={currentAvatar} style={{ width:'100%', height:'100%', objectFit:'cover'}} alt="Avatar" />
                ) : (
                   <User size={64} color="#666" />
                )}
              </div>

              {/* Botão de Lápis sobreposto (Aparece no modo Edição) */}
              {isEditing && (
                <div 
                  onClick={() => { setTempPhotoUrl(tempData.imagem_url === 'default_avatar.png' ? '' : tempData.imagem_url); setPhotoModalOpen(true); }}
                  style={{
                    position: 'absolute', 
                    bottom: '4px', 
                    right: '4px', 
                    width: '44px', 
                    height: '44px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(12px)', 
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer', 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    transition: 'all 0.2s ease', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                  title="Alterar Foto"
                >
                  <Pencil size={20} color="white" style={{ dropShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxWidth: '500px', paddingTop: '8px' }}>
              {!isEditing ? (
                <>
                  <h1 style={{ fontSize: '38px', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{profileData.name}</h1>
                  {profileData.bio ? (
                    <p style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>{profileData.bio}</p>
                  ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic', margin: 0 }}>Sem biografia.</p>
                  )}
                  {profileData.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                      <MapPin size={16} /> {profileData.location}
                    </div>
                  )}
                </>
              ) : (
                /* MODO EDIÇÃO MODERNIZADO */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  <input
                    value={tempData.name}
                    onChange={e => setTempData({...tempData, name: e.target.value})}
                    placeholder="Seu nome"
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '20px', 
                      fontWeight:'bold', outline: 'none', transition: 'border 0.2s' 
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <textarea
                    value={tempData.bio}
                    onChange={e => setTempData({...tempData, bio: e.target.value})}
                    placeholder="Escreva algo sobre você..."
                    rows={3}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '15px', 
                      resize: 'none', outline: 'none', fontFamily: 'inherit', transition: 'border 0.2s' 
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 16px',
                    transition: 'border 0.2s'
                  }}
                  >
                    <MapPin size={18} color="#9ca3af" />
                    <input
                      value={tempData.location}
                      onChange={e => setTempData({...tempData, location: e.target.value})}
                      placeholder="Sua localização"
                      style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '15px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {isMyProfile && (
            <button
              onClick={() => isEditing ? handleSaveProfile() : handleStartEditing()}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                borderRadius: '9999px', backgroundColor: isEditing ? '#10b981' : 'white', 
                border: 'none', color: isEditing ? 'white' : 'black', fontWeight: 'bold', 
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isEditing ? <><Check size={18} /> Salvar Alterações</> : <><Pencil size={18} /> Editar Perfil</>}
            </button>
          )}
        </section>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

        {/* TOP 5 FAVORITOS */}
        <section>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '24px'}}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin:0 }}>Álbuns Favoritos</h2>
            <span style={{fontSize:'13px', color: isEditing ? '#10b981' : '#666'}}>
                {isEditing ? "Modo edição ativo" : "Clique nos quadrados para editar"}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {topAlbumsSlots.map((album, index) => (
              <div
                key={index}
                onClick={() => openSlotModal(index)}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '16px',
                  backgroundColor: album ? 'transparent' : 'rgba(255,255,255,0.02)',
                  border: album ? 'none' : '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', 
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => !album && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                onMouseLeave={e => !album && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                {album ? (
                  <>
                    <img src={album.image} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div 
                        onClick={(e) => removeTopAlbum(e, index)}
                        className="remove-btn"
                        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', padding: 6, borderRadius: '50%', cursor:'pointer', display: isEditing ? 'block' : 'none' }}
                    >
                        <Trash2 size={16} color="#ef4444" />
                    </div>
                  </>
                ) : (
                  <Plus size={32} color="rgba(255,255,255,0.2)" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Reviews</h2>
            <span style={{ backgroundColor: 'rgba(101, 133, 185, 0.19)', color: '#ffffffff', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
              {profileData.reviews.length}
            </span>
          </div>
          
          {profileData.reviews.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>Nenhuma review publicada ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {profileData.reviews.map(review => (
                <div 
                  key={review._id} 
                  style={{ 
                    display: 'flex', gap: '24px', padding: '24px', 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Capa */}
                  {review.album_info && (
                    <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}>
                      <img src={review.album_info.image} alt="Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  
                  {/* Conteúdo da Review */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.01em', color: 'white' }}>
                          {review.album_info?.title || "Álbum"}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                            {renderStars(review.nota)}
                          </div>
                          {/* Badge de Nota */}
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffffff', backgroundColor: 'rgba(49, 171, 192, 0.18)', padding: '2px 8px', borderRadius: '8px' }}>
                            {review.nota}
                          </span>
                        </div>
                      </div>
                      {/* Badge de Data */}
                      <span style={{ fontSize: '12px', color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
                        {review.data_postagem}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '8px' }}>
                      <p style={{ margin: 0, fontSize: '15px', color: '#e5e7eb', lineHeight: '1.6' }}>
                        {review.texto}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL DE BUSCAR ÁLBUM */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#18181c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Selecionar Álbum</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input autoFocus value={modalSearch} onChange={e => setModalSearch(e.target.value)} placeholder="Digite para buscar..." style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 44px', color: 'white', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {searchResults.map(album => (
                <div key={album.id_album} onClick={() => selectTopAlbum(album)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <img src={album.image} alt={album.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{album.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>{album.artist || album.nome_artista}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDITAR FOTO DE PERFIL */}
      {photoModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ backgroundColor: '#18181c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Alterar Foto</h3>
              <button onClick={() => setPhotoModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* PREVIEW DA FOTO */}
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#222', margin: '0 auto', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tempPhotoUrl ? (
                <img src={tempPhotoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; }} />
              ) : (
                <ImageIcon size={40} color="#666" />
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 'bold' }}>URL da Imagem</label>
              <input 
                autoFocus 
                value={tempPhotoUrl} 
                onChange={e => setTempPhotoUrl(e.target.value)} 
                placeholder="https://exemplo.com/minhafoto.jpg" 
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} 
              />
            </div>

            <button 
              onClick={() => {
                setTempData({ ...tempData, imagem_url: tempPhotoUrl || 'default_avatar.png' });
                setPhotoModalOpen(false);
              }}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .remove-btn { display: ${isEditing ? 'block' : 'none'}; }
        div:hover > .remove-btn { display: block; }
      `}</style>
    </div>
  );
}