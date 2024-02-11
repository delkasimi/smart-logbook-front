import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const OperationsTypesPage = () => {
  const [operationsTypesData, setOperationsTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOperationTypeModalOpen, setIsAddOperationTypeModalOpen] =
    useState(false);
  const [isEditOperationTypeModalOpen, setIsEditOperationTypeModalOpen] =
    useState(false);
  const [selectedOperationTypeData, setSelectedOperationTypeData] =
    useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [operationTypeIdToDelete, setOperationTypeIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "operation_type_id",
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
              onClick={() => handleDeleteClick(row.original.operation_type_id)}
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
      const response = await fetch(`${config.API_BASE_URL}/operation-types`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOperationsTypesData(data);
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

  const handleAddOperationType = (formData) => {
    // Implement add operation type functionality here
    const apiUrl = `${config.API_BASE_URL}/operation-types`;

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
        setOperationsTypesData((prevData) => [...prevData, data]);
        toastr.success("Operation Type added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddOperationTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding operation type:", error);
        toastr.error("Failed to add Operation Type", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected operation type data
  const handleOpenEditModal = (operationTypeData) => {
    setSelectedOperationTypeData(operationTypeData);
    setIsEditOperationTypeModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedOperationTypeData(null);
    setIsEditOperationTypeModalOpen(false);
    setIsAddOperationTypeModalOpen(false);
  };

  // Handle add/edit operation type submission
  const handleFormSubmit = (formData) => {
    if (selectedOperationTypeData) {
      // Editing mode
      handleEditOperationType(formData);
    } else {
      // Adding mode
      handleAddOperationType(formData);
    }
  };

  const handleEditOperationType = (formData) => {
    // Implement edit operation type functionality here
    const apiUrl = `${config.API_BASE_URL}/operation-types/${formData.operation_type_id}`;

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

        // Optionally, you can update your state with the edited data
        setOperationsTypesData((prevData) =>
          prevData.map((operationType) =>
            operationType.operation_type_id === formData.operation_type_id
              ? data
              : operationType
          )
        );
        toastr.success("Operation Type edited successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsEditOperationTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing operation type:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit Operation Type", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (operationTypeId) => {
    // Show the confirmation modal and set the operation type ID to delete
    setShowConfirmation(true);
    setOperationTypeIdToDelete(operationTypeId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/operation-types/${operationTypeIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Operation Type deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting operation type:", error);
        toastr.error("Error deleting Operation Type", "Error");
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
              <h3 className="card-title">Operation Types</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddOperationTypeModalOpen(true)}
                >
                  Add Operation Type
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
                  data={operationsTypesData}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Operation Type Modal */}
      {(isAddOperationTypeModalOpen || isEditOperationTypeModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddOperationTypeModalOpen || isEditOperationTypeModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedOperationTypeData} // Pass the selected operation type data to the form
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Operation Type?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default OperationsTypesPage;
