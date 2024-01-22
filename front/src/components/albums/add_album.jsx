import React, { useState } from 'react';
import axios from 'axios';

const AddAlbum = ({ artists, onClose, setAlbums}) => {
    const [newAlbum, setNewAlbum] = useState({
        title:'',
        cover: null,
        release_date: '',
        artists: [],
    });



const handleAlbum = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
        const selectedArtists = checked
            ? [...newAlbum.artists, value]
            : newAlbum.artists.filter((artist) => artist !== value);

        setNewAlbum((prevAlbum) => ({
            ...prevAlbum,
            artists: selectedArtists,
        }));
    } else if (type === 'file') {
        setNewAlbum((prevAlbum) => ({
            ...prevAlbum,
            cover: files[0],
        }));
    } else {
        setNewAlbum((prevAlbum) => ({
            ...prevAlbum,
            [name]: value,
        }));
    }
};



const handleSubmit = () => {
    console.log(newAlbum.cover);
    const formData = new FormData();
    formData.append('title', newAlbum.title);
    formData.append('release_date', newAlbum.release_date);
    newAlbum.artists.forEach(artistId => {
        formData.append('artists', parseInt(artistId, 10));
    });

    formData.append('cover', newAlbum.cover);
    console.log(newAlbum.cover)

    axios.post('http://127.0.0.1:8000/api/albums/create', formData)
        .then((response) =>setAlbums(response.data))
    
        .catch((error) => {
            console.error('Error adding album:', error);
        });
};



    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <label>Title:</label>
                <input type='text' name='title' onChange={handleAlbum} />
                <label>Cover:</label>
                <input type='file' name='cover' onChange={handleAlbum} />
                <label>Release date:</label>
                <input type='date' name='release_date' onChange={handleAlbum} />
                <label>Artists:</label>
                <div>
                    {artists && artists.map((artist, index) => (
                        <label key={index}>
                            <p>{artist.name}</p>
                            <input
                                type='checkbox'
                                name='artists'
                                value={artist.id_artiste}
                                onChange={handleAlbum}
                            />
                        </label>
                    ))}
                </div>
                <button type='button' onClick={handleSubmit}>Add</button>
            </div>
        </div>
    );
};

export default AddAlbum;
