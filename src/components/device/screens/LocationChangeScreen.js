// LocationChangeScreen.jsx
import React, { useState } from "react";
import OpenSeadragon from "openseadragon";

const LocationChangeScreen = ({
  oldLocalization,
  newLocalization,
  collectResponse,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    setTimeout(initializeOpenSeadragon, 100);
  };

  const initializeOpenSeadragon = () => {
    const { imageUrl, x, y } = extractDetailsFromLocalization(newLocalization);
    var viewer = OpenSeadragon({
      id: "openseadragon-viewer",
      prefixUrl: `${process.env.PUBLIC_URL}/openseadragon/`,
      tileSources: {
        type: "image",
        url: imageUrl,
      },
      visibilityRatio: 1,
      minZoomImageRatio: 1,
    });

    viewer.addHandler("open", function () {
      viewer.viewport.zoomTo(viewer.viewport.getHomeZoom());
      const tiledImage = viewer.world.getItemAt(0);
      const imageBounds = tiledImage.getBounds();
      const imagePoint = new OpenSeadragon.Point(
        imageBounds.x + imageBounds.width * (x + 0.03),
        imageBounds.y + imageBounds.height * (y + 0.035)
      );
      const viewportPoint =
        viewer.viewport.imageToViewportCoordinates(imagePoint);

      const markerElement = document.getElementById("marker");

      viewer.addOverlay({
        element: markerElement,
        location: imagePoint,
        placement: "CENTER",
      });

      markerElement.style.display = "block";
    });
  };

  function extractDetailsFromLocalization(localization) {
    const imageUrl = localization.Media?.media_url;
    const x = localization.x_coordinate / 100;
    const y = localization.y_coordinate / 100;
    return { imageUrl, x, y };
  }

  return (
    <div className="screen">
      <div className="section">
        <div className="action-flag-section">
          <img src="/move.png" />
          <span>Location Change Required</span>
        </div>
      </div>
      <div className="section">
        <div className="location-change-screen">
          <h2>Location Change Required</h2>
          <p>Please move from:</p>
          <p>
            <strong>Old Location: </strong>
            {oldLocalization.name}
          </p>
          <p>
            <strong>New Location: </strong>
            {newLocalization.name}
          </p>
        </div>
      </div>
      <button className="device-button" onClick={handleOpenModal}>
        Show Location
      </button>
      {isModalOpen && (
        <div
          className="device-modal-overlay"
          style={{ display: isModalOpen ? "flex" : "none" }}
        >
          <div className="loc-modal-content">
            <div
              className="loc-close-button"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </div>
            <div id="openseadragon-viewer"></div>{" "}
            <div id="marker" style={{ display: "none" }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationChangeScreen;
