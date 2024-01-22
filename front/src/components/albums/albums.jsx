// Albums.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../loading';
import Album from './album';
import EditAlbum from './editAlbum';
import AddAlbum from './add_album';
import { useUser } from '../UserContext'

function Albums() {

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [songs, setSongs] = useState('');
  const [artists, setArtists] = useState('');
  const [genders, setGenders] = useState('');
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const { state: { user, isAuthenticated, token }, dispatch } = useUser();



  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/albums')
      .then(response => {
        setAlbums(response.data);
        setIsLoading(false);
      });
   // fetchArtists();
    fetchGenders();
  }, []);
  const albumStyles = `
  .dashboard {
    padding: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  .cover-icon {
    width: 50px; /* Ajustez la taille selon vos besoins */
    height: auto; /* Ajustez la taille selon vos besoins */
  }

  
`;
  //const fetchArtists = () => {
  //  axios.get('http://127.0.0.1:8000/artists/')
 //     .then(response => setArtists(response.data));
 // };

  const fetchGenders = () => {
    axios.get('http://127.0.0.1:8000/api/genres')
      .then(response => setGenders(response.data));
  };

  const handleAlbum = (album) => {
    axios.get(`http://127.0.0.1:8000/api/albums/${album.id_album}/`)
      .then(response => {
        setSelectedAlbum(response.data);
        return axios.get(`http://127.0.0.1:8000/api/albums/${album.id_album}/songs`);
      })
      .then(response => {
        setSongs(response.data);
        setIsShowing(true);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des chansons de l'album :", error);
      });
  };

  const resetAlbum = () => {
    setSelectedAlbum('');
  };

  const handleEdit = (album) => {
    
    axios.get(`http://127.0.0.1:8000/api/albums/${album.id_album}/`)
      .then(response => setSelectedAlbum(response.data));
    
    setIsEditing(true);
  };
  const handleDelete = (album) => {
    // Vérifiez si l'utilisateur est authentifié
    if (!isAuthenticated) {
      console.error('User not authenticated');
      // Affichez un message d'erreur ou effectuez une autre action pour les utilisateurs non authentifiés
      return;
    }
  
    // Incluez le jeton d'authentification dans les en-têtes
    const headers = {
      Authorization: `Bearer ${token}`, // Assurez-vous d'utiliser "Bearer" suivi du jeton
    };
   console.log(headers)
    axios.delete(`http://127.0.0.1:8000/api/albums/${album.id_album}/delete`, { headers })
      .then(response => {
        console.log('Album deleted successfully:', response.data);
        axios.get('http://127.0.0.1:8000/api/albums')
          .then(response => {
            setAlbums(response.data);
          });
      })
      .catch(error => {
        console.error('Error deleting album:', error);
        // Affichez un message d'erreur ou effectuez une autre action en cas d'erreur lors de la suppression
      });
  };
  const handleAddAlbumClick = () => {
    setIsAddingAlbum(true);
  };

  const handleAddAlbumCancel = () => {
    setIsAddingAlbum(false);
  };


  return (
    <div className="Albums">
      <style>{albumStyles}</style> {/* Intégrer les styles ici */}
      <div className="dashboard">
        {!isLoading ? (
          <div>
            <h1>Albums</h1>
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {albums.map((album, index) => (
                  <tr key={index}>
                    <td>
                      <img src={`http://127.0.0.1:8000/${album.cover}`} alt={album.title} className="cover-icon" />
                    </td>
                    <td>
                      <a href="#" onClick={() => handleAlbum(album)}>{album.title}</a>
                    </td>
                    <td>
                      <a href='#' onClick={() => handleEdit(album)} >Edit</a>
                      <a href='#' onClick={() => handleDelete(album)} >Delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      <div>
        {isShowing && <Album artists={artists} album={selectedAlbum} reset={resetAlbum} songs={songs} genders={genders} />}
        {isEditing && <EditAlbum setAlbums={setAlbums} artists={artists} album={selectedAlbum} reset={resetAlbum} />}
        {isAddingAlbum ? (
          <div>
            <AddAlbum artists={artists} setAlbums={setAlbums} />
            <button onClick={handleAddAlbumCancel}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleAddAlbumClick}>Add Album</button>
        )}
      </div>
    </div>
  );
}

export default Albums;
