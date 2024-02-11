import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const ResponsesTypesPage = () => {
  const [responsesTypesData, setResponsesTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddResponseTypeModalOpen, setIsAddResponseTypeModalOpen] =
    useState(false);
  const [isEditResponseTypeModalOpen, setIsEditResponseTypeModalOpen] =
    useState(false);
  const [selectedResponseTypeData, setSelectedResponseTypeData] =
    useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [responseTypeIdToDelete, setResponseTypeIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "response_type_id",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Options",
      accessor: "options",
      Cell: ({ cell: { value } }) => value.join(", "),
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
              onClick={() => handleDeleteClick(row.original.response_type_id)}
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
      label: "Type",
      name: "type",
      type: "text",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: true,
    },
    {
      label: "Options",
      name: "options",
      type: "array",
      required: true,
      placeholder: "Enter an option",
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/responseType`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResponsesTypesData(data);
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

  const handleAddResponseType = (formData) => {
    // Implement add response type functionality here
    const apiUrl = `${config.API_BASE_URL}/responseType`;

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
        setResponsesTypesData((prevData) => [...prevData, data]);
        toastr.success("Response Type added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddResponseTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding response type:", error);
        toastr.error("Failed to add Response Type", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected response type data
  const handleOpenEditModal = (responseTypeData) => {
    setSelectedResponseTypeData(responseTypeData);
    setIsEditResponseTypeModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedResponseTypeData(null);
    setIsEditResponseTypeModalOpen(false);
    setIsAddResponseTypeModalOpen(false);
  };

  // Handle add/edit response type submission
  const handleFormSubmit = (formData) => {
    console.log("submit data:", formData);
    if (selectedResponseTypeData) {
      // Editing mode
      handleEditResponseType(formData);
    } else {
      // Adding mode
      handleAddResponseType(formData);
    }
  };

  const handleEditResponseType = (formData) => {
    // Implement edit response type functionality here
    const apiUrl = `${config.API_BASE_URL}/responseType/${formData.response_type_id}`;

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Data successfully edited, you can handle the response data here
        console.log("Response Type edited successfully:", data);

        // Optionally, you can update your state with the edited data
        setResponsesTypesData((prevData) =>
          prevData.map((responseType) =>
            responseType.response_type_id === formData.response_type_id
              ? data
              : responseType
          )
        );
        toastr.success("Response Type edited successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsEditResponseTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing response type:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit Response Type", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (responseTypeId) => {
    // Show the confirmation modal and set the response type ID to delete
    setShowConfirmation(true);
    setResponseTypeIdToDelete(responseTypeId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/responseType/${responseTypeIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Response Type deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting response type:", error);
        toastr.error("Error deleting Response Type", "Error");
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
              <h3 className="card-title">Response Types</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddResponseTypeModalOpen(true)}
                >
                  Add Response Type
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable
                  columns={tableColumns}
                  data={responsesTypesData}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Response Type Modal */}
      {(isAddResponseTypeModalOpen || isEditResponseTypeModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddResponseTypeModalOpen || isEditResponseTypeModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedResponseTypeData} // Pass the selected response type data to the form
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Response Type?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ResponsesTypesPage;
