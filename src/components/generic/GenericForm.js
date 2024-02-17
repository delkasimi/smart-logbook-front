import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import the Select component

const KeyValuePairs = ({ name, onChange, value }) => {
  // Initialize the pairs state from the value prop
  const [pairs, setPairs] = useState(() =>
    Object.entries(value || {}).map(([key, value]) => ({ key, value }))
  );

  const handlePairChange = (index, element, val) => {
    setPairs((currentPairs) => {
      const newPairs = [...currentPairs];
      newPairs[index] = { ...newPairs[index], [element]: val }; // Update the specified element (key or value)

      const updatedValue = newPairs.reduce((acc, pair) => {
        if (pair.key) {
          acc[pair.key] = pair.value;
        }
        return acc;
      }, {});

      onChange(name, updatedValue); // Send the updated value to the parent as a JSON object
      return newPairs;
    });
  };

  const addPair = () => {
    setPairs((currentPairs) => [...currentPairs, { key: "", value: "" }]);
  };

  const removePair = (index) => {
    setPairs((currentPairs) => currentPairs.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      {pairs.map((pair, index) => (
        <div key={index} className="pair-container">
          <input
            type="text"
            placeholder={pair.key ? "" : "Key"} // Display placeholder when empty
            className="key-input"
            value={pair.key || ""}
            onChange={(e) => handlePairChange(index, "key", e.target.value)}
          />
          <input
            type="text"
            placeholder={pair.value ? "" : "Value"} // Display placeholder when empty
            className="value-input"
            value={pair.value || ""}
            onChange={(e) => handlePairChange(index, "value", e.target.value)}
          />
          <button
            type="button"
            className="form-remove-button"
            onClick={() => removePair(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="form-add-button" onClick={addPair}>
        Add Pair
      </button>
    </div>
  );
};

const ArrayInput = ({ name, value, onChange, placeholder }) => {
  const options = value || [];

  const handleChange = (index, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newValue;
    onChange(name, updatedOptions);
  };

  const addOption = () => {
    onChange(name, [...options, ""]); // Add a new empty option
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    onChange(name, updatedOptions);
  };

  return (
    <div>
      {options.map((option, index) => (
        <div key={index} className="pair-container">
          <input
            type="text"
            placeholder={placeholder}
            className="key-input"
            value={option}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <button
            type="button"
            className="form-remove-button"
            onClick={() => removeOption(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="form-add-button" onClick={addOption}>
        Add {placeholder}
      </button>
    </div>
  );
};

const GenericForm = ({
  formSchema,
  onSubmit,
  isOpen,
  onClose,
  initialData,
  title,
}) => {
  // Filter out hidden fields from the formSchema
  const visibleFields = formSchema.filter((field) => field.type !== "hidden");

  const [formData, setFormData] = useState(initialData || {});
  const [formErrors, setFormErrors] = useState({});
  const [selectedObjectIds, setSelectedObjectIds] = useState([]);

  // Initialize state for selected options of each select-multiple field
  const [selectedOptions, setSelectedOptions] = useState({});

  const [mediaData, setMediaData] = useState(initialData?.mediaData || []);
  const [updatedMediaData, setUpdatedMediaData] = useState(
    initialData?.mediaData || []
  );

  const [relatedObjectsOptions, setRelatedObjectsOptions] = useState([]);
  const [initialRelatedObjectsOptions, setInitialRelatedObjectsOptions] =
    useState([]);

  const initializeRelatedObjectsOptions = () => {
    const relatedObjectsField = formSchema.find(
      (field) => field.name === "related_objects"
    );
    if (relatedObjectsField && relatedObjectsField.options) {
      setInitialRelatedObjectsOptions(relatedObjectsField.options);
    }
  };

  useEffect(() => {
    initializeRelatedObjectsOptions();
  });

  // Handle file upload for new media
  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Add file and empty comment to mediaData
          setMediaData((prev) => [
            ...prev,
            { mediaUrl: reader.result, file, comment: "" },
          ]);
          setUpdatedMediaData((prev) => [
            ...prev,
            { mediaUrl: reader.result, file, comment: "" },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle deletion of an existing or newly added image
  const handleDeleteImage = (index) => {
    setMediaData((current) => current.filter((_, i) => i !== index));
    setUpdatedMediaData((current) =>
      current.map((item, i) => {
        if (i === index) {
          // Mark the item as deleted
          return { ...item, isDeleted: true };
        }
        return item;
      })
    );
  };

  // Handle change in comment for both existing and newly added media
  const handleCommentChange = (e, index) => {
    const updatedComment = e.target.value;
    setMediaData((current) =>
      current.map((item, i) =>
        i === index ? { ...item, comment: updatedComment } : item
      )
    );
    setUpdatedMediaData((current) =>
      current.map((item, i) =>
        i === index
          ? { ...item, comment: updatedComment, isCommentUpdated: true }
          : item
      )
    );
  };

  useEffect(() => {
    setFormData(initialData || {});
    if (initialData && initialData.mediaData) {
      setMediaData(initialData.mediaData);
    }
    // Initialize related objects options if action_reference_id is present in initial data
    if (initialData && initialData.action_reference_id) {
      updateRelatedObjectsOptions(initialData.action_reference_id);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData(initialData || {});
    // Initialize selected options for each select-multiple field based on initialData
    const initialSelectedOptions = {};
    formSchema.forEach((field) => {
      if (
        field.type === "select-multiple" &&
        initialData &&
        initialData[field.name]
      ) {
        initialSelectedOptions[field.name] = initialData[field.name].map(
          (id) => ({
            value: id,
            label:
              field.options.find((option) => option.value === id)?.label ||
              id.toString(),
          })
        );
      }
    });
    setSelectedOptions(initialSelectedOptions);
  }, [initialData, formSchema]);

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleMultiSelectChange = (field, selectedOptions) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [field.name]: selectedOptions || [],
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field.name]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    const transformedData = { ...formData, mediaData: updatedMediaData };

    formSchema.forEach((field) => {
      if (
        field.type === "checkbox" &&
        transformedData[field.name] === undefined
      ) {
        transformedData[field.name] = false; // Default value for checkboxes not interacted with
      }
    });

    visibleFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    });

    // Handle hidden fields separately
    formSchema
      .filter((field) => field.type === "hidden")
      .forEach((hiddenField) => {
        // Check if the hidden field exists in initialData
        if (initialData && initialData[hiddenField.name] !== undefined) {
          transformedData[hiddenField.name] = initialData[hiddenField.name];
        } else {
          // Use the defaultValue if no value is found in initialData
          transformedData[hiddenField.name] = hiddenField.defaultValue;
        }
      });

    if (Object.keys(errors).length === 0) {
      onSubmit(transformedData);
    } else {
      setFormErrors(errors);
    }
  };

  useEffect(() => {
    setFormData(initialData || {});

    // Initialize selected options for all select-multiple fields based on initialData
    const initialSelectedOptions = {};
    formSchema.forEach((field) => {
      if (field.type === "select-multiple") {
        // Use the field's name to look up initial values
        const initialValue = initialData ? initialData[field.name] : [];
        const options = field.options || [];

        // Map initial values to their corresponding label-value pairs
        initialSelectedOptions[field.name] = initialValue.map((value) => {
          const option = options.find((option) => option.value === value);
          return { label: option ? option.label : value, value: value };
        });
      }
    });

    setSelectedOptions(initialSelectedOptions);
  }, [initialData, formSchema]);

  const handleFieldChange = (name, newValue) => {
    // Create a shallow copy of formData
    const updatedFormData = { ...formData };

    // Update the specific field with the new value
    updatedFormData[name] = newValue;

    // Set the updated formData
    setFormData(updatedFormData);
  };

  const updateRelatedObjectsOptions = (selectedActionReferenceId) => {
    const relatedObjectsField = formSchema.find(
      (field) => field.name === "related_objects"
    );
    if (relatedObjectsField && initialRelatedObjectsOptions) {
      // Filter options directly based on the action_reference_id (value)
      const filteredOptions = initialRelatedObjectsOptions.filter(
        (option) => option.value === selectedActionReferenceId
      );

      // Format the filtered options for display in a text area (or as needed)
      const optionsText = filteredOptions
        .map((option) => option.label)
        .join("\n");

      // Assuming setRelatedObjectsOptions is meant to update a state or prop that controls the displayed options
      setRelatedObjectsOptions(optionsText);
    }
  };

  const handleActionReferenceChange = (selectedOption) => {
    // Update formData with the new action_reference_id
    const newActionReferenceId = selectedOption.value;

    updateRelatedObjectsOptions(newActionReferenceId);
  };

  return (
    <div className={`modal-overlay${isOpen ? " open" : ""}`}>
      <div className="modal-container">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {visibleFields.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "select" ? (
                <Select
                  className="wider-select"
                  options={field.options || []}
                  name={field.name}
                  value={
                    formData[field.name] ||
                    (initialData && initialData[field.name])
                      ? {
                          label: field.options.find(
                            (option) =>
                              option.value ===
                              (formData[field.name] || initialData[field.name])
                          ).label,
                          value:
                            formData[field.name] || initialData[field.name],
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      [field.name]: selectedOption.value,
                    });
                    handleActionReferenceChange(selectedOption);
                  }}
                />
              ) : field.type === "select-multiple" ? (
                <Select
                  className="wider-select"
                  isMulti
                  options={field.options}
                  name={field.name}
                  value={selectedOptions[field.name] || []} // Use dynamic state
                  onChange={(selectedOptions) =>
                    handleMultiSelectChange(field, selectedOptions)
                  }
                />
              ) : field.type === "relatedtextarea" ? (
                <textarea
                  id={field.name}
                  value={relatedObjectsOptions}
                  readOnly={true}
                  style={{
                    width: "30%",
                    height: "100px",
                    backgroundColor: "#f0f0f0",
                  }} // Adjust the styling as needed
                />
              ) : field.type === "object" ? (
                <KeyValuePairs
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleFieldChange}
                />
              ) : field.type === "file" ? (
                <div key={field.name}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="image-grid">
                    {mediaData.map((media, index) => (
                      <div className="image-container" key={index}>
                        <img
                          src={media.mediaUrl}
                          alt={`Uploaded media ${index}`}
                        />
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={media.comment}
                          onChange={(e) => handleCommentChange(e, index)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : field.type === "array" ? (
                <ArrayInput
                  name={field.name}
                  value={formData[field.name] || []}
                  onChange={handleFieldChange}
                  placeholder={field.placeholder}
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              )}
              {formErrors[field.name] && (
                <div className="error" style={{ textAlign: "right" }}>
                  <span className="error-icon">
                    <i
                      className="fas fa-exclamation-circle"
                      style={{ color: "red" }}
                    ></i>
                  </span>
                  <span className="error-text" style={{ color: "red" }}>
                    {formErrors[field.name]}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="confirm-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericForm;
