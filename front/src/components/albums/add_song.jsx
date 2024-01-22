import axios from 'axios';
import React, { useState } from 'react';

const AddSong = ({ artists, album, genders }) => {
    const [newSong, setNewSong] = useState({
        title: '',
        duration: '',
        album: album.album_details.id_album,
        artist: '',
        genders: [],
    });

    const HandleSong = (e) => {
        const { name, value } = e.target;
        if (name === 'genders') {
            const isChecked = e.target.checked;
            const genreId = parseInt(value, 10);
            setNewSong((prevSong) => {
                if (isChecked) {
                    return { ...prevSong, genders: [...prevSong.genders, genreId] };
                } else {
                    return { ...prevSong, genders: prevSong.genders.filter((id) => id !== genreId) };
                }
            });
        } else {
            setNewSong((prevSong) => ({
                ...prevSong,
                [name]: value,
            }));
        }
    };

    const HandleSubmit = () => {
        console.log(newSong);
        axios
            .post(`http://127.0.0.1:8000/api/albums/${album.album_details.id_album}/songs/create`, newSong)
            .then((response) => {
                console.log('Song added:', response.data);
            })
            .catch((error) => {
                console.error('Erreur lors de l\'ajout du morceau:', error);
            });
    };

    return (
        <div>
            <div>
                <label>Titre:</label>
                <input type='text' placeholder='Titre' name='title' onChange={HandleSong} />
            </div>
            <div>
                <label>Durée:</label>
                <input type='number' placeholder='Durée' name='duration' onChange={HandleSong} />
            </div>
            <div>
                <label>Artiste:</label>
                <select name='artist' onChange={HandleSong} value={newSong.artist}>
                    {artists && artists.map((artist, index) => (
                        <option key={index} value={artist.id_artiste}>{artist.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Genres:</label>
                {genders &&
                    genders.map((gender, index) => (
                        <div key={index}>
                            <label>
                                <input
                                    type='checkbox'
                                    name='genders'
                                    value={gender.id_genre}
                                    onChange={HandleSong}
                                    checked={newSong.genders.includes(gender.id_genre)}
                                />
                                {gender.Title}
                            </label>
                        </div>
                    ))}
            </div>
            <div>
                <button type='button' onClick={HandleSubmit}>Ajouter</button>
            </div>
        </div>
    );
};

export default AddSong;

