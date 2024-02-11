// AssetsModelsPage.js

import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS

import React, { useState, useEffect } from "react";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const AssetsModelsPage = () => {
  const [modelsData, setModelsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  const [isEditModelModalOpen, setIsEditModelModalOpen] = useState(false);
  const [selectedModelData, setSelectedModelData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [modelIdToDelete, setModelIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "model_id",
    },
    {
      Header: "Model Name",
      accessor: "model_name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Attributes",
      accessor: "attributes",
      Cell: ({ value }) => {
        // Custom rendering for attributes
        return (
          <ul>
            {value !== null &&
              Object.entries(value).map(([key, val]) => (
                <li key={key}>
                  <strong>{key}:</strong> {val}
                </li>
              ))}
          </ul>
        );
      },
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
      Header: "Comment",
      accessor: "comment",
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
              onClick={() => handleDeleteClick(row.original.model_id)}
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
      label: "Model Name",
      name: "model_name",
      type: "text",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: false,
    },
    {
      label: "Attributes",
      name: "attributes",
      type: "object",
      required: false,
    },
    {
      label: "Comment",
      name: "comment",
      type: "text",
      required: false,
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/asset/models`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setModelsData(data);
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

  const handleAddModel = (formData) => {
    // Implement add model functionality here
    const apiUrl = `${config.API_BASE_URL}/asset/models`;

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
        setModelsData((prevData) => [...prevData, data]);
        toastr.success("Item added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddModelModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding model:", error);
        toastr.error("Failed to add item", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected model data
  const handleOpenEditModal = (modelData) => {
    setSelectedModelData(modelData);
    setIsEditModelModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedModelData(null);
    setIsEditModelModalOpen(false);
  };

  // Handle add/edit model submission
  const handleFormSubmit = (formData) => {
    if (selectedModelData) {
      // Editing mode
      handleEditModel(formData);
    } else {
      // Adding mode
      handleAddModel(formData);
    }
  };

  const handleEditModel = (formData) => {
    // Implement edit model functionality here
    const apiUrl = `${config.API_BASE_URL}/asset/models/${formData.model_id}`;

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
        setModelsData((prevData) =>
          prevData.map((model) =>
            model.model_id === formData.model_id ? data : model
          )
        );
        toastr.success("Item edited successfully", "Success");

        // Close the modal or perform any other necessary actions
        setIsEditModelModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing model:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit item", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (modelId) => {
    // Show the confirmation modal and set the model ID to delete
    setShowConfirmation(true);
    setModelIdToDelete(modelId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/asset/models/${modelIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Item deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting model:", error);
        toastr.error("error deleting item", "Error");
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
              <h3 className="card-title">Assets Models</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddModelModalOpen(true)}
                >
                  Add Model
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={modelsData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Model Modal */}
      {(isAddModelModalOpen || isEditModelModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddModelModalOpen || isEditModelModalOpen}
          onClose={() => {
            setSelectedModelData(null);
            setIsAddModelModalOpen(false);
            setIsEditModelModalOpen(false);
          }}
          initialData={selectedModelData} // Pass the selected model data to the form
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this item?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default AssetsModelsPage;
