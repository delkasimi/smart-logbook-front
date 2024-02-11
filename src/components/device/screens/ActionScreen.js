import { React, useState } from "react";
import ResponseTypes from "../ResponseTypes";

const ActionScreen = ({
  action,
  collectResponse,
  initialResponse,
  responseTypes,
}) => {
  const [dropdownVisibility, setDropdownVisibility] = useState({});
  const [ObjectsStatusResponses, setObjectsStatusResponses] = useState(
    initialResponse.ObjectsStatusResponses || {}
  );
  const [ResponseTypeResponse, setResponseTypeResponse] = useState(
    initialResponse.ResponseTypeResponse || {}
  );
  const responseType = action.ActionReference.ResponseType.type;
  const responseLabel = action.ActionReference.response_label;

  const handleAllResponses = () => {
    const combinedResponse = {
      ResponseTypeResponse,
      ObjectsStatusResponses,
    };

    collectResponse(combinedResponse);
  };

  const handleResponseTypeResponse = (response) => {
    setResponseTypeResponse(response);

    const immediateCombinedResponse = {
      ResponseTypeResponse: response,
      ObjectsStatusResponses,
    };

    collectResponse(immediateCombinedResponse);
  };

  const toggleDropdown = (objId) => {
    setDropdownVisibility((prev) => ({ ...prev, [objId]: !prev[objId] }));
  };

  const handleSelectResponse = (objId, response) => {
    setObjectsStatusResponses((prev) => ({ ...prev, [objId]: response }));
    setDropdownVisibility((prev) => ({ ...prev, [objId]: false }));
    handleAllResponses();
  };

  // Create a new array that combines items from action.ActionReference.Objects and action.Objects
  const combinedArray = [...action.ActionReference.Objects, ...action.Objects];

  return (
    <div className="screen">
      <div className="section">
        <div className="action-flag-section">
          <img
            src={
              action.ActionReference.ActionType.name === "Read"
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
          <span>{action.ActionReference.description}</span>
          <span>{action.description}</span>
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

      {combinedArray.length > 0 && (
        <div className="section">
          <div className="device-image-grid">
            {combinedArray.map((obj) =>
              obj.Media.length > 0 ? (
                obj.Media.map((media) => (
                  <div key={media.media_id} className="device-image-container">
                    <img
                      src={media.media_url}
                      alt={media.comment}
                      onClick={() => toggleDropdown(obj.object_id)}
                    />
                    {dropdownVisibility[obj.object_id] && (
                      <div className="inline-dropdown">
                        {["Missing", "Broken", "OK"].map((option) => (
                          <div
                            key={option}
                            onClick={() =>
                              handleSelectResponse(obj.object_id, option)
                            }
                            className={
                              ObjectsStatusResponses[obj.object_id] === option
                                ? "selected"
                                : ""
                            }
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="device-image-comment">
                      {obj.object_code}-{obj.object_name}
                    </div>
                  </div>
                ))
              ) : (
                <div key={obj.object_id} className="device-image-container">
                  {obj.object_code}-{obj.object_name}
                </div>
              )
            )}
          </div>
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

      {responseType && (
        <div className="section">
          <h5>{responseLabel}</h5>
          <div>
            {/* Render ResponseTypes component */}
            <ResponseTypes
              responseType={responseType}
              responseTypes={responseTypes}
              collectResponse={handleResponseTypeResponse}
              initialResponse={ResponseTypeResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionScreen;
