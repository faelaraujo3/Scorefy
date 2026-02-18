import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, Flame, Globe, Sparkles, LogOut, LogIn, UserPlus, Settings } from 'lucide-react';
import logoScorefy from '../assets/logoscorefy.png';
import { useAuth } from '../contexts/AuthContext'; 

export default function Header({ onSearch, hideSearch, hideNav }) {
  const [bellHover, setBellHover] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [showMenu, setShowMenu] = useState(false); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); 
  const menuRef = useRef(null); 

  const isActive = (path) => location.pathname === path;

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: 'rgba(18, 18, 21, 0.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}
    >
      {/* === LOGO === */}
      <div 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20, cursor: 'pointer' }}
      >
        <img src={logoScorefy} alt="Logo Scorefy" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 'bold', fontSize: '23px', letterSpacing: '-0.025em', color: 'white' }}>
          Scorefy
        </span>
      </div>

      {/* === NAVEGAÇÃO CENTRAL === */}
      {!hideNav && (
        <nav
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '9999px', padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 10
          }}
        >
          <NavButton icon={<Globe size={18} />} label="Explorar" active={isActive('/')} onClick={() => navigate('/')} />
          <NavButton icon={<Flame size={18} />} label="Em Alta" active={isActive('/trending')} onClick={() => navigate('/trending')} />
          <NavButton icon={<Sparkles size={18} />} label="Lançamentos" active={isActive('/releases')} onClick={() => navigate('/releases')} />
        </nav>
      )}

      {/* === ÁREA DIREITA (BUSCA + USUÁRIO) === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 20 }}>
        
        {/* Busca */}
        {!hideSearch && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar..."
              onChange={(e) => onSearch?.(e.target.value)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              style={{
                backgroundColor: inputFocus ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                padding: '8px 16px 8px 40px',
                fontSize: '14px',
                width: inputFocus ? '240px' : '192px',
                color: 'white', outline: 'none', transition: 'all 0.2s ease'
              }}
            />
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: inputFocus ? 'white' : '#9ca3af', pointerEvents: 'none' }}>
              <Search size={16} />
            </div>
          </div>
        )}

        {/* Notificação (Só mostra se logado) */}
        {user && (
          <button
            onMouseEnter={() => setBellHover(true)}
            onMouseLeave={() => setBellHover(false)}
            style={{
              padding: '8px', borderRadius: '50%',
              backgroundColor: bellHover ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: 'none', cursor: 'pointer', color: bellHover ? 'white' : '#9ca3af',
              position: 'relative', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#ec4899', borderRadius: '50%', border: '2px solid #121215' }} />
          </button>
        )}

        {/* === AVATAR DO USUÁRIO COM DROPDOWN === */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              background: showMenu ? 'rgba(255,255,255,0.05)' : 'transparent',
              padding: '4px 8px 4px 4px', borderRadius: '50px', transition: 'all 0.2s'
            }}
          >
            {/* Foto / Ícone */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: user ? 'linear-gradient(to top right, #3be7e7ff, #e770ffff)' : '#333',
              padding: '2px'
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#121215',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}>
                {user && user.imagem_url ? (
                  <img src={user.imagem_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={20} color={user ? 'white' : '#888'} />
                )}
              </div>
            </div>
            
            {/* Nome (Apenas se logado) */}
            {user && (
              <span style={{ fontWeight: '600', fontSize: '14px', color: 'white', paddingRight: '4px' }}>
                {user.username}
              </span>
            )}
          </div>

          {/* === O BALÃOZINHO (MENU) === */}
          {showMenu && (
            <div style={{
              position: 'absolute', top: '50px', right: '0', width: '220px',
              backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 100,
              animation: 'fadeIn 0.2s ease-out'
            }}>
              {user ? (
                <>
                  {/* Opções Logado */}
                  <div style={{ padding: '8px 12px', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{user.nome}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{user.email}</p>
                  </div>
                  
                  <MenuItem icon={<User size={16} />} label="Meu Perfil" onClick={() => navigate('/profile')} />
                  <MenuItem icon={<Settings size={16} />} label="Configurações" onClick={() => {}} />
                  
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 8px' }} />
                  
                  <MenuItem icon={<LogOut size={16} />} label="Sair da conta" onClick={handleLogout} danger />
                </>
              ) : (
                <>
                  {/* Opções Deslogado */}
                  <div style={{ padding: '12px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#ccc' }}>Faça parte do Scorefy!</p>
                  </div>
                  <MenuItem icon={<LogIn size={16} />} label="Fazer Login" onClick={() => navigate('/login')} highlight />
                  <MenuItem icon={<UserPlus size={16} />} label="Cadastrar-se" onClick={() => navigate('/register')} />
                </>
              )}
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}

// Botão do Menu Dropdown
function MenuItem({ icon, label, onClick, danger, highlight }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: '500', textAlign: 'left',
        background: highlight ? (hover ? '#2563eb' : '#3b82f6') : (hover ? 'rgba(255,255,255,0.08)' : 'transparent'),
        color: highlight ? 'white' : (danger ? '#ef4444' : (hover ? 'white' : '#ccc')),
        transition: 'all 0.2s'
      }}
    >
      {icon} {label}
    </button>
  );
}

// Botão da Navegação Central
function NavButton({ icon, label, active, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', border: 'none', cursor: 'pointer', outline: 'none' };
  const activeStyle = { backgroundColor: '#0891b2', color: 'white', boxShadow: '0 10px 15px -3px rgba(8, 145, 178, 0.3)' };
  const inactiveStyle = { backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: isHovered ? 'white' : '#9ca3af' };
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{...baseStyle, ...(active ? activeStyle : inactiveStyle)}}
    >
      {icon}<span>{label}</span>
    </button>
  );
}