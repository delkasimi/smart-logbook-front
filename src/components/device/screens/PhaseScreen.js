import React from "react";

const PhaseScreen = ({ phase }) => {
  return (
    <div className="screen">
      <h2>Phase: {phase.phase_name}</h2>

      {/* Phase Info Section */}
      <div className="section">
        <table className="section-table">
          <tbody>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{phase.description}</td>
            </tr>
            <tr>
              <td>
                <strong>From:</strong>
              </td>
              <td>{phase.from}</td>
            </tr>
            <tr>
              <td>
                <strong>To:</strong>
              </td>
              <td>{phase.to}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Operations Section */}
      {phase.Operations && phase.Operations.length > 0 ? (
        <div className="section" style={{ backgroundColor: "white" }}>
          <h3>Operations</h3>
          <table className="section-table">
            <thead>
              <tr>
                <th>Localization</th>
                <th>Operation Name</th>
                <th>Number of Actions</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {phase.Operations.map((operation) => (
                <tr key={operation.operation_id}>
                  <td>{operation.Localization.name}</td>
                  <td>{operation.name}</td>
                  <td>{operation.Actions.length}</td>
                  <td>
                    <div className="flag-section">
                      {operation.flag === "information" && (
                        <img src="/information.png" alt="Information" />
                      )}
                      {operation.flag === "important" && (
                        <img src="/caution.png" alt="Caution" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="section" style={{ backgroundColor: "#lightgreen" }}>
          <h3>Operations</h3>
          <p>No operations available for this phase.</p>
        </div>
      )}
    </div>
  );
};

export default PhaseScreen;
