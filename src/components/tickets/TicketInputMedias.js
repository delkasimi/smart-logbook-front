import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


const TicketInputMedias = ({ onBack, onNext, mediaData, setMediaData }) => {


  const handleImageUpload = (e) => {

    if (mediaData.length >= 6) {
        // Optionally show an alert or a message to the user
        alert("You can upload up to 6 images.");
        return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        setMediaData(prevMediaData => [...prevMediaData, { image: reader.result, file, comment: '' }]);
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (index) => {
    setMediaData(currentMediaData => currentMediaData.filter((_, i) => i !== index));
  };
  
  const handleCommentChange = (e, index) => {
    const newComment = e.target.value;
    setMediaData(currentMediaData =>
      currentMediaData.map((item, i) =>
        i === index ? { ...item, comment: newComment } : item
      )
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Add Medias</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <div className="image-grid">
        {mediaData.map((media, index) => (
            <div className="image-container" key={index}>
            <img src={media.image} alt={`Uploaded ${index}`} />
            <input 
                type="text" 
                placeholder="Add a comment..." 
                value={media.comment} 
                onChange={(e) => handleCommentChange(e, index)}
            />
            <div className="delete-icon" onClick={() => handleDeleteImage(index)}>
                <i className="fas fa-trash-alt"></i>
            </div>
            </div>
        ))}
        </div>

        <div className="button-container">
          <button className="cancel-button" onClick={onBack}>
            Back
          </button>
          <button className="confirm-button" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketInputMedias;
