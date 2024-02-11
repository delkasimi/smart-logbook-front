import React, { useState } from "react";

const GenericMediaModal = ({ images, currentImageIndex, onClose }) => {
  const [currentImage, setCurrentImage] = useState(
    images[currentImageIndex] || []
  );

  const [ImageIndex, setImageIndex] = useState(currentImageIndex + 1);

  const onNext = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    setImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentImage(images[ImageIndex]);
  };

  const onPrevious = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setCurrentImage(images[ImageIndex]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="media-modal">
        <div className="media-image-container">
          <img src={currentImage} alt="Media" />
          {images.length > 1 && (
            <div className="media-navigation">
              <button className="prev-button" onClick={onPrevious}>
                {"<"}
              </button>
              <button className="next-button" onClick={onNext}>
                {">"}
              </button>
            </div>
          )}
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericMediaModal;
