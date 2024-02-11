import React from "react";

const ImageGridModal = ({ images, onSelectImage, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="image-grid-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-item"
              onClick={() => onSelectImage(image)}
            >
              <img src={image.media_url} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .image-grid-modal {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-height: 80%;
          overflow-y: auto;
        }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
        }
        .image-item {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .image-item:hover {
          transform: scale(1.05);
        }
        .image-item img {
          width: 100%; /* Make the image fill the container */
          height: auto; /* Maintain aspect ratio */
          object-fit: cover; /* Cover the container with the image without stretching it */
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

export default ImageGridModal;
