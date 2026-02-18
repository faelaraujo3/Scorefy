import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Heart, Plus, Star, StarHalf, MessageCircle, MoreHorizontal, X, Send } from 'lucide-react';

export default function Album() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- ESTADOS ---
    const [album, setAlbum] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [artistPhoto, setArtistPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    // Estados para Postar Review (Modal)
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReviewRating, setNewReviewRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0); 
    const [newReviewText, setNewReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Estados para Responder Review
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    // Usuário
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = savedUser ? savedUser.id_user : 1;
    const currentUserName = savedUser ? (savedUser.username || savedUser.nome) : "Visitante";

    // --- BUSCA DE DADOS ---
    const fetchAlbumData = () => {
        fetch(`http://localhost:5000/api/albuns/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) return;

                const alb = data.album;
                // Garante que temos um nome de artista
                const artistName = alb.nome_artista || alb.artist || "Desconhecido";

                setAlbum({
                    ...alb,
                    artist: artistName,
                    rating: data.nota_media || 0
                });
                
                setReviews(data.reviews || []);

                // Busca foto do artista usando o nome encontrado
                fetch(`http://localhost:5000/api/busca?q=${encodeURIComponent(artistName)}`)
                    .then(r => r.json())
                    .then(searchData => {
                        const found = searchData.artistas.find(a => a.name.toLowerCase() === artistName.toLowerCase());
                        if (found && found.image_url) {
                            setArtistPhoto(found.image_url);
                        }
                    })
                    .catch(e => console.log("Erro foto artista:", e));

                setLoading(false);
            })
            .catch(err => {
                console.error("Erro de conexão:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAlbumData();
    }, [id]);

    // --- LÓGICA DAS ESTRELAS INTERATIVAS ---
    const handleMouseMoveStar = (e, index) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - left) / width;
        const value = percent <= 0.5 ? index - 0.5 : index;
        setHoverRating(value);
    };

    // --- AÇÕES ---
    const handlePostReview = () => {
        if (newReviewRating === 0) return alert("Por favor, dê uma nota.");
        
        setSubmitting(true);
        fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_user: currentUserId,
                id_album: id,
                nota: newReviewRating,
                texto: newReviewText
            })
        })
        .then(res => res.json())
        .then(() => {
            setSubmitting(false);
            setShowReviewModal(false);
            setNewReviewText("");
            setNewReviewRating(0);
            fetchAlbumData(); 
        })
        .catch(() => setSubmitting(false));
    };

    const handleLikeReview = (reviewId) => {
        fetch(`http://localhost:5000/api/reviews/${reviewId}/curtir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: currentUserId, username: currentUserName })
        }).then(() => fetchAlbumData());
    };

    const handlePostReply = (reviewId) => {
        if (!replyText.trim()) return;
        fetch(`http://localhost:5000/api/reviews/${reviewId}/responder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: currentUserId, username: currentUserName, texto: replyText })
        }).then(() => {
            setReplyText("");
            setReplyingTo(null);
            fetchAlbumData();
        });
    };

    // Renderiza estrelas estáticas (exibição)
    const renderStars = (val, size = 16) => {
        const stars = [];
        const fullStars = Math.floor(val);
        const hasHalf = val % 1 >= 0.4; 
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) stars.push(<Star key={i} size={size} fill="#facc15" color="#facc15" />);
            else if (i === fullStars + 1 && hasHalf) stars.push(<StarHalf key={i} size={size} fill="#facc15" color="#facc15" />);
            else stars.push(<Star key={i} size={size} color="#2a2a2cff" fill="rgba(52, 53, 54, 0.3)" />);
        }
        return stars;
    };

    if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
    if (!album) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
            <Header hideNav={true} hideSearch={true} />

            {/* Fundo Glass */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80vh', backgroundImage: `url(${album.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(80px) brightness(0.4) saturate(1.5)', zIndex: 0, pointerEvents: 'none', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)' }} />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', position: 'relative', zIndex: 10 }}>
                
                {/* === HEADER DO ÁLBUM === */}
                <section style={{ display: 'flex', gap: '60px', alignItems: 'flex-end', marginBottom: '80px', flexWrap: 'wrap' }}>
                    <div style={{ width: '340px', height: '340px', flexShrink: 0, borderRadius: '24px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#1f1f22' }}>
                        <img src={album.image} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.display = 'flex'; e.target.parentNode.style.alignItems = 'center'; e.target.parentNode.style.justifyContent = 'center'; e.target.parentNode.innerText = 'Sem Capa'; }} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: '14px', textTransform: 'uppercase' }}>{album.genre}</span>
                        <h1 style={{ fontSize: '72px', fontWeight: '900', margin: '8px 0', lineHeight: '1' }}>{album.title}</h1>
                        
                        {/* Artista */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                            <div 
                                onClick={() => navigate(`/artist/${encodeURIComponent(album.artist)}`)}
                                style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: artistPhoto ? 'transparent' : 'linear-gradient(135deg, #3be7e7ff, #e770ffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#121215', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)' }}
                            >
                                {artistPhoto ? 
                                    <img src={artistPhoto} alt={album.artist} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
                                    : album.artist.charAt(0)
                                }
                            </div>
                            
                            <span onClick={() => navigate(`/artist/${encodeURIComponent(album.artist)}`)} style={{ fontSize: '24px', fontWeight: '600', color: 'rgba(255,255,255,0.95)', cursor: 'pointer', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {album.artist}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px' }}>•</span>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', fontWeight: '500' }}>{album.year}</span>
                        </div>

                        <p style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '600px', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{album.description}</p>

                        {/* Nota e Botões */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>{renderStars(album.rating, 22)}</div>
                                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                <span style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{album.rating}</span>
                            </div>

                            <button onClick={() => setIsFavorite(!isFavorite)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', borderRadius: '24px', backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.1)', border: isFavorite ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', color: isFavorite ? '#ef4444' : 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(20px)' }}>
                                <Heart size={22} fill={isFavorite ? "#ef4444" : "none"} /> {isFavorite ? 'Salvo' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </section>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

                {/* === REVIEWS === */}
                <section style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Reviews da Comunidade ({reviews.length})</h2>
                        <button onClick={() => setShowReviewModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '99px', backgroundColor: 'white', border: 'none', color: '#121215', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <Plus size={18} /> Avaliar Álbum
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {reviews.length === 0 && <p style={{ color: '#6b7280', fontSize: '18px' }}>Seja o primeiro a avaliar este álbum!</p>}

                        {reviews.map((review, index) => (
                            <div key={review._id}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0, color: '#a1a1aa' }}>
                                        {review.username ? review.username.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{review.username}</div>
                                                <div style={{ color: '#71717a', fontSize: '13px' }}>{review.data_postagem}</div>
                                            </div>
                                            <MoreHorizontal size={20} color="#52525b" style={{ cursor: 'pointer' }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>{renderStars(review.nota, 14)}</div>
                                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: '#e4e4e7' }}>{review.texto}</p>
                                        
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                            <ActionButton 
                                                icon={<Heart size={16} fill={review.curtidas?.includes(currentUserId) ? "#ef4444" : "none"} color={review.curtidas?.includes(currentUserId) ? "#ef4444" : "#9ca3af"} />} 
                                                label={review.curtidas?.length || 0} 
                                                onClick={() => handleLikeReview(review._id)}
                                            />
                                            <ActionButton 
                                                icon={<MessageCircle size={16} />} 
                                                label={review.respostas?.length > 0 ? review.respostas.length : 'Responder'} 
                                                onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                                            />
                                        </div>

                                        {replyingTo === review._id && (
                                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', animation: 'fadeIn 0.3s ease' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Escreva sua resposta..." 
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', outline: 'none' }}
                                                />
                                                <button onClick={() => handlePostReply(review._id)} style={{ background: '#3b82f6', border: 'none', borderRadius: '12px', padding: '0 16px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                                    Enviar
                                                </button>
                                            </div>
                                        )}

                                        {review.respostas?.length > 0 && (
                                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                                                {review.respostas.map((resp, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: '#d4d4d8' }}>
                                                            {resp.username ? resp.username.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{resp.username}</span>
                                                                <span style={{ color: '#71717a', fontSize: '12px' }}>{resp.data}</span>
                                                            </div>
                                                            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#d4d4d8' }}>{resp.texto}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < reviews.length - 1 && <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', marginTop: '32px' }} />}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* === NOVO MODAL MODERNO === */}
            {showReviewModal && (
                <div style={{ 
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ 
                        background: '#18181b', padding: '40px', borderRadius: '32px', width: '500px', 
                        border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
                        display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative'
                    }}>
                        <button onClick={() => setShowReviewModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18}/></button>
                        
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>Avaliar Álbum</h2>
                            <p style={{ margin: 0, color: '#a1a1aa', fontSize: '14px' }}>O que você achou de <span style={{color: 'white'}}>{album.title}</span>?</p>
                        </div>

                        {/* Estrelas Interativas Modernas */}
                        <div 
                            style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '16px 0' }}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div 
                                    key={star} 
                                    onMouseMove={(e) => handleMouseMoveStar(e, star)}
                                    onClick={() => setNewReviewRating(hoverRating || star)}
                                    style={{ cursor: 'pointer', position: 'relative', width: '40px', height: '40px' }}
                                >
                                    {/* Estrela Vazia (Fundo) */}
                                    <Star size={40} color="#3f3f46" strokeWidth={1.5} style={{ position: 'absolute', top: 0, left: 0 }} />
                                    
                                    {/* Estrela Cheia (Overlay baseada no hover/select) */}
                                    <div style={{ 
                                        position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none',
                                        width: (hoverRating || newReviewRating) >= star ? '100%' : 
                                               (hoverRating || newReviewRating) >= star - 0.5 ? '50%' : '0%' 
                                    }}>
                                        <Star size={40} fill="#fbbf24" color="#fbbf24" strokeWidth={0} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 'bold', fontSize: '18px', height: '20px' }}>
                            {(hoverRating || newReviewRating) > 0 ? (hoverRating || newReviewRating) : ''}
                        </div>

                        <textarea 
                            placeholder="Escreva sua opinião..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            style={{ 
                                width: '100%', height: '140px', background: '#27272a', border: '1px solid transparent', 
                                borderRadius: '16px', padding: '20px', color: 'white', fontSize: '15px', resize: 'none', 
                                outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />

                        <button 
                            onClick={handlePostReview} 
                            disabled={submitting}
                            style={{ 
                                width: '100%', padding: '16px', borderRadius: '99px', 
                                background: 'white', color: 'black', border: 'none', 
                                fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', 
                                opacity: submitting ? 0.7 : 1, transition: 'transform 0.1s'
                            }}
                            onMouseDown={e => !submitting && (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={e => !submitting && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {submitting ? 'Publicando...' : 'Publicar Avaliação'}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Estilo para animação simples */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}

function ActionButton({ icon, label, small = false, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none',
                color: hover ? 'white' : '#9ca3af', fontSize: small ? '12px' : '14px', fontWeight: '600',
                cursor: 'pointer', padding: 0, transition: 'color 0.2s'
            }}
        >
            {icon}<span>{label}</span>
        </button>
    );
}