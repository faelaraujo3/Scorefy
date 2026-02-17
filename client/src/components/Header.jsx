import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Flame, Globe, Sparkles } from 'lucide-react';
import logoScorefy from '../assets/logoscorefy.png';

export default function Header({ onSearch, hideSearch }) {
  const [bellHover, setBellHover] = useState(false);
  const [userHover, setUserHover] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  
  const navigate = useNavigate();

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
      {/* Logo e titulo do site */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20 }}>
        <img
          src={logoScorefy}
          alt="Logo Scorefy"
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            letterSpacing: '-0.025em',
            color: 'white',
            display: 'block'
          }}
        >
          Scorefy
        </span>
      </div>

      {/* Navegação central centralizada */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '9999px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
      >
        <NavButton icon={<Globe size={18} />} label="Explorar" active={true} />
        <NavButton icon={<Flame size={18} />} label="Em Alta" />
        <NavButton icon={<Sparkles size={18} />} label="Lançamentos" />
      </nav>

      {/* Busca e Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 20 }}>
        
        {/* Renderiza a busca apenas se hideSearch for false ou undefined */}
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
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: inputFocus ? 'white' : '#9ca3af',
                pointerEvents: 'none',
                display: 'flex'
              }}
            >
              <Search size={16} />
            </div>
          </div>
        )}

        {/* Notificação */}
        <button
          onMouseEnter={() => setBellHover(true)}
          onMouseLeave={() => setBellHover(false)}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            backgroundColor: bellHover ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: bellHover ? 'white' : '#9ca3af',
            position: 'relative',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ec4899',
              borderRadius: '50%',
              border: '2px solid #121215'
            }}
          />
        </button>

        {/* Avatar Usuário */}
        <div
          onClick={() => navigate('/profile')}
          onMouseEnter={() => setUserHover(true)}
          onMouseLeave={() => setUserHover(false)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(to top right, #3be7e7ff, #e770ffff)',
            padding: '2px',
            cursor: 'pointer',
            transform: userHover ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#121215',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <User size={16} color="white" />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButton({ icon, label, active }) {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', border: 'none', cursor: 'pointer', outline: 'none' };
  const activeStyle = { backgroundColor: '#0891b2', color: 'white', boxShadow: '0 10px 15px -3px rgba(8, 145, 178, 0.3)' };
  const inactiveStyle = { backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: isHovered ? 'white' : '#9ca3af' };
  return <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{...baseStyle, ...(active ? activeStyle : inactiveStyle)}}>{icon}<span>{label}</span></button>;
}