import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ResponseTypes = ({ action, collectResponse, initialResponse }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [textInputValue, setTextInputValue] = useState("");

  const [numericInputValues, setNumericInputValues] = useState({});

  const responseType = action.ActionReference.ResponseType.type;
  const options = action.ActionReference.ResponseType?.options;
  const issues = action.ActionReference.Issues;
  const [selectedIssueId, setSelectedIssueId] = useState("");

  useEffect(() => {
    if (initialResponse && initialResponse.response && options) {
      const { responseType, response: value } = initialResponse;

      switch (responseType) {
        case "FreeText":
        case "NumericInput":
          setTextInputValue(value);
          break;
        case "Slider":
          // Find the index of the value in options array
          const index = options.indexOf(value);
          setSliderValue(index !== -1 ? index : 0);
          break;
        default:
          break;
      }
    }
    if (
      responseType === "Manque" &&
      action.Objects &&
      action.Objects.length > 0 &&
      !Object.keys(numericInputValues).length &&
      initialResponse.response
    ) {
      const initialValues = initialResponse.response;
      setNumericInputValues(initialValues);
    }

    if (responseType === "Anomalie" && initialResponse.response) {
      setSelectedIssueId(initialResponse.response.issue_id);
    }
  }, [initialResponse, options, action.Objects, numericInputValues]);

  const handleSelectChange = (event) => {
    const selectedIssueId = event.target.value;
    setSelectedIssueId(selectedIssueId); // Update the state to reflect the new selection
    const selectedIssue = issues.find(
      (issue) => issue.issue_id.toString() === selectedIssueId
    );
    if (selectedIssue) {
      collectResponse({
        responseType,
        response: {
          issue_id: selectedIssue.issue_id,
          code: selectedIssue.code,
          label: selectedIssue.label,
        },
      });
    }
  };

  // Generate options for the "Anomalie" select field
  const generateIssueOptions = () => {
    return issues.map((issue) => (
      <option key={issue.issue_id} value={issue.issue_id}>
        {issue.code} - {issue.label}
      </option>
    ));
  };

  const handleManqueInputChange = (objId, value) => {
    setNumericInputValues((prevValues) => {
      const updatedValues = { ...prevValues, [objId]: value };
      collectResponse({ responseType, response: updatedValues });

      return updatedValues;
    });
  };

  const handleTextInputChange = (event) => {
    const value = event.target.value;
    setTextInputValue(value);
    collectResponse({ responseType, response: value });
  };

  const handleNumericInputChange = (event) => {
    const value = event.target.value;
    setTextInputValue(value);
    collectResponse({ responseType, response: value });
  };

  const handleSliderChange = (index) => {
    const value = options[index]; // Retrieve the value from options array
    setSliderValue(index); // Update the slider value
    collectResponse({ responseType, response: value }); // Collect the response
  };

  const generateMarks = (options) => {
    return options.reduce((marks, option, index) => {
      marks[index] = option;
      return marks;
    }, {});
  };

  // Render the appropriate response type component based on responseType
  switch (responseType) {
    case "FreeText":
      return (
        <div className="section">
          <label>
            {action.ActionReference.response_label
              ? action.ActionReference.response_label
              : Response}
          </label>
          <div>
            <input
              type="text"
              className="input-text"
              value={textInputValue}
              onChange={handleTextInputChange}
            />
          </div>
        </div>
      );
    case "NumericInput":
      return (
        <div className="section">
          <label>
            {action.ActionReference.response_label
              ? action.ActionReference.response_label
              : Response}
          </label>
          <div>
            <input
              type="number"
              className="numeric-input"
              value={textInputValue}
              onChange={handleNumericInputChange}
            />
          </div>
        </div>
      );
    case "Slider":
      return (
        <div className="section">
          <label>
            {action.ActionReference.response_label
              ? action.ActionReference.response_label
              : Response}
          </label>
          <div>
            <div className="slider-container">
              <Slider
                min={0}
                max={options.length - 1}
                defaultValue={sliderValue}
                value={sliderValue}
                marks={generateMarks(options)}
                onChange={handleSliderChange}
              />
            </div>
          </div>
        </div>
      );
    case "Manque":
      if (action.Objects.length > 0) {
        return (
          <div className="section">
            <label>{action.ActionReference.response_label || "Manque"}</label>
            <div>
              {action.Objects.map((obj) => (
                <div key={obj.object_id} className="numeric-input-group">
                  <label>
                    {obj.object_id} - {obj.object_code} - {obj.object_name}
                  </label>
                  <input
                    type="number"
                    value={numericInputValues[obj.object_id] || ""}
                    onChange={(e) =>
                      handleManqueInputChange(obj.object_id, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      break;

    case "Anomalie":
      return (
        <div className="section">
          <label>
            {action.ActionReference.response_label || "Select error code:"}
          </label>
          <div>
            <select
              value={selectedIssueId}
              onChange={handleSelectChange}
              className="select-anomalie"
            >
              <option value="">Select an issue...</option>
              {generateIssueOptions()}
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ResponseTypes;
