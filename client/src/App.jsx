import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import Album from './pages/Album';
import Artist from './pages/Artist';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<Home />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/artist/:artistName" element={<Artist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;