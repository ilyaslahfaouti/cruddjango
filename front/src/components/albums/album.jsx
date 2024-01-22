import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import AddSong from './add_song';

function Album({ artists, album, reset, songs, genders }) {
  const [songArtists, setSongArtists] = useState([]);

  useEffect(() => {
    const updatedSongs = songs.songs_with_genres.map((songData) => {
      const artist = artists.find((artist) => artist.id_artiste === songData.song.artist);
      const artistName = artist ? artist.name : 'Unknown Artist';
      return { ...songData, artistName };
    });
    setSongArtists(updatedSongs);
  }, [songs, artists]);

  return (
    <div>
      <div>
        <Modal show={album != null} onHide={reset} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">{album && album.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>Add Song</div>
              {album && (
                <div className="text-center">
                  <p>Cover: {album.album_details['cover']}</p>
                  <p>Release Year: {album.album_details['release_date']}</p>
                  <div>
                    <h4>Artistes:</h4>
                    {album.artists && album.artists.map((artist, index) => (
                      <p key={index}>{artist.name}</p>
                    ))}
                  </div>
                  <div>
                    <h4>Songs:</h4>
                    {songArtists && songArtists.map((songData, index) => (
                      <div key={index}>
                        <p>Title: {songData.song.title}</p>
                        <p>Duration: {songData.song.duration}</p>
                        <p>Artist: {songData.artistName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <AddSong artists={artists} album={album} genders={genders} />
        </Modal>
      </div>
    </div>
  );
}

export default Album;
