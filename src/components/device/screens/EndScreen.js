import React from "react";

const ProcedureDetailsTable = ({ procedureDetails }) => {
  if (!procedureDetails) return null;

  return (
    <div className="section">
      <table className="section-table">
        <tbody>
          <tr>
            <td>
              <strong>Procedure ID:</strong>
            </td>
            <td>{procedureDetails.procedure_id}</td>
          </tr>
          <tr>
            <td>
              <strong>Procedure Name:</strong>
            </td>
            <td>{procedureDetails.procedureName}</td>
          </tr>
          <tr>
            <td>
              <strong>Asset Model:</strong>
            </td>
            <td>{procedureDetails.procedureAssetModel}</td>
          </tr>
          <tr>
            <td>
              <strong>Asset Item:</strong>
            </td>
            <td>{procedureDetails.procedureAssetItem}</td>
          </tr>
          {/* Add more details as needed */}
        </tbody>
      </table>
    </div>
  );
};
// Example of rendering ResponseTypeResponse and objectsStatus in a React component

const renderObjectAsListItems = (obj) => {
  return Object.entries(obj).map(([key, value], index) => (
    <li key={index} className="full-width-li">
      {key}: {value}
    </li>
  ));
};

const ProcedureResponseTable = ({ response }) => {
  return (
    <div className="table-section">
      <table className="table">
        <thead>
          <tr>
            <th>Operation Name</th>
            <th>Action Type</th>
            <th>Response Type Details</th>
            <th>Object Statuses</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {response.map((phase) =>
            phase.operations.map((operation) =>
              operation.actions.map((action, actionIndex) => (
                <tr key={actionIndex}>
                  <td>{operation.operationName}</td>
                  <td>{action.actionType}</td>
                  <td>
                    {/* Check if the response is an object and render accordingly */}
                    {action.response.ResponseTypeResponse.responseType ? (
                      <ul className="full-width-ul">
                        <li className="full-width-li">
                          responseType:{" "}
                          {action.response.ResponseTypeResponse.responseType}
                        </li>
                        {typeof action.response.ResponseTypeResponse
                          .response === "object" ? (
                          renderObjectAsListItems(
                            action.response.ResponseTypeResponse.response
                          )
                        ) : (
                          <li className="full-width-li">
                            response:{" "}
                            {action.response.ResponseTypeResponse.response}
                          </li>
                        )}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {/* Check if objectsStatus is an object and render accordingly */}
                    <ul className="full-width-ul">
                      {renderObjectAsListItems(action.response.objectsStatus)}
                    </ul>
                  </td>
                  <td>{action.response.UserComment}</td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

const EndScreen = ({ procedureDetails, screens, screenResponses, onSend }) => {
  const consolidateResponses = () => {
    // Check if procedureDetails and its Phases exist
    if (!procedureDetails || !procedureDetails.Phases) {
      return {
        procedureId: procedureDetails?.procedure_id || "N/A",

        phases: [],
      };
    }

    const procedureResponse = {
      procedure_id: procedureDetails.procedure_id,
      procedureName: procedureDetails?.name || "N/A",
      procedureAssetModel: procedureDetails?.AssetModel?.model_name || "N/A",
      procedureAssetItem: procedureDetails?.AssetItem?.item_id || "N/A",
      response: procedureDetails.Phases.map((phase) => {
        // Check if phase has Operations
        if (!phase.Operations) {
          return { phaseId: phase.phase_id, operations: [] };
        }

        return {
          phaseId: phase.phase_id,
          operations: phase.Operations.map((operation) => {
            // Check if operation has Actions
            if (!operation.Actions) {
              return {
                operationId: operation.operation_id,

                actions: [],
              };
            }

            return {
              operationId: operation.operation_id,
              operationName: operation.name,
              actions: operation.Actions.map((action) => {
                const screenIndex = screens.findIndex(
                  (screen) =>
                    screen.type === "action" &&
                    screen.object.action_id === action.action_id
                );
                // Handle case where there might not be a corresponding screen response
                const response =
                  screenIndex !== -1 ? screenResponses[screenIndex] : null;
                return {
                  actionId: action.action_id,
                  actionType: action.ActionReference.ActionType.name,
                  actionResponseType: action.ActionReference.ResponseType.type,
                  response: response,
                };
              }),
            };
          }),
        };
      }),
    };

    return procedureResponse;
  };

  const procedureResponse = consolidateResponses();

  console.log("response:", procedureResponse);

  const onSendClick = () => {
    onSend(procedureResponse);
  };

  return (
    <div className="screen">
      <h2>Recapitulatif:</h2>
      <ProcedureDetailsTable procedureDetails={procedureResponse} />
      <ProcedureResponseTable response={procedureResponse.response} />

      <button className="SendButton" onClick={onSendClick}>
        <i className="fas fa-paper-plane"> </i>
        &nbsp; &nbsp; Confirm & Send
      </button>
    </div>
  );
};

export default EndScreen;
