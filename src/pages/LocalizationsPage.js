import React, { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import the Toastr CSS
import config from "../configuration/config";
import GenericTable from "../components/generic/GenericTable";
import GenericForm from "../components/generic/GenericForm";
import GenericConfirmation from "../components/generic/GenericConfirmation";
import ImageGridModal from "../components/generic/ImageGridModal";
import ImageMarkerModal from "../components/generic/ImageMarkerModal";

const LocalizationsPage = () => {
  const [localizationsData, setLocalizationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLocalizationModalOpen, setIsAddLocalizationModalOpen] =
    useState(false);
  const [isEditLocalizationModalOpen, setIsEditLocalizationModalOpen] =
    useState(false);
  const [selectedLocalizationData, setSelectedLocalizationData] =
    useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [localizationIdToDelete, setLocalizationIdToDelete] = useState(null);
  const [mediaData, setMediaData] = useState({});

  const [selectedImages, setSelectedImages] = useState([]); // Store all images
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the currently displayed image

  const [isImageGridModalOpen, setIsImageGridModalOpen] = useState(false);
  const [isImageMarkerModalOpen, setIsImageMarkerModalOpen] = useState(false);
  const [selectedImageToMark, setSelectedImageToMark] = useState(null);
  const [selectedLocalizationIdToMark, setSelectedLocalizationIdToMark] =
    useState(null);
  const [selectedLocalizationIdToMarkX, setSelectedLocalizationIdToMarkX] =
    useState(null);
  const [selectedLocalizationIdToMarkY, setSelectedLocalizationIdToMarkY] =
    useState(null);
  const [localizationsMedia, setLocalizationsMedia] = useState([]);

  const fetchLocalizationMedia = async () => {
    try {
      // Fetching the media data from the API
      const response = await fetch(`${config.API_BASE_URL}/media`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Filtering the media items for type 'localization'
      const localizationMedia = data.filter(
        (item) => item.associated_type === "localization"
      );

      setLocalizationsMedia(localizationMedia);
    } catch (error) {
      console.error("There was an error fetching the media data: ", error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/localizations`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let localizations = await response.json();

      const newMediaData = {};

      // Fetch media for each object and populate newMediaData
      await Promise.all(
        localizations.map(async (localization) => {
          const mediaResponse = await fetch(
            `${config.API_BASE_URL}/media/localization/${localization.localization_id}`
          );
          if (mediaResponse.ok) {
            const media = await mediaResponse.json();
            newMediaData[localization.localization_id] = media.map((item) => ({
              mediaId: item.media_id,
              mediaUrl: item.media_url,
              comment: item.comment,
            }));
          }
        })
      );

      setLocalizationsData(localizations);
      setMediaData(newMediaData);
      fetchLocalizationMedia();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mediaCellRenderer = ({ row }) => {
    const localizationMedia = mediaData[row.values.localization_id] || [];
    return localizationMedia.length > 0 ? (
      <div className="media-thumbnails">
        {localizationMedia.map((media, index) => (
          <div
            key={index}
            className="media-thumbnail"
            onClick={() => {
              setSelectedImages(localizationMedia.map((item) => item.mediaUrl)); // Set all images
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
      Header: "Localization ID",
      accessor: "localization_id",
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
            {row.original.media_id && (
              <button
                className="dropdown-item"
                onClick={() => handleCheckMarkOnImageClick(row.original)}
              >
                Check On Image
              </button>
            )}

            <button
              className="dropdown-item"
              onClick={() => handleMarkOnImageClick(row.original)}
            >
              Mark On Image
            </button>
            <button
              className="dropdown-item"
              onClick={() =>
                handleDeleteLocalizationClick(row.original.localization_id)
              }
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
    {
      label: "Upload Photo",
      name: "upload_photo",
      type: "file", // New field type for file upload
      required: false,
    },
  ];

  const handleOpenEditModal = (localizationData) => {
    const localizationMedia = mediaData[localizationData.localization_id] || [];

    const formattedMediaData = localizationMedia.map((media) => ({
      mediaId: media.mediaId,
      mediaUrl: media.mediaUrl,
      comment: media.comment,
    }));

    const initialDataWithMedia = {
      ...localizationData,
      mediaData: formattedMediaData,
    };

    setSelectedLocalizationData(initialDataWithMedia);
    setIsEditLocalizationModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedLocalizationData(null);
    setIsEditLocalizationModalOpen(false);
    setIsAddLocalizationModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    const { mediaData, ...otherFormData } = formData;

    try {
      let localizationId;

      if (selectedLocalizationData) {
        // Editing mode
        localizationId = await handleEditLocalization(otherFormData);
      } else {
        // Adding mode
        localizationId = await handleAddLocalization(otherFormData);
      }

      if (mediaData && mediaData.length > 0 && localizationId) {
        await handleMediaUploadAndCreation(mediaData, localizationId);
      }

      fetchData();
    } catch (error) {
      console.error("Error handling form submission:", error);
      // Handle errors
    }
  };

  const handleAddLocalization = (formData) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `${config.API_BASE_URL}/localizations`;

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
          setLocalizationsData((prevData) => [...prevData, data]);
          toastr.success("Localization added successfully", "Success");
          setIsAddLocalizationModalOpen(false);
          resolve(data.localization_id);
        })
        .catch((error) => {
          console.error("Error adding localization:", error);
          toastr.error("Failed to add Localization", "Error");
          reject(error);
        });
    });
  };

  const handleEditLocalization = (formData) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `${config.API_BASE_URL}/localizations/${formData.localization_id}`;

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
          setLocalizationsData((prevData) =>
            prevData.map((localization) =>
              localization.localization_id === formData.localization_id
                ? data
                : localization
            )
          );
          toastr.success("Localization edited successfully", "Success");
          setIsEditLocalizationModalOpen(false);
          resolve(data.localization_id);
        })
        .catch((error) => {
          console.error("Error editing localization:", error);
          toastr.error("Failed to edit Localization", "Error");
          reject(error);
        });
    });
  };

  const handleDeleteLocalizationClick = (localizationId) => {
    setShowConfirmation(true);
    setLocalizationIdToDelete(localizationId);
  };

  const handleDeleteLocalization = () => {
    const apiUrl = `${config.API_BASE_URL}/localizations/${localizationIdToDelete}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toastr.success("Localization deleted successfully", "Success");
        fetchData(); // Refresh data after deletion
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting localization:", error);
        toastr.error("Error deleting Localization", "Error");
        setShowConfirmation(false);
      });
  };

  const handleCancelDeleteLocalization = () => {
    setShowConfirmation(false);
  };

  async function handleMediaUploadAndCreation(
    mediaData,
    associatedId,
    associated_type = "localization"
  ) {
    for (const media of mediaData) {
      console.log("start loop creating media");
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
          console.log("start loop creating media");
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
    associated_type = "localization"
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

  //image grid and marker features

  const handleCheckMarkOnImageClick = (localization) => {
    const foundMedia = localizationsMedia.find(
      (media) => media.media_id === localization.media_id
    );

    if (foundMedia) {
      console.log("Found media:", foundMedia);
      setSelectedImageToMark(foundMedia);
      setSelectedLocalizationIdToMark(localization.localization_id);
      setSelectedLocalizationIdToMarkX(localization.x_coordinate);
      setSelectedLocalizationIdToMarkY(localization.y_coordinate);
      setIsImageMarkerModalOpen(true);
    } else {
      console.log("Media not found");
    }
  };

  const handleMarkOnImageClick = (localization) => {
    setSelectedLocalizationIdToMark(localization.localization_id);
    setSelectedLocalizationIdToMarkX(localization.x_coordinate);
    setSelectedLocalizationIdToMarkY(localization.y_coordinate);
    setIsImageGridModalOpen(true);
  };

  const onSelectImage = (image) => {
    setSelectedImageToMark(image);

    setIsImageMarkerModalOpen(true);
    setIsImageGridModalOpen(false);
  };

  const onSelectCoordinate = (coordinate) => {
    updateCoordinate(coordinate, selectedLocalizationIdToMark);

    setIsImageMarkerModalOpen(false);
    setSelectedLocalizationIdToMark(null);
  };

  const handleCloseImageGridModal = () => {
    setIsImageGridModalOpen(false);
    setSelectedLocalizationIdToMark(null);
  };

  const handleCloseImageMarkerModal = () => {
    setIsImageMarkerModalOpen(false);
    setIsImageGridModalOpen(false);
    setSelectedLocalizationIdToMark(null);
    setSelectedImageToMark(null);
  };

  const updateCoordinate = async (coordinate, localization_id) => {
    const url = `${config.API_BASE_URL}/localizations/${localization_id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x_coordinate: coordinate.x,
          y_coordinate: coordinate.y,
          media_id: selectedImageToMark.media_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Success:", data);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Localizations</h3>
              <div className="card-tools">
                <button
                  className="btn btn-block btn-success float-right"
                  onClick={() => setIsAddLocalizationModalOpen(true)}
                >
                  Add Localization
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loader-overlay">
                  <div className="loader"></div>
                </div>
              ) : (
                <GenericTable columns={tableColumns} data={localizationsData} />
              )}
            </div>
          </div>
        </div>
      </div>
      {(isAddLocalizationModalOpen || isEditLocalizationModalOpen) && (
        <GenericForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          isOpen={isAddLocalizationModalOpen || isEditLocalizationModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedLocalizationData}
        />
      )}
      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this Localization?"
          onConfirm={handleDeleteLocalization}
          onCancel={handleCancelDeleteLocalization}
        />
      )}
      {isImageGridModalOpen && (
        <ImageGridModal
          images={localizationsMedia}
          onSelectImage={onSelectImage}
          onClose={handleCloseImageGridModal}
        />
      )}

      {isImageMarkerModalOpen && (
        <ImageMarkerModal
          imageUrl={selectedImageToMark.media_url}
          onSelectCoordinate={onSelectCoordinate}
          onClose={handleCloseImageMarkerModal}
          initialMarkerPosition={{
            x: selectedLocalizationIdToMarkX,
            y: selectedLocalizationIdToMarkY,
          }}
        />
      )}
    </div>
  );
};

export default LocalizationsPage;
