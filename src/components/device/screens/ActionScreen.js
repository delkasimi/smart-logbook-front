import React, { useState, useEffect, Fragment } from "react";
import ResponseTypes from "../ResponseTypes";
import OpenSeadragon from "openseadragon";

const StatusDropdown = ({ onSelect, onClose }) => (
  <div className="inline-dropdown">
    <div onClick={() => onSelect("Missing")}>Missing</div>
    <div onClick={() => onSelect("Problem")}>Problem</div>
    <div onClick={() => onSelect("Not used")}>Not used</div>
    <div onClick={() => onSelect("OK")}>OK</div>
    <button onClick={onClose}>Close</button>
  </div>
);

const ActionScreen = ({ action, collectResponse, initialResponse }) => {
  //Localization
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    setTimeout(initializeOpenSeadragon, 100);
  };

  const initializeOpenSeadragon = () => {
    const { imageUrl, x, y } = extractDetailsFromLocalization(
      action.Localization
    );

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

  console.log("action:", action);
  console.log("initialResponse:", initialResponse);

  const [userComment, setUserComment] = useState(
    initialResponse.UserComment || ""
  );
  const [ObjectsStatusResponses, setObjectsStatusResponses] = useState(
    initialResponse.ObjectsStatusResponses || {}
  );

  const [ResponseTypeResponse, setResponseTypeResponse] = useState(
    initialResponse.ResponseTypeResponse || {}
  );

  // State to track the currently selected object ID for status update
  const [selectedObjIdForStatus, setSelectedObjIdForStatus] = useState(null);

  // State to hold all objects' statuses
  const [objectsStatus, setObjectsStatus] = useState(
    initialResponse.objectsStatus || {}
  );

  // Function to handle status selection for an object
  const handleStatusSelect = (objId, status) => {
    setObjectsStatus((prevStatuses) => ({
      ...prevStatuses,
      [objId]: status,
    }));
    setSelectedObjIdForStatus(null); // Close the dropdown
  };

  // Function to render the status button and dropdown
  const renderStatusButtonAndDropdown = (objId) => (
    <>
      <button onClick={() => setSelectedObjIdForStatus(objId)}>
        Set Status
      </button>
      {selectedObjIdForStatus === objId && (
        <StatusDropdown
          onSelect={(status) => handleStatusSelect(objId, status)}
          onClose={() => setSelectedObjIdForStatus(null)}
        />
      )}
    </>
  );

  useEffect(() => {
    const combinedResponse = {
      ResponseTypeResponse,
      UserComment: userComment,
      objectsStatus: objectsStatus,
    };

    console.log("Updated combinedResponse:", combinedResponse);

    collectResponse(combinedResponse);
  }, [ResponseTypeResponse, userComment, objectsStatus]);

  return (
    <div className="screen">
      <div className="section">
        <div className="action-operation-text">
          Operation : {action.Operation.name}
        </div>
        <div className="action-flex-container">
          <div className="action-text">
            Action : {action.Operation.sequence} - {action.sequence}
          </div>

          {action && action.Localization && action.Localization.Media && (
            <button
              className="action-location-button"
              onClick={handleOpenModal}
            >
              Show Location
            </button>
          )}
        </div>

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

      {["important", "information"].includes(action.flag) && (
        <div
          className={`section ${
            action.flag === "important"
              ? "important-bg"
              : action.flag === "information"
              ? "information-bg"
              : ""
          }`}
        >
          {["important", "information"].includes(action.flag) && (
            <div className="flag-section">
              <img
                src={
                  action.flag === "important"
                    ? "/caution.png"
                    : "/information.png"
                }
                alt={
                  action.flag === "important"
                    ? "Important Icon"
                    : "Information Icon"
                }
              />
              <span>
                {action.flag === "important"
                  ? "Important Action"
                  : "Action for Information"}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="section">
        <div className="action-flag-section">
          <img
            src={
              action.ActionReference.ActionType.name === "Capture"
                ? "/eye.png"
                : action.ActionReference.ActionType.name === "Check"
                ? "/check.png"
                : action.ActionReference.ActionType.name === "Start"
                ? "/start.png"
                : action.ActionReference.ActionType.name === "Stop"
                ? "/stop.png"
                : ""
            }
          />
          <span>
            {action.ActionReference.ActionType.name} -{" "}
            {action.ActionReference.Act.act} -{" "}
          </span>
        </div>
      </div>

      {action.comment && (
        <div className="section">
          <div className="action-flag-section">
            <img src="/comment.png" />
            <span>{action.comment}</span>
          </div>
        </div>
      )}

      {action.Objects && action.Objects.length > 0 && (
        <div className="section">
          <table className="table-section">
            <thead>
              <tr>
                <th>Object</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {action.Objects.map((obj) => (
                <tr key={obj.object_id}>
                  <td>
                    {obj.object_code} - {obj.object_name}
                  </td>
                  <td>
                    {obj.Media && obj.Media.length > 0 ? (
                      <img
                        src={obj.Media[0].media_url}
                        alt="Object"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {renderStatusButtonAndDropdown(obj.object_id)}
                    {objectsStatus[obj.object_id] && (
                      <span>({objectsStatus[obj.object_id]})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {action.Media.length > 0 && (
        <div className="section">
          <div className="device-image-grid">
            {" "}
            {/* Special div for device images */}
            {action.Media.map((media) => (
              <div class="device-image-container" key={media.media_id}>
                <img src={media.media_url} alt={media.comment} />
                <div className="device-image-comment">{media.comment}</div>{" "}
                {/* Comment below the image */}
              </div>
            ))}
          </div>
        </div>
      )}

      {action.ActionReference.ActionType &&
        action.ActionReference.ActionType.name == "Capture" && (
          <ResponseTypes
            action={action}
            collectResponse={setResponseTypeResponse}
            initialResponse={ResponseTypeResponse}
          />
        )}

      <div className="section">
        <label>Comment: </label>
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="Any comment..."
          className="comment-textarea"
        ></textarea>
      </div>
    </div>
  );
};

export default ActionScreen;
