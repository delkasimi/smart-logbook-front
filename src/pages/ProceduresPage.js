import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";
import ProcedureDetailsModal from "../components/procedures/ProcedureDetailsModal";
import GenericTableFilter from "../components/generic/GenericTableFilter";

const ProceduresPage = () => {
  const [proceduresData, setProceduresData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const [isEditProcedureModalOpen, setIsEditProcedureModalOpen] =
    useState(false);
  const [selectedProcedureData, setSelectedProcedureData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [procedureIdToDelete, setProcedureIdToDelete] = useState(null);

  const [procedureTypesOptions, setProcedureTypesOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [assetModelOptions, setAssetModelOptions] = useState([]);
  const [assetItemOptions, setAssetItemOptions] = useState([]);

  const [isProcedureDetailsModalOpen, setIsProcedureDetailsModalOpen] =
    useState(false);
  const [selectedProcedureForDetails, setSelectedProcedureForDetails] =
    useState(null);

  const [nameOptions, setNameOptions] = useState([]); // Options for the "Name" filter
  const [statusOptions, setStatusOptions] = useState([]); // Options for the "Status" filter
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const procedureResponse = await fetch(`${config.API_BASE_URL}/procedure`);

      if (!procedureResponse.ok) {
        throw new Error(`HTTP error!`);
      }

      const procedureData = await procedureResponse.json();
      setProceduresData(procedureData);

      const uniqueNames = [
        ...new Set(procedureData.map((procedure) => procedure.name)),
      ];
      const nameFilterOptions = uniqueNames.map((name) => ({
        value: name,
        label: name,
      }));
      setNameOptions(nameFilterOptions);

      // Create options for the "Status" filter column
      const uniqueStatuses = [
        ...new Set(procedureData.map((procedure) => procedure.status)),
      ];
      const statusFilterOptions = uniqueStatuses.map((status) => ({
        value: status,
        label: status,
      }));
      setStatusOptions(statusFilterOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Fetch Procedure Types
    fetch(`${config.API_BASE_URL}/proceduretype`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.procedure_type_id,
          label: `${item.procedure_type_id} - ${item.name}`,
        }));
        setProcedureTypesOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching procedure types:", error);
      });

    // Fetch Event Options
    fetch(`${config.API_BASE_URL}/event`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.event_id,
          label: `${item.event_id} - ${item.type} - ${item.event}`,
        }));
        setEventOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching event options:", error);
      });

    // Fetch Asset Model Options
    fetch(`${config.API_BASE_URL}/asset/models`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.model_id,
          label: `${item.model_id} - ${item.model_name}`,
        }));
        setAssetModelOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching asset model options:", error);
      });

    // Fetch Asset Item Options
    fetch(`${config.API_BASE_URL}/asset/items`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => {
          const assetModelOption = assetModelOptions.find(
            (modelOption) => modelOption.value === item.model_id
          );
          const assetModelLabel = assetModelOption || { label: "" };
          return {
            value: item.item_id,
            label: `${item.item_id}-${assetModelLabel.label} - ${item.item_identifier}`,
          };
        });
        setAssetItemOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching asset item options:", error);
      });

    fetchData();
    setIsLoading(false);
  }, []);

  const handleAddProcedure = (formData) => {
    const apiUrl = `${config.API_BASE_URL}/procedure`;

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
        setProceduresData((prevData) => [...prevData, data]);
        toastr.success("Procedure added successfully", "Success");
        setIsAddProcedureModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding procedure:", error);
        toastr.error("Failed to add Procedure", "Error");
      });
  };

  const handleOpenEditModal = (procedureData) => {
    setSelectedProcedureData(procedureData);
    setIsEditProcedureModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProcedureData(null);
    setIsEditProcedureModalOpen(false);
    setIsAddProcedureModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    if (selectedProcedureData) {
      handleEditProcedure(formData);
    } else {
      handleAddProcedure(formData);
    }
  };

  const handleEditProcedure = (formData) => {
    const apiUrl = `${config.API_BASE_URL}/procedure/${formData.procedure_id}`;

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
        setProceduresData((prevData) =>
          prevData.map((procedure) =>
            procedure.procedure_id === formData.procedure_id ? data : procedure
          )
        );
        toastr.success("Procedure edited successfully", "Success");
        setIsEditProcedureModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing procedure:", error);
        toastr.error("Failed to edit Procedure", "Error");
      });
  };

  const handleDeleteClick = (procedureId) => {
    setShowConfirmation(true);
    setProcedureIdToDelete(procedureId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/procedure/${procedureIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Procedure deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting procedure:", error);
        toastr.error("Error deleting Procedure", "Error");
        setShowConfirmation(false);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleOpenDetailsModal = (procedureData) => {
    const procedureId = procedureData.procedure_id;
    navigate(`/proceduredetails/${procedureId}`);
  };

  const redirectToProcedureDetails = (row) => {
    if (row && row.procedure_id) {
      const procedureId = row.procedure_id;
      navigate(`/proceduredetails/${procedureId}`, {
        state: {
          procedureTypesOptions,
          eventOptions,
          assetModelOptions,
          assetItemOptions,
        },
      });
    }
  };

  const tableColumns = [
    {
      Header: "Procedure ID",
      accessor: "procedure_id",
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
      Header: "Procedure Type",
      accessor: "procedure_type_id",
      Cell: ({ row }) => {
        const procedureTypeOption = procedureTypesOptions.find(
          (option) => option.value === row.original.procedure_type_id
        );
        return procedureTypeOption ? procedureTypeOption.label : "N/A";
      },
    },
    {
      Header: "Event Name",
      accessor: "event_id",
      Cell: ({ row }) => {
        const eventOption = eventOptions.find(
          (option) => option.value === row.original.event_id
        );
        return eventOption ? eventOption.label : "N/A";
      },
    },
    {
      Header: "Asset Model",
      accessor: "asset_model_id",
      Cell: ({ row }) => {
        const assetModelOption = assetModelOptions.find(
          (option) => option.value === row.original.asset_model_id
        );
        return assetModelOption ? assetModelOption.label : "N/A";
      },
    },
    {
      Header: "Asset Item",
      accessor: "asset_item_id",
      Cell: ({ row }) => {
        const assetItemOption = assetItemOptions.find(
          (option) => option.value === row.original.asset_item_id
        );
        return assetItemOption ? assetItemOption.label : "N/A";
      },
    },
    {
      Header: "Version",
      accessor: "version",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "From",
      accessor: "from",
    },
    {
      Header: "To",
      accessor: "to",
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
              onClick={() => handleDeleteClick(row.original.procedure_id)}
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
      required: true,
    },
    {
      label: "Procedure Type",
      name: "procedure_type_id",
      type: "select",
      required: true,
      options: procedureTypesOptions,
    },
    {
      label: "Version",
      name: "version",
      type: "text",
      required: false,
    },
    {
      label: "Status",
      name: "status",
      type: "text",
      required: false,
    },
    {
      label: "Event ID",
      name: "event_id",
      type: "select",
      required: false,
      options: eventOptions,
    },
    {
      label: "From",
      name: "from",
      type: "date",
      required: false,
    },
    {
      label: "To",
      name: "to",
      type: "date",
      required: false,
    },
    {
      label: "Asset Model Id",
      name: "asset_model_id",
      type: "select",
      required: false,
      options: assetModelOptions,
    },
    {
      label: "Asset Item Id",
      name: "asset_item_id",
      type: "select",
      required: false,
      options: assetItemOptions,
    },
  ];

  const filterColumns = [
    {
      label: "Name",
      accessor: "name",
      inputType: "select",
      options: nameOptions,
    },
    {
      label: "Type",
      accessor: "procedure_type_id",
      inputType: "select",
      options: procedureTypesOptions,
    },
    {
      label: "Event",
      accessor: "event_id",
      inputType: "select",
      options: eventOptions,
    },
    {
      label: "Asset Model",
      accessor: "asset_model_id",
      inputType: "select",
      options: assetModelOptions,
    },
    {
      label: "Asset Item",
      accessor: "asset_item_id",
      inputType: "select",
      options: assetItemOptions,
    },
    {
      label: "Status",
      accessor: "status",
      inputType: "select",
      options: statusOptions,
    },
  ];

  const initialFilterValues = filterColumns.reduce((acc, column) => {
    acc[column.accessor] = "";
    return acc;
  }, {});

  const [filterValues, setFilterValues] = useState(initialFilterValues);

  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
  };

  // Filter the data based on filterValues
  // Filter the data based on filterValues
  const filteredData = proceduresData.filter((procedure) => {
    for (const key in filterValues) {
      const filterValue = filterValues[key];
      const columnDefinition = filterColumns.find(
        (column) => column.accessor === key
      );

      if (filterValue !== "") {
        // Handle filtering for select options
        if (columnDefinition && columnDefinition.inputType === "select") {
          const procedureValue = procedure[key]
            ? procedure[key].toString()
            : null;
          const numericFilterValue = parseInt(procedureValue, 10);
          if (numericFilterValue) {
            if (filterValue !== numericFilterValue) {
              return false;
            }
            if (filterValue == numericFilterValue) {
              return true;
            }
          } else {
            if (filterValue !== procedureValue) {
              return false;
            }
          }
        } else {
          // Handle filtering for text inputs
          const procedureValue = procedure[key]
            ? procedure[key].toString().toLowerCase()
            : null;
          if (
            !procedureValue ||
            !procedureValue.includes(filterValue.toLowerCase())
          ) {
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
              <h3 className="card-title">
                Procedures{" "}
                <span style={{ fontSize: "smaller", color: "blue" }}>
                  (click on a procedure to access details)
                </span>
              </h3>

              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddProcedureModalOpen(true)}
                >
                  Add Procedure
                </button>
              </div>
            </div>
            <div className="card-body">
              <GenericTableFilter
                onFilterChange={handleFilterChange}
                columns={filterColumns}
                filterValues={filterValues}
              />
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable
                  columns={tableColumns}
                  data={filteredData}
                  isRowClickable={true}
                  onRowClick={(row) => {
                    redirectToProcedureDetails(row);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {(isAddProcedureModalOpen || isEditProcedureModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddProcedureModalOpen || isEditProcedureModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedProcedureData}
        />
      )}

      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Procedure?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {isProcedureDetailsModalOpen && (
        <ProcedureDetailsModal
          onClose={() => setIsProcedureDetailsModalOpen(false)}
          procedureData={selectedProcedureForDetails}
          tablecolumns={tableColumns}
        />
      )}
    </div>
  );
};

export default ProceduresPage;
