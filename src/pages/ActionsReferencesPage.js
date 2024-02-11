import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS

import React, { useState, useEffect } from "react";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";
import GenericTableFilter from "../components/generic/GenericTableFilter";

const ActionsReferencesPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [objects, setObjects] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [responseTypes, setResponseTypes] = useState([]);
  const [acts, setActs] = useState([]);

  const [formSchema, setFormSchema] = useState([
    {
      label: "Type ID",
      name: "type_id",
      type: "select",
      options: [], // Populate options from /actionType API
      defaultOptionText: "Select a Type",
      required: true,
    },
    {
      label: "Act",
      name: "act_id",
      type: "select",
      options: acts.map((a) => ({
        label: `${a.act_id} - ${a.act}`,
        value: a.act_id,
      })),
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: true,
    },
    {
      label: "Object References",
      name: "object_id",
      type: "select-multiple", // Use the new type for multiple selection
      options: [],
      required: false,
    },
    {
      label: "Response Type",
      name: "response_type_id",
      type: "select",
      options: responseTypes.map((rt) => ({
        label: `${rt.response_type_id} - ${rt.type}`,
        value: rt.response_type_id,
      })),
      required: true,
    },
    {
      label: "Response Label",
      name: "response_label",
      type: "text",
      required: true,
    },
  ]);

  const tableColumns = [
    {
      Header: "Action Reference ID",
      accessor: "action_reference_id",
    },
    {
      Header: "Type",
      accessor: "type_id",
      Cell: ({ value }) => {
        // Find the corresponding action type
        const actionType = actionTypes.find((type) => type.type_id === value);
        // Create the id-name format if the action type exists
        return actionType
          ? `${actionType.type_id}-${actionType.name}`
          : "Unknown";
      },
    },
    {
      Header: "Act",
      accessor: "act_id",
      Cell: ({ value }) => {
        const act = acts.find((a) => a.act_id === value);
        return act ? `${act.act_id} - ${act.act}` : "Unknown";
      },
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Object ID",
      accessor: "object_id",
      Cell: ({ value }) => {
        if (value === null) {
          return "No Object";
        } else if (Array.isArray(value)) {
          // If object_id is an array, render as a list of object names
          const objectNames = value.map((objectId) => {
            const object = objects.find((obj) => obj.object_id === objectId);
            return object
              ? `${object.object_id} - ${object.object_name}`
              : "Unknown";
          });
          return (
            <ul>
              {objectNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          );
        } else {
          // If object_id is a single value, render as a single object name
          const object = objects.find((obj) => obj.object_id === value);
          return object
            ? `${object.object_id} - ${object.object_name}`
            : "Unknown";
        }
      },
    },
    {
      Header: "Response Type",
      accessor: "response_type_id",
      Cell: ({ value }) => {
        const responseType = responseTypes.find(
          (rt) => rt.response_type_id === value
        );
        return responseType
          ? getResponseTypeName(responseType.response_type_id)
          : "Unknown";
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
      Header: "Response Label",
      accessor: "response_label",
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
              onClick={() =>
                handleDeleteClick(row.original.action_reference_id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  const fetchData = () => {
    setIsLoading(true);

    // Fetch data from /actionReferences API
    fetch(`${config.API_BASE_URL}/actionReferences`)
      .then((response) => response.json())
      .then((data) => {
        setItemsData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching action references data:", error);
      });

    // Fetch data from /objects API for populating Object References options
    fetch(`${config.API_BASE_URL}/objects`)
      .then((response) => response.json())
      .then((data) => {
        setObjects(data);
        // Update form schema with object options
        setFormSchema((prevSchema) =>
          prevSchema.map((field) => {
            if (field.name === "object_id") {
              return {
                ...field,
                options: data.map((object) => ({
                  label: `${object.object_id} - ${object.object_code} - ${object.object_name}`,
                  value: object.object_id,
                })),
              };
            }
            return field;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching objects data:", error);
      });

    // Fetch action types and update options for "Type ID" select field
    fetch(`${config.API_BASE_URL}/actionType`)
      .then((response) => response.json())
      .then((actionTypes) => {
        setActionTypes(actionTypes);
        setFormSchema((prevSchema) =>
          prevSchema.map((field) => {
            if (field.name === "type_id") {
              return {
                ...field,
                options: actionTypes.map((actionType) => ({
                  label: `${actionType.type_id} - ${actionType.name}`,
                  value: actionType.type_id,
                })),
              };
            }
            return field;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching action types:", error);
      });

    fetch(`${config.API_BASE_URL}/responseType`)
      .then((response) => response.json())
      .then((data) => {
        setResponseTypes(data);
        // Assuming data includes objects with { response_type_id, name } structure
        const responseTypesOptions = data.map((rt) => ({
          value: rt.response_type_id,
          label: `${rt.response_type_id} - ${rt.type}`,
        }));
        // Update form schema for response type options
        setFormSchema((prevSchema) =>
          prevSchema.map((field) => {
            if (field.name === "response_type_id") {
              return { ...field, options: responseTypesOptions };
            }
            return field;
          })
        );
      })
      .catch((error) => console.error("Error fetching response types:", error));

    fetch(`${config.API_BASE_URL}/act`)
      .then((response) => response.json())
      .then((data) => {
        setActs(data);

        const actsOptions = data.map((a) => ({
          value: a.act_id,
          label: `${a.act_id} - ${a.act}`,
        }));
        // Update form schema for response type options
        setFormSchema((prevSchema) =>
          prevSchema.map((field) => {
            if (field.name === "act_id") {
              return { ...field, options: actsOptions };
            }
            return field;
          })
        );
      })
      .catch((error) => console.error("Error fetching acts:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getResponseTypeName = (responseTypeId) => {
    const responseType = responseTypes.find(
      (type) => type.response_type_id === responseTypeId
    );
    if (responseType) {
      const formattedName = `${responseType.response_type_id} - ${responseType.type}`;
      if (responseType.options && responseType.options.length) {
        return `${formattedName} - Options (${responseType.options.join(
          ", "
        )})`;
      }
      return formattedName;
    } else {
      return "Unknown";
    }
  };

  const handleAddItem = (formData) => {
    // Implement add item functionality here
    const apiUrl = `${config.API_BASE_URL}/actionReferences`;

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
        toastr.success("Action Reference added successfully", "Success");
        setIsAddItemModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding action reference:", error);
        toastr.error("Failed to add action reference", "Error");
      });
  };

  const handleOpenEditModal = (itemData) => {
    setSelectedItemData(itemData);
    setIsEditItemModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedItemData(null);
    setIsEditItemModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    // Convert selected object IDs to an array
    const objectIds = Array.isArray(formData.object_id)
      ? formData.object_id
      : [formData.object_id];

    if (selectedItemData) {
      // Editing item
      handleEditItem({ ...formData, object_id: objectIds });
    } else {
      // Adding item
      handleAddItem({ ...formData, object_id: objectIds });
    }
  };

  const handleEditItem = (formData) => {
    // Implement edit action reference functionality here
    const apiUrl = `${config.API_BASE_URL}/actionReferences/${formData.action_reference_id}`;

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
        toastr.success("Action Reference edited successfully", "Success");
        setIsEditItemModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing Action Reference:", error);
        toastr.error("Failed to edit Action Reference", "Error");
      });
  };

  const handleDeleteClick = (actionReferenceId) => {
    setShowConfirmation(true);
    setItemIdToDelete(actionReferenceId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/actionReferences/${itemIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Action Reference deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting action reference:", error);
        toastr.error("Error deleting action reference", "Error");
        setShowConfirmation(false);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const [filterValues, setFilterValues] = useState({
    type_id: "",
    act_id: "",
    object_id: "",
    response_type_id: "",
  });
  const filterOptions = {
    type_id: actionTypes.map((at) => ({ value: at.type_id, label: at.name })),
    act_id: acts.map((act) => ({ value: act.act_id, label: act.act })),
    object_id: objects.map((obj) => ({
      value: obj.object_id,
      label: obj.object_name,
    })),
    response_type_id: responseTypes.map((rt) => ({
      value: rt.response_type_id,
      label: rt.type,
    })),
  };

  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
  };

  const filteredItemsData = itemsData.filter((item) => {
    for (const key in filterValues) {
      const filterValue = filterValues[key];

      if (filterValue !== "") {
        if (key === "object_id" && Array.isArray(item[key])) {
          const numericFilterValue = parseInt(filterValue, 10);
          if (!item[key].includes(numericFilterValue)) {
            return false;
          }
        } else {
          const itemValue = item[key] ? item[key].toString() : null;
          if (filterValue !== parseInt(itemValue, 10)) {
            return false;
          }
        }
      }
    }
    return true;
  });

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Action References</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddItemModalOpen(true)}
                >
                  Add Action Reference
                </button>
              </div>
            </div>
            <div className="card-body">
              <GenericTableFilter
                columns={[
                  {
                    label: "Type ID",
                    accessor: "type_id",
                    inputType: "select",
                    options: filterOptions.type_id,
                  },
                  {
                    label: "Act",
                    accessor: "act_id",
                    inputType: "select",
                    options: filterOptions.act_id,
                  },
                  {
                    label: "Object ID",
                    accessor: "object_id",
                    inputType: "select",
                    options: filterOptions.object_id,
                  },
                  {
                    label: "Response Type",
                    accessor: "response_type_id",
                    inputType: "select",
                    options: filterOptions.response_type_id,
                  },
                ]}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
              />
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={filteredItemsData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Action Reference Modal */}
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
          message="Are you sure you want to delete this Action Reference?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ActionsReferencesPage;
