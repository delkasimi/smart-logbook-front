import React, { useState, useEffect } from "react";
import OpenSeadragon from "openseadragon";

const OperationScreen = ({ operation, collectResponse, initialResponse }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    // Initialize OpenSeadragon after opening the modal
    setTimeout(initializeOpenSeadragon, 100); // Adding a timeout to ensure DOM elements are ready
  };

  const initializeOpenSeadragon = () => {
    const { imageUrl, x, y } = extractDetailsFromLocalization(
      operation.Localization
    );
    var viewer = OpenSeadragon({
      id: "openseadragon-viewer",
      prefixUrl: `${process.env.PUBLIC_URL}/openseadragon/`,
      tileSources: {
        type: "image",
        url: imageUrl,
      },
      // Set the visibility ratio to ensure that the image covers as much of the viewer as possible
      visibilityRatio: 1,
      // Set the minZoomImageRatio to 1 to allow the image to fill the viewer on the initial load
      minZoomImageRatio: 1,
    });

    // Ensure the viewer is initially centered on the marker's location
    viewer.addHandler("open", function () {
      viewer.viewport.zoomTo(viewer.viewport.getHomeZoom());
      const tiledImage = viewer.world.getItemAt(0);
      const imageBounds = tiledImage.getBounds();

      // Calculate the image point at 15% width from the left and 30% height from the top
      const imagePoint = new OpenSeadragon.Point(
        imageBounds.x + imageBounds.width * (x + 0.03),
        imageBounds.y + imageBounds.height * (y + 0.035)
      );
      // Convert image coordinates to viewport coordinates
      const viewportPoint =
        viewer.viewport.imageToViewportCoordinates(imagePoint);

      const markerElement = document.getElementById("marker");

      // Convert image coordinates to viewport coordinates
      //const viewportPoint = viewer.viewport.imageToViewportCoordinates(point);

      // Add the overlay with the correct positioning
      viewer.addOverlay({
        element: markerElement,
        location: imagePoint,
        placement: "CENTER",
      });

      // Ensure the marker is visible
      markerElement.style.display = "block";

      // Center the view on the marker
      //viewer.viewport.panTo(viewportPoint);
      //viewer.viewport.zoomTo(viewer.viewport.getHomeZoom());
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
      <h2>Operation: {operation.name}</h2>

      {["important", "information"].includes(operation.flag) && (
        <div
          className={`section ${
            operation.flag === "important"
              ? "important-bg"
              : operation.flag === "information"
              ? "information-bg"
              : ""
          }`}
        >
          {["important", "information"].includes(operation.flag) && (
            <div className="flag-section">
              <img
                src={
                  operation.flag === "important"
                    ? "/caution.png"
                    : "/information.png"
                }
                alt={
                  operation.flag === "important"
                    ? "Important Icon"
                    : "Information Icon"
                }
              />
              <span>
                {operation.flag === "important"
                  ? "Important Operation"
                  : "Operation for Information"}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="section">
        <div className="table-section">
          <table>
            <tbody>
              <tr>
                <th>Localization Name</th>
                <th>Operation Type Name</th>
                <th>Reference</th>
              </tr>
              <tr>
                <td>{operation.Localization?.name}</td>
                <td>{operation.OperationType?.name}</td>
                <td>{/* Render the reference here */}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="table-section">
          <table>
            <tbody>
              <tr>
                <th>Number of Actions</th>
                <th>Number of Objects</th>
              </tr>
              <tr>
                <td>{operation.Actions.length}</td>
                <td>
                  {operation.Actions.reduce(
                    (total, action) => total + action.Objects.length,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {operation.description && (
        <div className="section" style={{ backgroundColor: "white" }}>
          <h3>Description</h3>
          <p>{operation.description}</p>
        </div>
      )}
      {operation.comments && (
        <div className="section" style={{ backgroundColor: "white" }}>
          <h3>Comments</h3>
          <p>{operation.comments}</p>
        </div>
      )}
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

export default OperationScreen;
