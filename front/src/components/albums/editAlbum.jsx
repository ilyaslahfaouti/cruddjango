// EditAlbum.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function EditAlbum({ album, reset, artists, setAlbums }) {
  const [editedAlbum, setEditedAlbum] = useState({
    title: '',
    cover: null,
    release_date: '',
    artists: [],
  });

  useEffect(() => {
    if (album && album.album_details) {
      setEditedAlbum({
        title: album.album_details.title || '',
        cover: album.album_details.cover || null,
        release_date: album.album_details.release_date || '',
        artists: album.artists.map(artist => artist.id_artiste.toString()) || [],
      });
   
    }
  }, [album]);
  console.log(editedAlbum)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      const artistId = value.toString();
      const selectedArtists = checked
        ? [...editedAlbum.artists, artistId]
        : editedAlbum.artists.filter((artist) => artist !== artistId);

      setEditedAlbum((prevAlbum) => ({
        ...prevAlbum,
        artists: selectedArtists,
      }));
    } else if (type === 'file') {
      setEditedAlbum((prevAlbum) => ({
        ...prevAlbum,
        cover: files[0],
      }));
    } else {
      setEditedAlbum((prevAlbum) => ({
        ...prevAlbum,
        [name]: value,
      }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setEditedAlbum(prevState => ({
      ...prevState,
      cover: file,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('release_date', editedAlbum.release_date);

    editedAlbum.artists.forEach(artistId => {
      formData.append('artists', parseInt(artistId, 10));
    });

    formData.append('title', editedAlbum.title);

    if (editedAlbum.cover instanceof File) {
      formData.append('cover', editedAlbum.cover);
    }

    axios.put(`http://127.0.0.1:8000/api/albums/${album.album_details.id_album}`, formData)
      .then((response) => {
        setAlbums(response.data)
        reset();
      })
      .catch((error) => {
        console.error('Error updating album:', error);
      });
  };

  return (
    <>
      <Button variant="primary" onClick={reset}>
        Open Edit Album
      </Button>

      <Modal show={album !== null} onHide={reset} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Title</label>
            <input
              type='text'
              name='title'
              value={editedAlbum.title}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label>Cover</label>
            <input
              type='file'
              accept='image/*'
              name='cover'
              onChange={handleCoverChange}
              className="form-control mb-3"
            />

            <label>Release Date</label>
            <input
              type='date'
              name='release_date'
              value={editedAlbum.release_date}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label>Artists</label>
            {artists && artists.map((artist, index) => (
              <div key={index} className="form-check mb-3">
                <input
                  type='checkbox'
                  name='artists'
                  value={artist.id_artiste}
                  checked={editedAlbum.artists.includes(artist.id_artiste.toString())}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">{artist.name}</label>
              </div>
            ))}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={reset}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditAlbum;
