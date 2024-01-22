import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditGender({ Gender, setGenders }) {
  const [editedGender, setEditedGender] = useState({
    Title: '',
    Description: '',
  });

  useEffect(() => {
    if (Gender) {
      const { Title = '', Description = '' } = Gender;
      setEditedGender({ Title, Description });
    }
  }, [Gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGender((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!Gender || !Gender.id_genre) {
        console.error('Invalid Gender object:', Gender);
        return;
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/genres/${Gender.id_genre}`, editedGender);
      setGenders(response.data);
    } catch (error) {
      console.error('Error updating gender:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="Title" value={editedGender.Title} onChange={handleChange} />
        <label>Description</label>
        <textarea
          name="Description"
          value={editedGender.Description}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditGender;
