import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS

import React, { useState, useEffect } from "react";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const ActionTypesPage = () => {
  const [actionTypesData, setActionTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddActionTypeModalOpen, setIsAddActionTypeModalOpen] =
    useState(false);
  const [isEditActionTypeModalOpen, setIsEditActionTypeModalOpen] =
    useState(false);
  const [selectedActionTypeData, setSelectedActionTypeData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionTypeIdToDelete, setActionTypeIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "type_id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Created At",
      accessor: "created_at",
    },
    {
      Header: "Updated At",
      accessor: "updated_at",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="btn-group">
          <button type="button" className="btn btn-info">
            Action
          </button>
          <button
            type="button"
            className="btn btn-info dropdown-toggle dropdown-icon"
            data-toggle="dropdown"
          >
            <span className="sr-only">Toggle Dropdown</span>
          </button>
          <div className="dropdown-menu" role="menu">
            <button
              className="dropdown-item"
              onClick={() => handleOpenEditModal(row.original)}
            >
              Edit
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleDeleteClick(row.original.type_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  const formSchema = [
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: false,
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/actionType`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setActionTypesData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddActionType = (formData) => {
    // Implement add action type functionality here
    const apiUrl = `${config.API_BASE_URL}/actionType`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setActionTypesData((prevData) => [...prevData, data]);
        toastr.success("Action Type added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddActionTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding action type:", error);
        toastr.error("Failed to add Action Type", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected action type data
  const handleOpenEditModal = (actionTypeData) => {
    setSelectedActionTypeData(actionTypeData);
    setIsEditActionTypeModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedActionTypeData(null);
    setIsEditActionTypeModalOpen(false);
    setIsAddActionTypeModalOpen(false);
  };

  // Handle add/edit action type submission
  const handleFormSubmit = (formData) => {
    if (selectedActionTypeData) {
      // Editing mode
      handleEditActionType(formData);
    } else {
      // Adding mode
      handleAddActionType(formData);
    }
  };

  const handleEditActionType = (formData) => {
    // Implement edit action type functionality here
    const apiUrl = `${config.API_BASE_URL}/actionType/${formData.type_id}`;

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Data successfully edited, you can handle the response data here

        // Optionally, you can update your state with the edited data
        setActionTypesData((prevData) =>
          prevData.map((actionType) =>
            actionType.type_id === formData.type_id ? data : actionType
          )
        );
        toastr.success("Action Type edited successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsEditActionTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing action type:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit Action Type", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (actionTypeId) => {
    // Show the confirmation modal and set the action type ID to delete
    setShowConfirmation(true);
    setActionTypeIdToDelete(actionTypeId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/actionType/${actionTypeIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Action Type deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting action type:", error);
        toastr.error("Error deleting Action Type", "Error");
        setShowConfirmation(false);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Action Types</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddActionTypeModalOpen(true)}
                >
                  Add Action Type
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={actionTypesData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Action Type Modal */}
      {(isAddActionTypeModalOpen || isEditActionTypeModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddActionTypeModalOpen || isEditActionTypeModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedActionTypeData} // Pass the selected action type data to the form
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Action Type?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ActionTypesPage;
