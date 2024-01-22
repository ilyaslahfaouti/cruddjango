// Genders.jsx

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditGender from './edit_gender';
import { Modal, Button } from 'react-bootstrap';


function Genders() {
  const [selectedGender, setSelectedGender] = useState('');
  const [genders, setGenders] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/genres')
      .then(response => setGenders(response.data))
  }, []);

  const handleEdit = (gender) => {
    setSelectedGender(gender);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="Genders">
      <div>
        <h1>Genders</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {genders && genders.map((gender, index) => (
              <tr key={index}>
                <td>{gender.Title}</td>
                <td>{gender.Description}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(gender)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Gender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditGender Gender={selectedGender} setGenders={setGenders}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Genders;
