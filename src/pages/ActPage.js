import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const ActPage = () => {
  const [actData, setActData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "ID",
      accessor: "act_id",
    },
    {
      Header: "Act",
      accessor: "act",
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
              onClick={() => handleDeleteClick(row.original.act_id)}
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
      label: "Act",
      name: "act",
      type: "text",
      required: true,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/act`);
      const data = await response.json();
      setActData(data);
    } catch (error) {
      toastr.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (selectedData) {
      // Edit
      await updateAct(formData);
    } else {
      // Add
      await addAct(formData);
    }
  };

  const addAct = async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/act`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add act");
      fetchData();
      toastr.success("Act added successfully");
      setIsAddModalOpen(false);
    } catch (error) {
      toastr.error("Failed to add act");
      console.error("Add act error:", error);
    }
  };

  const updateAct = async (formData) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/act/${selectedData.act_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to update act");
      fetchData();
      toastr.success("Act updated successfully");
      setIsEditModalOpen(false);
      setSelectedData(null);
    } catch (error) {
      toastr.error("Failed to update act");
      console.error("Update act error:", error);
    }
  };

  const handleOpenEditModal = (data) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (ID) => {
    setShowConfirmation(true);
    setIdToDelete(ID);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/act/${idToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete act");
      fetchData();
      setShowConfirmation(false);
      toastr.success("Act deleted successfully");
    } catch (error) {
      toastr.error("Failed to delete act");
      console.error("Delete act error:", error);
    }
  };

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Acts</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Act
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
                  data={actData}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {(isAddModalOpen || isEditModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          initialData={selectedData}
          isOpen={isAddModalOpen || isEditModalOpen}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedData(null);
          }}
        />
      )}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this act?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ActPage;
