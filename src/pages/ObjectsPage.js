import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS

import React, { useState, useEffect } from "react";
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";
import GenericMediaModal from "../components/generic/GenericMediaModal";
import GenericTableFilter from "../components/generic/GenericTableFilter";

const ObjectsPage = () => {
  const [objectsData, setObjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddObjectModalOpen, setIsAddObjectModalOpen] = useState(false);
  const [isEditObjectModalOpen, setIsEditObjectModalOpen] = useState(false);
  const [selectedObjectData, setSelectedObjectData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [objectIdToDelete, setObjectIdToDelete] = useState(null);
  const [mediaData, setMediaData] = useState({});

  const [selectedImages, setSelectedImages] = useState([]); // Store all images
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the currently displayed image

  const [filterValues, setFilterValues] = useState({
    object_code: "",
    object_name: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/objects`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let objects = await response.json();

      // Initialize an object to hold media data for all objects
      const newMediaData = {};

      // Fetch media for each object and populate newMediaData
      await Promise.all(
        objects.map(async (object) => {
          const mediaResponse = await fetch(
            `${config.API_BASE_URL}/media/object/${object.object_id}`
          );
          if (mediaResponse.ok) {
            const media = await mediaResponse.json();
            newMediaData[object.object_id] = media.map((item) => ({
              mediaId: item.media_id,
              mediaUrl: item.media_url,
              comment: item.comment,
            }));
          }
        })
      );

      setObjectsData(objects);
      setMediaData(newMediaData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddObject = (formData) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `${config.API_BASE_URL}/objects`;

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
          setObjectsData((prevData) => [...prevData, data]);
          toastr.success("Item added successfully", "Success");
          resolve(data.object_id);

          // Close the modal or perform any other necessary actions
          setIsAddObjectModalOpen(false);
        })
        .catch((error) => {
          console.error("Error adding object:", error);
          toastr.error("Failed to add item", "Error");
          reject(error);
          // Handle errors or show error messages to the user
        });
    });
  };

  // Handle opening the edit modal and passing the selected object data
  const handleOpenEditModal = (objectData) => {
    // Retrieve media data for the selected object from the global mediaData state
    const objectMedia = mediaData[objectData.object_id] || [];

    // Format the media data as needed by your form. For example, if your form expects
    // mediaData to be an array of objects with certain properties, ensure to format it accordingly
    const formattedMediaData = objectMedia.map((media) => ({
      mediaId: media.mediaId,
      mediaUrl: media.mediaUrl,
      comment: media.comment,
    }));

    // Include formattedMediaData in initialData
    const initialDataWithMedia = {
      ...objectData,
      mediaData: formattedMediaData, // Add the media data under a property that the form expects
    };

    setSelectedObjectData(initialDataWithMedia);
    setIsEditObjectModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setSelectedObjectData(null);
    setIsEditObjectModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    const { mediaData, ...otherFormData } = formData;

    try {
      let objectId;

      if (selectedObjectData) {
        // Editing mode
        objectId = await handleEditObject(otherFormData);
      } else {
        // Adding mode
        objectId = await handleAddObject(otherFormData);
      }

      if (mediaData && mediaData.length > 0 && objectId) {
        await handleMediaUploadAndCreation(mediaData, objectId);
      }

      fetchData();
    } catch (error) {
      console.error("Error handling form submission:", error);
      // Handle errors
    }
  };

  async function handleMediaUploadAndCreation(
    mediaData,
    associatedId,
    associated_type = "object"
  ) {
    for (const media of mediaData) {
      // Extract file, comment, isDeleted, and isCommentUpdated
      const { mediaId, file, comment, isDeleted, isCommentUpdated } = media;

      if (isDeleted) {
        // If isDeleted is true, call deleteMediaForObject
        await deleteMediaForObject(mediaId);
        continue; // Skip this iteration
      }

      if (!file && !isCommentUpdated) {
        // If neither file nor isCommentUpdated is present, skip this iteration
        console.error("No image file or comment update present");
        continue;
      }

      // Upload the image if file is present
      if (file) {
        const uploadResponse = await uploadImage(file);
        if (uploadResponse && uploadResponse.fileUrl) {
          // Extract the media type from the file
          const mediaType = file.type.split("/")[1]; // Example: 'image/jpeg' to 'jpeg'

          // Create and associate the media
          await createAndAssociateMedia(
            uploadResponse.fileUrl,
            mediaType,
            comment,
            associatedId,
            associated_type
          );
        } else {
          console.error("Failed to upload image:", file.name);
          toastr.error("Error uploading file ", "Error");
          // Optionally handle the error, e.g., by notifying the user
        }
      }

      if (isCommentUpdated) {
        // If isCommentUpdated is true, call updateMediaForObject
        await updateMediaForObject(mediaId, comment);
      }
    }
  }

  // Function to delete media for a specific object by media ID
  async function deleteMediaForObject(mediaId) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/media/${mediaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log(`Media with ID ${mediaId} deleted successfully.`);
      } else {
        console.error(`Failed to delete media with ID ${mediaId}.`);
      }
    } catch (error) {
      console.error(`Error deleting media with ID ${mediaId}:`, error);
    }
  }

  // Function to update the comment for media associated with an object by media ID
  async function updateMediaForObject(mediaId, comment) {
    try {
      const requestBody = {
        comment: comment,
      };

      const response = await fetch(`${config.API_BASE_URL}/media/${mediaId}`, {
        method: "PUT", // Use PATCH method to update the comment
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        console.log(`Media comment for ID ${mediaId} updated successfully.`);
      } else {
        console.error(`Failed to update media comment for ID ${mediaId}.`);
      }
    } catch (error) {
      console.error(`Error updating media comment for ID ${mediaId}:`, error);
    }
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading file:", file);
      const response = await fetch(`${config.API_BASE_URL}/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toastr.success("file uploaded successfully", "Success");
      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  async function createAndAssociateMedia(
    uploadedImageUrl,
    mediaType,
    comment,
    associatedId,
    associated_type = "object"
  ) {
    const payload = {
      associated_id: associatedId,
      associated_type: associated_type,
      media_url: uploadedImageUrl,
      media_type: mediaType,
      comment: comment,
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating media:", error);
      return null;
    }
  }

  const handleEditObject = (formData) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `${config.API_BASE_URL}/objects/${formData.object_id}`;

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
          setObjectsData((prevData) =>
            prevData.map((object) =>
              object.object_id === formData.object_id ? data : object
            )
          );
          toastr.success("Item edited successfully", "Success");
          resolve(data.object_id);
          setIsEditObjectModalOpen(false);
        })
        .catch((error) => {
          console.error("Error editing object:", error);
          // Handle errors or show error messages to the user
          toastr.error("Failed to edit item", "Error");
          reject(error);
        });
    });
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (objectId) => {
    // Show the confirmation modal and set the object ID to delete
    setShowConfirmation(true);
    setObjectIdToDelete(objectId);
  };

  const handleDelete = () => {
    const apiUrl = `${config.API_BASE_URL}/objects/${objectIdToDelete}`;

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
        console.error("Error deleting object:", error);
        toastr.error("Error deleting item", "Error");
        setShowConfirmation(false);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const mediaCellRenderer = ({ row }) => {
    const objectMedia = mediaData[row.values.object_id] || [];
    return objectMedia.length > 0 ? (
      <div className="media-thumbnails">
        {objectMedia.map((media, index) => (
          <div
            key={index}
            className="media-thumbnail"
            onClick={() => {
              setSelectedImages(objectMedia.map((item) => item.mediaUrl)); // Set all images
              setCurrentImageIndex(index); // Set the index of the clicked image
            }}
          >
            <img
              src={media.mediaUrl}
              alt={`Media ${index}`}
              width="50"
              height="50"
            />
            {media.comment && <span>{media.comment}</span>}
          </div>
        ))}
      </div>
    ) : (
      <div>No media available</div>
    );
  };

  const tableColumns = [
    {
      Header: "ID",
      accessor: "object_id",
    },
    {
      Header: "Code",
      accessor: "object_code",
    },
    {
      Header: "Object Name",
      accessor: "object_name",
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
      Header: "Media",
      id: "media",
      Cell: mediaCellRenderer,
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
              onClick={() => handleDeleteClick(row.original.object_id)}
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
      label: "Object Code",
      name: "object_code",
      type: "text",
      required: true,
    },
    {
      label: "Object Name",
      name: "object_name",
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
      label: "Upload Photo",
      name: "upload_photo",
      type: "file", // New field type for file upload
      required: false,
    },
  ];

  const filterOptions = {
    object_code: objectsData.map((obj) => ({
      value: obj.object_code,
      label: obj.object_code,
    })),

    object_name: objectsData.map((obj) => ({
      value: obj.object_name,
      label: obj.object_name,
    })),
  };

  const filteredObjectsData = objectsData.filter((object) => {
    return (
      object.object_code
        .toLowerCase()
        .includes(filterValues.object_code.toLowerCase()) &&
      object.object_name
        .toLowerCase()
        .includes(filterValues.object_name.toLowerCase())
    );
  });

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Objects</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddObjectModalOpen(true)}
                >
                  Add Object
                </button>
              </div>
            </div>
            <div className="card-body">
              <GenericTableFilter
                columns={[
                  {
                    label: "Object Code",
                    accessor: "object_code",
                    inputType: "select",
                    options: filterOptions.object_code,
                  },
                  {
                    label: "Object Name",
                    accessor: "object_name",
                    inputType: "select",
                    options: filterOptions.object_name,
                  },
                ]}
                filterValues={filterValues}
                onFilterChange={(newFilterValues) =>
                  setFilterValues(newFilterValues)
                }
              />

              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable
                  columns={tableColumns}
                  data={filteredObjectsData}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Object Modal */}
      {(isAddObjectModalOpen || isEditObjectModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddObjectModalOpen || isEditObjectModalOpen}
          onClose={() => {
            setSelectedObjectData(null);
            setIsAddObjectModalOpen(false);
            setIsEditObjectModalOpen(false);
          }}
          initialData={selectedObjectData} // Pass the selected object data to the form
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

      {/* Render a modal for displaying the selected image */}
      {/* Render a modal for displaying the selected image */}
      {selectedImages.length > 0 && (
        <GenericMediaModal
          images={selectedImages} // Pass all images
          currentImageIndex={currentImageIndex} // Pass the index of the currently displayed image
          onClose={() => {
            setSelectedImages([]); // Clear all images
            setCurrentImageIndex(0); // Reset the index
          }}
        />
      )}
    </div>
  );
};

export default ObjectsPage;
