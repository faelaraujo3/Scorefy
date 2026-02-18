import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Heart, Plus, Star, StarHalf, MessageCircle, MoreHorizontal, CornerDownRight } from 'lucide-react';

const MOCK_REVIEWS = [
    {
        id: 1,
        userName: 'Ana Costa',
        userInitials: 'AC',
        time: 'Há 2 dias',
        rating: 5,
        text: 'Uma obra-prima absoluta! A transição entre as faixas é perfeita e a produção está em outro nível. Não consigo parar de ouvir.',
        likes: 34,
        comments: [
            { id: 101, userName: 'Lucas Mendes', userInitials: 'LM', time: 'Há 1 dia', text: 'Concordo! A faixa 3 é surreal de boa.', likes: 5 },
            { id: 102, userName: 'Sofia', userInitials: 'S', time: 'Há 5 horas', text: 'Eu achei a segunda metade do disco meio arrastada, mas no geral é bom.', likes: 1 }
        ]
    },
    {
        id: 2,
        userName: 'Marcos Vinícius',
        userInitials: 'MV',
        time: 'Há 5 dias',
        rating: 4,
        text: 'Muito sólido. O artista tentou coisas novas e a maioria funcionou. Algumas letras parecem um pouco apressadas, mas o instrumental compensa.',
        likes: 12,
        comments: []
    },
    {
        id: 3,
        userName: 'Julia Ferreira',
        userInitials: 'JF',
        time: 'Há 1 semana',
        rating: 4.5,
        text: 'Cresceu muito em mim. Na primeira audição não gostei tanto, mas agora não tiro do repeat!',
        likes: 89,
        comments: [
            { id: 103, userName: 'Pedro H.', userInitials: 'PH', time: 'Há 2 dias', text: 'Aconteceu exatamente o mesmo comigo haha', likes: 12 }
        ]
    }
];

export default function Album() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [album, setAlbum] = useState(null);
    const [artistPhoto, setArtistPhoto] = useState(null); // Estado para a foto do artista
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // 1. Busca os álbuns
        fetch('http://localhost:5000/api/albuns')
            .then(res => res.json())
            .then(data => {
                const found = data.find(a => a.id_album === parseInt(id));
                
                if (found) {
                    // Normaliza os dados do álbum
                    const artistName = found.nome_artista || found.artist || "Artista Desconhecido";
                    
                    setAlbum({
                        id: found.id_album,
                        title: found.title,
                        artist: artistName,
                        image: found.image,
                        year: found.year,
                        genre: found.genre,
                        description: found.description || "Sem descrição disponível para este álbum.",
                        rating: 4.5
                    });

                    // 2. Busca a foto do artista (endpoint de busca)
                    fetch(`http://localhost:5000/api/busca?q=${encodeURIComponent(artistName)}`)
                        .then(res => res.json())
                        .then(searchData => {
                            // Encontra o artista exato na lista de resultados
                            const foundArtist = searchData.artistas.find(
                                a => a.name.toLowerCase() === artistName.toLowerCase()
                            );
                            if (foundArtist && foundArtist.image_url) {
                                setArtistPhoto(foundArtist.image_url);
                            }
                        })
                        .catch(err => console.error("Erro ao buscar foto do artista:", err));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar álbum:", err);
                setLoading(false);
            });
    }, [id]);

    const renderStars = (rating, size = 16) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.4;

        for (let i = 0; i < fullStars; i++) stars.push(<Star key={`f-${i}`} size={size} fill="#facc15" color="#facc15" />);
        if (hasHalfStar) stars.push(<StarHalf key="h" size={size} fill="#facc15" color="#facc15" />);

        const currentCount = stars.length;
        for (let i = 0; i < (5 - currentCount); i++) stars.push(<Star key={`e-${i}`} size={size} color="#1f2937" fill="rgba(31, 41, 55, 0.5)" />);

        return stars;
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <Header hideNav={true} hideSearch={true} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: '#9ca3af' }}>Carregando dados do álbum...</h2>
                </div>
            </div>
        );
    }

    if (!album) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <Header hideNav={true} hideSearch={true} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <h2 style={{ fontSize: '24px' }}>Álbum não encontrado</h2>
                    <button onClick={() => navigate('/')} style={{ padding: '10px 20px', borderRadius: '99px', border: '1px solid white', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#121215', color: 'white', paddingBottom: '80px' }}>
            <Header hideNav={true} hideSearch={true} />

            {/* FUNDO GLASSMORPHISM */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80vh', 
                    backgroundImage: `url(${album.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    // Filtros para o efeito de vidro fosco escuro
                    filter: 'blur(80px) brightness(0.4) saturate(1.5)', 
                    zIndex: 0,
                    pointerEvents: 'none',
                    // Máscara para suavizar a transição para o preto
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)'
                }}
            />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '80px' }}>

                {/* === HEADER DO ÁLBUM === */}
                <section style={{ display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Capa */}
                    <div
                        style={{
                            width: '340px',
                            height: '340px',
                            flexShrink: 0,
                            borderRadius: '24px',
                            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9)',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backgroundColor: '#1f1f22'
                        }}
                    >
                        <img 
                            src={album.image} 
                            alt={album.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.style.display = 'flex';
                                e.target.parentNode.style.alignItems = 'center';
                                e.target.parentNode.style.justifyContent = 'center';
                                e.target.parentNode.innerText = 'Sem Capa';
                                e.target.parentNode.style.color = '#555';
                            }}
                        />
                    </div>

                    {/* Informações */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>

                        <div>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff27bff', marginBottom: '8px', display: 'block' }}>
                                {album.genre}
                            </span>
                            <h1 style={{ fontSize: '72px', fontWeight: '900', margin: 0, lineHeight: '1.05', letterSpacing: '-0.04em', textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                                {album.title}
                            </h1>
                        </div>

                        {/* Ícone do Artista*/}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div 
                                onClick={() => navigate(`/artist/${encodeURIComponent(album.artist)}`)}
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    overflow: 'hidden',
                                    background: artistPhoto ? 'transparent' : 'linear-gradient(135deg, #3be7e7ff, #e770ffff)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 'bold', 
                                    fontSize: '18px', 
                                    color: '#121215',
                                    cursor: 'pointer',
                                }}
                            >
                                {artistPhoto ? (
                                    <img 
                                        src={artistPhoto} 
                                        alt={album.artist} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    album.artist.charAt(0)
                                )}
                            </div>
                            
                            <span
                                onClick={() => navigate(`/artist/${encodeURIComponent(album.artist)}`)}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                style={{
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    color: 'rgba(255,255,255,0.9)',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {album.artist}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>•</span>
                            <span style={{ color: '#9ca3af', fontSize: '20px', fontWeight: '500' }}>{album.year}</span>
                        </div>

                        <p style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '600px', margin: 0 }}>
                            {album.description}
                        </p>

                        {/* Balão de Nota + Botão de Favoritar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                            }}>
                                <div style={{ display: 'flex', gap: '6px' }}>{renderStars(album.rating, 22)}</div>
                                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', lineHeight: '1' }}>{album.rating}</span>
                                    <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>/ 5</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', borderRadius: '24px',
                                    backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                    border: isFavorite ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                                    color: isFavorite ? '#ef4444' : 'white', fontWeight: '600', fontSize: '16px',
                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = isFavorite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <Heart size={22} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "currentColor"} />
                                {isFavorite ? 'Favoritado' : 'Favoritar'}
                            </button>
                        </div>
                    </div>
                </section>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

                {/* === SEÇÃO DE REVIEWS === */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.02em' }}>Avaliações da Comunidade</h2>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', backgroundColor: 'white', border: 'none', color: '#121215', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <Plus size={18} /> Escrever Review
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {MOCK_REVIEWS.map((review, index) => (
                            <React.Fragment key={review.id}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #2dd4bf, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                                        {review.userInitials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{review.userName}</div>
                                                <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px' }}>{review.time}</div>
                                            </div>
                                            <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}><MoreHorizontal size={20} /></button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>{renderStars(review.rating, 16)}</div>
                                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: '#e5e7eb' }}>{review.text}</p>
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                            <ActionButton icon={<Heart size={16} />} label={review.likes} />
                                            <ActionButton icon={<MessageCircle size={16} />} label={review.comments.length > 0 ? review.comments.length : 'Responder'} />
                                        </div>
                                        {review.comments.length > 0 && (
                                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                                                {review.comments.map(comment => (
                                                    <div key={comment.id} style={{ display: 'flex', gap: '16px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #818cf8, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                                                            {comment.userInitials}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{comment.userName}</span>
                                                                <span style={{ color: '#6b7280', fontSize: '12px' }}>{comment.time}</span>
                                                            </div>
                                                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#d1d5db' }}>{comment.text}</p>
                                                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                                                <ActionButton icon={<Heart size={14} />} label={comment.likes} small />
                                                                <ActionButton icon={<CornerDownRight size={14} />} label="Responder" small />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < MOCK_REVIEWS.length - 1 && (
                                    <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}

function ActionButton({ icon, label, small = false }) {
    const [hover, setHover] = useState(false);
    return (
        <button
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