import React from "react";

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
              return { operationId: operation.operation_id, actions: [] };
            }

            return {
              operationId: operation.operation_id,
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

  const onSendClick = () => {
    onSend(procedureResponse);
  };

  return (
    <div className="screen">
      <h2>End</h2>
      <p>Procedure Response:</p>
      <pre>{JSON.stringify(procedureResponse, null, 2)}</pre>
      <button className="SendButton" onClick={onSendClick}>
        <i className="fas fa-paper-plane"> </i>
        &nbsp; &nbsp; Confirm & Send
      </button>
    </div>
  );
};

export default EndScreen;
