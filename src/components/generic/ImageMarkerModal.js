import React, { useState, useRef, useEffect } from "react";

const ImageMarkerModal = ({
  imageUrl,
  onSelectCoordinate,
  onClose,
  initialMarkerPosition,
}) => {
  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
  const imageContainerRef = useRef(null);

  const handleImageClick = (event) => {
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100; // Convert to percentage of width
    const y = ((event.clientY - rect.top) / rect.height) * 100; // Convert to percentage of height
    setMarkerPosition({ x, y });
  };

  const handleConfirmClick = () => {
    if (markerPosition) {
      onSelectCoordinate(markerPosition);
    }
  };

  // Effect to reset marker position when initialMarkerPosition changes
  // This is useful if the initialMarkerPosition prop changes without unmounting the component
  useEffect(() => {
    if (initialMarkerPosition) {
      setMarkerPosition(initialMarkerPosition);
    }
  }, [initialMarkerPosition]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="media-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="media-image-container"
          ref={imageContainerRef}
          onClick={handleImageClick}
          style={{ position: "relative" }}
        >
          <img
            src={imageUrl}
            alt="Markable"
            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block" }}
          />
          {markerPosition && (
            <div
              style={{
                position: "absolute",
                top: `${markerPosition.y}%`,
                left: `${markerPosition.x}%`,
                transform: "translate(-50%, -50%)",
                width: "40px",
                height: "40px",
                backgroundColor: "red",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
        <div className="button-container">
          <button onClick={handleConfirmClick} className="confirm-button">
            Confirm Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageMarkerModal;
