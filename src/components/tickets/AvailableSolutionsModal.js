import React, { useEffect, useState } from "react";
//import availableSolutionsData from '../data/availableSolutions.json';
import SolutionDataTable from "./SolutionDataTable";
import config from "../../configuration/config";

const AvailableSolutionsModal = ({
  formData,
  onClose,
  onCreateIssue,
  onSolutionViewDetails,
}) => {
  const [availableSolutions, setAvailableSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true);
      try {
        fetch(`${config.API_BASE_URL}/solution-data/filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            const solutionDataArray = data.map((item) => ({
              ...item.data, // Spread all properties of the item's data object
              solution_id: item.solution_id, // Add the solution_id property
              views: item.views, // Add the views property from the solution object
              usage: item.usage,
              average_rating: item.average_rating,
            }));

            setAvailableSolutions(solutionDataArray);
          })
          .catch((error) => {
            console.error("Error get filtered solutions:", error);
            // Handle any errors
          });
      } catch (error) {
        console.error("Error getting solutions data:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchData();
  }, [formData]);

  const handleViewDetails = (solution) => {
    setSelectedSolution(solution);
    onSolutionViewDetails(solution);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Available Potential Solutions</h3>
        {availableSolutions && availableSolutions[0] && (
          <SolutionDataTable
            tabledata={availableSolutions}
            handleViewDetails={handleViewDetails}
          />
        )}
        <div className="button-container">
          <button className="cancel-button" onClick={onClose}>
            Back
          </button>
          <button className="confirm-button" onClick={onCreateIssue}>
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableSolutionsModal;
