import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ResponseTypes = ({
  responseType,
  responseTypes,
  collectResponse,
  initialResponse,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInputValue, setTextInputValue] = useState("");

  // Get options dynamically from responseTypeObject
  const options = responseTypes.find((rt) => rt.type === responseType)?.options;

  useEffect(() => {
    if (initialResponse && initialResponse.response && options) {
      const { responseType, response: value } = initialResponse;

      switch (responseType) {
        case "Confirmation":
          setSelectedOption(value);
          break;
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
  }, [initialResponse, options]);

  const handleConfirmationClick = (option) => {
    setSelectedOption(option);
    collectResponse({ responseType, response: option });
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

  // Find the response type object based on the response type
  const responseTypeObject = responseTypes.find(
    (rt) => rt.type === responseType
  );

  // If responseTypeObject is not found, return null or handle the case
  if (!responseTypeObject) return null;

  const generateMarks = (options) => {
    return options.reduce((marks, option, index) => {
      marks[index] = option;
      return marks;
    }, {});
  };

  // Render the appropriate response type component based on responseType
  switch (responseType) {
    case "Confirmation":
      return (
        <div className="confirmation-container">
          {options.map((option, index) => (
            <div
              key={index}
              className={`confirmation-option ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => handleConfirmationClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      );
    case "FreeText":
      return (
        <input
          type="text"
          className="input-text"
          value={textInputValue}
          onChange={handleTextInputChange}
        />
      );
    case "NumericInput":
      return (
        <input
          type="number"
          className="numeric-input"
          value={textInputValue}
          onChange={handleNumericInputChange}
        />
      );
    case "Slider":
      return (
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
      );
    default:
      return null;
  }
};

export default ResponseTypes;
