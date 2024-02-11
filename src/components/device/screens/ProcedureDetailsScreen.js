import React from "react";

const ProcedureDetailsScreen = ({ procedureDetails }) => {
  if (!procedureDetails) {
    // Loading state
    return <div>Loading Procedure Details...</div>;
  }

  return (
    <div className="screen">
      {/* Procedure Infos Section */}
      <h4 style={{ textAlign: "center" }}>Procedure Infos</h4>
      <div className="section">
        <table className="section-table">
          <tbody>
            <tr>
              <td>
                <strong>Name:</strong>
              </td>
              <td>{procedureDetails.name}</td>
            </tr>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{procedureDetails.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Procedure Type:</strong>
              </td>
              <td>{procedureDetails.ProcedureType.name}</td>
            </tr>
            <tr>
              <td>
                <strong>Type description:</strong>
              </td>
              <td>{procedureDetails.ProcedureType.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Version:</strong>
              </td>
              <td>{procedureDetails.version}</td>
            </tr>
            <tr>
              <td>
                <strong>Status:</strong>
              </td>
              <td>{procedureDetails.status}</td>
            </tr>
            <tr>
              <td>
                <strong>From:</strong>
              </td>
              <td>{procedureDetails.from}</td>
            </tr>
            <tr>
              <td>
                <strong>To:</strong>
              </td>
              <td>{procedureDetails.to}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Event Section */}
      <div className="section">
        <table className="section-table">
          <tbody>
            <tr>
              <td>
                <strong>Event Type:</strong>
              </td>
              <td>{procedureDetails.Event.type}</td>
            </tr>
            <tr>
              <td>
                <strong>Event:</strong>
              </td>
              <td>{procedureDetails.Event.event}</td>
            </tr>
            <tr>
              <td>
                <strong>Event Description:</strong>
              </td>
              <td>{procedureDetails.Event.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Asset Section */}
      <div className="section">
        <table className="section-table">
          <tbody>
            <tr>
              <td>
                <strong>Model Name:</strong>
              </td>
              <td>{procedureDetails.AssetModel.model_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Model Description:</strong>
              </td>
              <td>{procedureDetails.AssetModel.description}</td>
            </tr>

            <tr>
              <td>
                <strong>Item Identifier:</strong>
              </td>
              <td>{procedureDetails.AssetItem.item_identifier}</td>
            </tr>
            <tr>
              <td>
                <strong>Status:</strong>
              </td>
              <td>{procedureDetails.AssetItem.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcedureDetailsScreen;
