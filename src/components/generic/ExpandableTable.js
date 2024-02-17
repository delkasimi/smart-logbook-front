import React, { useState } from "react";
import { useCollapse } from "react-collapsed";
import { FaEdit, FaTrash } from "react-icons/fa";

const ActionMediaCell = ({ media }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  return (
    <td>
      {media.length > 0 ? (
        <div className="media-thumbnails">
          {media.map((mediaItem, index) => (
            <div
              key={index}
              className="media-thumbnail"
              onClick={() => {
                setSelectedImages(media.map((item) => item.mediaUrl)); // Set all images
                setCurrentImageIndex(index); // Set the index of the clicked image
              }}
            >
              <img
                src={mediaItem.media_url}
                alt={`Media ${index}`}
                width="50"
                height="50"
              />
              {mediaItem.comment && <span> {mediaItem.comment}</span>}
            </div>
          ))}
        </div>
      ) : (
        <div>No media available</div>
      )}
    </td>
  );
};

const ExpandableTable = ({
  phase,
  operations,
  actions,
  phaseAttributes,
  operationAttributes,
  actionAttributes,
  onAddOperation,
  onAddAction,
  onEditPhase,
  onEditOperation,
  onEditAction,
  onDeletePhase,
  onDeleteOperation,
  onDeleteAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [operationExpansion, setOperationExpansion] = useState(
    new Array(operations.length).fill(false)
  );

  const {
    getCollapseProps: getPhaseCollapseProps,
    getToggleProps: getPhaseToggleProps,
    isExpanded: isPhaseExpanded,
  } = useCollapse({
    isOpened: isExpanded,
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleOperationExpand = (index) => {
    const newOperationExpansion = [...operationExpansion];
    newOperationExpansion[index] = !newOperationExpansion[index];
    setOperationExpansion(newOperationExpansion);
  };

  return (
    <div className="card">
      <div className="card-body p-0">
        {operations && operations.length > 0 ? (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Operations</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => onAddOperation(phase.phase_id)}
                >
                  Add Operation
                </button>
              </div>
            </div>
            <div className="card-body">
              <table className="operations-table phases-table-hover">
                <thead>
                  <tr>
                    {operationAttributes.map(({ label }, index) => (
                      <th key={index}>{label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((operation, index) => (
                    <React.Fragment key={index}>
                      <tr
                        onClick={() => toggleOperationExpand(index)}
                        className="operation-row"
                        style={{ position: "relative" }}
                      >
                        {operationAttributes.map(
                          ({ attribute, type }, attrIndex) => (
                            <td key={attrIndex}>
                              {type === "object"
                                ? Object.entries(operation[attribute]).map(
                                    ([key, value], i) => (
                                      <div key={i}>{`${key}: ${value}`}</div>
                                    )
                                  )
                                : operation[attribute]}
                            </td>
                          )
                        )}
                        <td>
                          <div className="button-group">
                            <button
                              className="edit-button"
                              onClick={(event) => {
                                event.stopPropagation(); // Prevent event propagation
                                onEditOperation(operation);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="delete-button"
                              onClick={(event) => {
                                event.stopPropagation(); // Prevent event propagation
                                onDeleteOperation(operation.operation_id);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {operationExpansion[index] && (
                        <tr className="expandable-body">
                          <td colSpan={operationAttributes.length + 1}>
                            {actions[operation.operation_id] &&
                            actions[operation.operation_id].length > 0 ? (
                              <div className="card">
                                <div className="card-header">
                                  <h3 className="card-title">
                                    Operation:{operation.operation_id} - Actions
                                  </h3>
                                  <div className="card-tools">
                                    <button
                                      className="btn btn-block btn-success float-right"
                                      onClick={() =>
                                        onAddAction(operation.operation_id)
                                      }
                                    >
                                      Add Action
                                    </button>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <table
                                    className="action-table action-table-hover"
                                    style={{ width: "100%" }}
                                  >
                                    <thead>
                                      <tr>
                                        {actionAttributes.map(
                                          ({ label }, index) => (
                                            <th key={index}>{label}</th>
                                          )
                                        )}
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {actions[operation.operation_id].map(
                                        (action, actionIndex) => (
                                          <tr key={actionIndex}>
                                            {actionAttributes.map(
                                              (
                                                { attribute, type },
                                                attrIndex
                                              ) => (
                                                <td key={attrIndex}>
                                                  {type === "object" ? (
                                                    Object.entries(
                                                      action[attribute]
                                                    ).map(([key, value], i) => (
                                                      <div
                                                        key={i}
                                                      >{`${key}: ${value}`}</div>
                                                    ))
                                                  ) : type === "media" ? (
                                                    // Display ActionMediaCell for media attributes
                                                    <ActionMediaCell
                                                      media={action[attribute]}
                                                    />
                                                  ) : (
                                                    action[attribute]
                                                  )}
                                                </td>
                                              )
                                            )}
                                            <td>
                                              <div className="button-group">
                                                <button
                                                  className="edit-button"
                                                  onClick={(event) => {
                                                    event.stopPropagation(); // Prevent event propagation
                                                    onEditAction(action);
                                                  }}
                                                >
                                                  <FaEdit />
                                                </button>
                                                <button
                                                  className="delete-button"
                                                  onClick={(event) => {
                                                    event.stopPropagation(); // Prevent event propagation
                                                    onDeleteAction(
                                                      action.action_id
                                                    );
                                                  }}
                                                >
                                                  <FaTrash />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="card">
                                <div className="card-header">
                                  <h3 className="card-title">
                                    Operation:{operation.operation_id} - No
                                    Actions found
                                  </h3>
                                  <div className="card-tools">
                                    <button
                                      className="btn btn-block btn-success float-right"
                                      onClick={() =>
                                        onAddAction(operation.operation_id)
                                      }
                                    >
                                      Add Action
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">No Operations found</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => onAddOperation(phase.phase_id)}
                >
                  Add Operation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableTable;
