import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';

import axios from 'axios';
import Genders from './components/genders/genders';
import Albums from './components//albums/albums';
import Auth from './components/Auth';
import { useUser } from './components/UserContext';

function Home() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/albums')
      .then(response => {
        setAlbums(response.data);
        setIsLoading(false);
      })
  }, []);

  return (
    <div>
      <div className="album-cards">
        {!isLoading ? (
          albums.map((album, index) => (
            <div key={index} className="card">
         
              <img src={`http://127.0.0.1:8000/${album.cover}`} alt={album.title} />
              <h3>{album.title}</h3>
              <p>{album.artist}</p>
            </div>
          ))
        ) : (
          <p>Loading albums...</p>
        )}
      </div>
    </div>
  );
}



function App() {
  const { state: { user, isAuthenticated } } = useUser();

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Spotilike</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/genders">Genres</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
              <li>
                {isAuthenticated ? (
                  <span>Welcome, {user.name}!</span>
                ) : (
                  <Link to="/connexion">connexion</Link>
                )}
              </li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genders" element={<Genders />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/connexion" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;