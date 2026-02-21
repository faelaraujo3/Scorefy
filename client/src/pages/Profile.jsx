import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, Pencil, MapPin, Search, X, Plus, Star, StarHalf, Check, Trash2 } from 'lucide-react';
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

  // Dados do Perfil
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    reviews: []
  });

  const [topAlbumsSlots, setTopAlbumsSlots] = useState([null, null, null, null, null]);
  const [tempData, setTempData] = useState({});
  
  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
          reviews: data.reviews || []
        });
        
        // Inicializa dados temporários também
        setTempData({
            name: data.user.nome || data.user.username,
            bio: data.user.bio || '',
            location: data.user.localizacao || ''
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
          albuns_favoritos: favoriteIds
        })
      });

      if (res.ok) {
        setProfileData(prev => ({
          ...prev,
          name: tempData.name,
          bio: tempData.bio,
          location: tempData.location
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
        location: profileData.location
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
    
    if (!isEditing) {
        handleStartEditing();
    }
  };

  // Busca na API
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

  if (!user) return <div style={{ color: 'white', padding: 40 }}>Faça login para ver seu perfil.</div>;
  if (loading) return <div style={{ color: 'white', padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
      <Header hideSearch={true} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* HEADER PERFIL */}
        <section style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(to top right, #3be7e7ff, #e770ffff)', padding: '4px', flexShrink: 0 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#121215', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {user.imagem_url && user.imagem_url !== 'default_avatar.png' ? (
                   <img src={user.imagem_url} style={{ width:'100%', height:'100%', objectFit:'cover'}} alt="" />
                ) : (
                   <User size={64} color="white" />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxWidth: '500px' }}>
              {!isEditing ? (
                <>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>{profileData.name}</h1>
                  {profileData.bio ? (
                    <p style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>{profileData.bio}</p>
                  ) : (
                    <p style={{ color: '#555', fontStyle: 'italic' }}>Sem biografia.</p>
                  )}
                  {profileData.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '14px' }}>
                      <MapPin size={16} /> {profileData.location}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <input
                    value={tempData.name}
                    onChange={e => setTempData({...tempData, name: e.target.value})}
                    placeholder="Seu nome"
                    style={{ background: 'transparent', borderBottom: '1px solid #333', color: 'white', fontSize: '24px', fontWeight:'bold', outline: 'none' }}
                  />
                  <textarea
                    value={tempData.bio}
                    onChange={e => setTempData({...tempData, bio: e.target.value})}
                    placeholder="Sua bio..."
                    rows={3}
                    style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}>
                    <MapPin size={18} color="#9ca3af" />
                    <input
                      value={tempData.location}
                      onChange={e => setTempData({...tempData, location: e.target.value})}
                      placeholder="Localização"
                      style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
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
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
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
                        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', padding: 4, borderRadius: '50%', cursor:'pointer', display: isEditing ? 'block' : 'none' }}
                    >
                        <Trash2 size={14} color="#ef4444" />
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
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Minhas Reviews ({profileData.reviews.length})</h2>
          {profileData.reviews.length === 0 ? (
            <p style={{color: '#666'}}>Nenhuma review feita ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profileData.reviews.map(review => (
                <div key={review._id} style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {review.album_info && (
                    <img src={review.album_info.image} alt="Capa" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{review.album_info?.title || "Álbum"}</h3>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{review.data_postagem}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.nota)}</div>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24' }}>{review.nota}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#e5e7eb' }}>"{review.texto}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
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
      
      <style>{`
        .remove-btn { display: ${isEditing ? 'block' : 'none'}; }
        div:hover > .remove-btn { display: block; }
      `}</style>
    </div>
  );
}