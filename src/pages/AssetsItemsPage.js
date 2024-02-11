// AssetsItemsPage.js

import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS

import React, { useState, useEffect, useMemo } from "react";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const AssetsItemsPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [models, setModels] = useState([]);

  const tableColumns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "item_id",
      },
      {
        Header: "Model Name",
        id: "model_name", // Custom ID for the column
        accessor: (item) => {
          // Find the model with the matching model_id
          const model = models.find(
            (model) => model.model_id === item.model_id
          );
          return model ? model.model_name : "Unknown";
        },
      },
      {
        Header: "Item Identifier",
        accessor: "item_identifier",
      },
      {
        Header: "Status",
        accessor: "status",
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
                onClick={() => handleDeleteClick(row.original.item_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ),
      },
    ],
    [models]
  );

  const [formSchema, setFormSchema] = useState([
    {
      label: "Model ID",
      name: "model_id",
      type: "select",
      options: [],
      defaultOptionText: "Select a Model",
      required: true,
    },
    {
      label: "Item ID",
      name: "item_identifier",
      type: "text",
      required: true,
    },
    {
      label: "Status",
      name: "status",
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
      label: "Created At",
      name: "created_at",
      type: "date",
      required: false,
    },
    {
      label: "Updated At",
      name: "updated_at",
      type: "date",
      required: false,
    },
    {
      label: "Comment",
      name: "comment",
      type: "text",
      required: false,
    },
  ]);

  const fetchData = () => {
    // Fetch models data when the component mounts
    setIsLoading(true);
    fetch(`${config.API_BASE_URL}/asset/models`)
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
        // Update form schema with model options
        setFormSchema((prevSchema) =>
          prevSchema.map((field) => {
            if (field.name === "model_id") {
              return {
                ...field,
                options: data.map((model) => ({
                  label: `${model.model_id} - ${model.model_name}`,
                  value: model.model_id,
                })),
              };
            }
            return field;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching models data:", error);
      });

    // Fetch items data (or other data) as needed
    fetch(`${config.API_BASE_URL}/asset/items`)
      .then((response) => response.json())
      .then((data) => {
        // Map models to a dictionary for faster look-up
        const modelsDict = models.reduce((dict, model) => {
          dict[model.model_id] = model.model_name;
          return dict;
        }, {});

        // Add model_name to each item
        const itemsWithData = data.map((item) => ({
          ...item,
          model_name: modelsDict[item.model_id] || "Unknown",
        }));

        setItemsData(itemsWithData);
        setItemsData(data);
      })
      .catch((error) => {
        console.error("Error fetching items data:", error);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    // Call the fetchData method when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures it runs only once

  const handleAddItem = (formData) => {
    // Implement add item functionality here
    const apiUrl = `${config.API_BASE_URL}/asset/items`;

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
        setItemsData((prevData) => [...prevData, data]);
        toastr.success("Item added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddItemModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        toastr.error("Failed to add item", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected item data
  const handleOpenEditModal = (itemData) => {
    setSelectedItemData(itemData);
    setIsEditItemModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedItemData(null);
    setIsEditItemModalOpen(false);
  };

  // Handle add/edit item submission
  const handleFormSubmit = (formData) => {
    if (selectedItemData) {
      // Editing item
      handleEditItem(formData);
    } else {
      // Adding item
      handleAddItem(formData);
    }
  };

  const handleEditItem = (formData) => {
    // Implement edit Item functionality here
    const apiUrl = `${config.API_BASE_URL}/asset/items/${formData.item_id}`;

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
        fetchData();
        toastr.success("Item edited successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsEditItemModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing Item:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit item", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (itemId) => {
    // Show the confirmation modal and set the Item ID to delete
    setShowConfirmation(true);
    setItemIdToDelete(itemId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/asset/items/${itemIdToDelete}`;

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
        console.error("Error deleting item:", error);
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
              <h3 className="card-title">Assets Items</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddItemModalOpen(true)}
                >
                  Add Item
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={itemsData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {(isAddItemModalOpen || isEditItemModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddItemModalOpen || isEditItemModalOpen}
          onClose={() => {
            setSelectedItemData(null);
            setIsAddItemModalOpen(false);
            setIsEditItemModalOpen(false);
          }}
          initialData={selectedItemData} // Pass the selected item data to the form
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

export default AssetsItemsPage;
