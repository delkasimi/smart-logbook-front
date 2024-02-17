import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const IssuesPage = () => {
  const [issueTypesData, setIssueTypesData] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [selectedIssueData, setSelectedIssueData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [targetIssueId, setTargetIssueId] = useState(null);

  const transformDataForTable = (issueTypesData) => {
    let issuesFlatList = [];
    let issuesTypesFlatList = [];
    issueTypesData.forEach((issueType) => {
      issueType.issues.forEach((issue) => {
        issuesFlatList.push({
          issueType: issueType.type,
          code: issue.code,
          label: issue.label,
          issue_type_id: issueType.issue_type_id,
          issue_id: issue.issue_id,
        });
      });
      issuesTypesFlatList.push({
        issueType: issueType.type,
        issue_type_id: issueType.issue_type_id,
      });
    });
    setIssueTypesData(issuesTypesFlatList);
    return issuesFlatList;
  };

  const fetchData = async () => {
    setIsLoading(true);
    fetch(`${config.API_BASE_URL}/issue-types`)
      .then((response) => response.json())
      .then((data) => {
        const transformedData = transformDataForTable(data);
        setIssuesData(transformedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching issue types:", error);
        toastr.error("Failed to load issue types", "Error");
        setIsLoading(false);
      });
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEditIssue = (issueData) => {
    console.log("issueData:", issueData);
    const apiUrl = `${config.API_BASE_URL}/issues/${
      selectedIssueData ? selectedIssueData.issue_id : ""
    }`;
    const method = selectedIssueData ? "PUT" : "POST";

    fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issueData),
    })
      .then((response) => response.json())
      .then((data) => {
        toastr.success(
          `Issue ${selectedIssueData ? "updated" : "added"} successfully`,
          "Success"
        );
        setModalOpen(false);
        fetchData();
      })
      .catch((error) => {
        console.error(
          `Error ${selectedIssueData ? "updating" : "adding"} issue:`,
          error
        );
        toastr.error(
          `Failed to ${selectedIssueData ? "update" : "add"} issue`,
          "Error"
        );
      });
  };

  const handleDeleteIssue = (issueId) => {
    const apiUrl = `${config.API_BASE_URL}/issues/${issueId}`;

    fetch(apiUrl, { method: "DELETE" })
      .then(() => {
        toastr.success("Issue deleted successfully", "Success");
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting issue:", error);
        toastr.error("Failed to delete issue", "Error");
      });
  };

  const handleOpenAddModal = () => {
    setSelectedIssueData(null); // Clear selected issue data for adding
    setModalOpen(true); // Open the form modal
  };

  const handleOpenEditModal = (issue) => {
    setSelectedIssueData(issue);
    console.log("selected issue", issue);
    setModalOpen(true);
  };

  const handleDeleteClick = (issueId) => {
    setShowConfirmationModal(true);
    setTargetIssueId(issueId);
  };

  const deleteIssue = async () => {
    handleDeleteIssue(targetIssueId);
    fetchData();
    setShowConfirmationModal(false);
  };
  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const formSchema = [
    {
      label: "Issue Type",
      name: "issue_type_id",
      type: "select",
      options: issueTypesData.map((type) => ({
        label: type.issueType,
        value: type.issue_type_id,
      })),
      required: true,
    },
    {
      label: "Code",
      name: "code",
      type: "text",
      required: true,
    },
    {
      label: "Label",
      name: "label",
      type: "text",
      required: true,
    },
  ];

  const columns = [
    {
      Header: "ID",
      accessor: "issue_id",
    },
    {
      Header: "Issue Type",
      accessor: "issueType",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Label",
      accessor: "label",
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
              onClick={() => handleDeleteClick(row.original.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Issues Codes</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={handleOpenAddModal}
                >
                  Add Issue
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
                  columns={columns}
                  data={issuesData}
                  // Define other props as needed
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <GenericForm
          formSchema={formSchema}
          initialData={selectedIssueData}
          onSubmit={handleAddEditIssue}
          onClose={() => setModalOpen(false)}
        />
      )}
      {showConfirmationModal && (
        <GenericConfirmation
          message="Are you sure you want to delete this issue?"
          onConfirm={deleteIssue}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default IssuesPage;
