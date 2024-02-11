import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  const tableColumns = [
    {
      Header: "Event ID",
      accessor: "event_id",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Event",
      accessor: "event",
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
              onClick={() => handleDeleteClick(row.original.event_id)}
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
      label: "Event",
      name: "event",
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
      const response = await fetch(`${config.API_BASE_URL}/event`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEventsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvent = (formData) => {
    const apiUrl = `${config.API_BASE_URL}/event`;

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
        setEventsData((prevData) => [...prevData, data]);
        toastr.success("Event added successfully", "Success");
        setIsAddEventModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        toastr.error("Failed to add Event", "Error");
      });
  };

  const handleOpenEditModal = (eventData) => {
    setSelectedEventData(eventData);
    setIsEditEventModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedEventData(null);
    setIsEditEventModalOpen(false);
    setIsAddEventModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    if (selectedEventData) {
      handleEditEvent(formData);
    } else {
      handleAddEvent(formData);
    }
  };

  const handleEditEvent = (formData) => {
    const apiUrl = `${config.API_BASE_URL}/event/${formData.event_id}`;

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
        setEventsData((prevData) =>
          prevData.map((event) =>
            event.event_id === formData.event_id ? data : event
          )
        );
        toastr.success("Event edited successfully", "Success");
        setIsEditEventModalOpen(false);
      })
      .catch((error) => {
        console.error("Error editing event:", error);
        toastr.error("Failed to edit Event", "Error");
      });
  };

  const handleDeleteClick = (eventId) => {
    setShowConfirmation(true);
    setEventIdToDelete(eventId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/event/${eventIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Event deleted successfully", "Success");
        fetchData();
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        toastr.error("Error deleting Event", "Error");
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
              <h3 className="card-title">Events</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddEventModalOpen(true)}
                >
                  Add Event
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={eventsData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {(isAddEventModalOpen || isEditEventModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddEventModalOpen || isEditEventModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedEventData}
        />
      )}

      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Event?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default EventsPage;
