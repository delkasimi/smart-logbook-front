import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const ProceduresTypesPage = () => {
  const [procedureTypesData, setProcedureTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProcedureTypeModalOpen, setIsAddProcedureTypeModalOpen] =
    useState(false);
  const [isEditProcedureTypeModalOpen, setIsEditProcedureTypeModalOpen] =
    useState(false);
  const [selectedProcedureTypeData, setSelectedProcedureTypeData] =
    useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [procedureTypeIdToDelete, setProcedureTypeIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "procedure_type_id",
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
              onClick={() => handleDeleteClick(row.original.procedure_type_id)}
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
      const response = await fetch(`${config.API_BASE_URL}/proceduretype`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProcedureTypesData(data);
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

  const handleAddProcedureType = (formData) => {
    // Implement add procedure type functionality here
    const apiUrl = `${config.API_BASE_URL}/proceduretype`;

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
        setProcedureTypesData((prevData) => [...prevData, data]);
        toastr.success("Procedure Type added successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsAddProcedureTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding procedure type:", error);
        toastr.error("Failed to add Procedure Type", "Error");
        // Handle errors or show error messages to the user
      });
  };

  // Handle opening the edit modal and passing the selected procedure type data
  const handleOpenEditModal = (procedureTypeData) => {
    setSelectedProcedureTypeData(procedureTypeData);
    setIsEditProcedureTypeModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedProcedureTypeData(null);
    setIsEditProcedureTypeModalOpen(false);
    setIsAddProcedureTypeModalOpen(false);
  };

  // Handle add/edit procedure type submission
  const handleFormSubmit = (formData) => {
    if (selectedProcedureTypeData) {
      // Editing mode
      handleEditProcedureType(formData);
    } else {
      // Adding mode
      handleAddProcedureType(formData);
    }
  };

  const handleEditProcedureType = (formData) => {
    // Implement edit procedure type functionality here
    const apiUrl = `${config.API_BASE_URL}/proceduretype/${formData.procedure_type_id}`;

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
        // Optionally, you can update your state with the edited data
        setProcedureTypesData((prevData) =>
          prevData.map((procedureType) =>
            procedureType.procedure_type_id === formData.procedure_type_id
              ? data
              : procedureType
          )
        );
        toastr.success("Procedure Type edited successfully", "Success");
        // Close the modal or perform any other necessary actions
        setIsEditProcedureTypeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing procedure type:", error);
        // Handle errors or show error messages to the user
        toastr.error("Failed to edit Procedure Type", "Error");
      });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (procedureTypeId) => {
    // Show the confirmation modal and set the procedure type ID to delete
    setShowConfirmation(true);
    setProcedureTypeIdToDelete(procedureTypeId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/proceduretype/${procedureTypeIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Procedure Type deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting procedure type:", error);
        toastr.error("Error deleting Procedure Type", "Error");
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
              <h3 className="card-title">Procedure Types</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddProcedureTypeModalOpen(true)}
                >
                  Add Procedure Type
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
                  data={procedureTypesData}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Procedure Type Modal */}
      {(isAddProcedureTypeModalOpen || isEditProcedureTypeModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddProcedureTypeModalOpen || isEditProcedureTypeModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedProcedureTypeData} // Pass the selected procedure type data to the form
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Procedure Type?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ProceduresTypesPage;
