import React, { useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import useProcedureDetails from "./useProcedureDetails";
import DeviceFrame from "./DeviceFrame";
import ActionScreen from "./screens/ActionScreen";
import EndScreen from "./screens/EndScreen";
import OperationScreen from "./screens/OperationScreen";
import PhaseScreen from "./screens/PhaseScreen";
import ProcedureDetailsScreen from "./screens/ProcedureDetailsScreen";
import LocationChangeScreen from "./screens/LocationChangeScreen";
import DeviceSpinner from "./screens/Spinner";
import config from "../../configuration/config";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import ErrorScreen from "./screens/ErrorScreen";

const SimulatedMobileApp = ({ procedureId, deviceType, onClose }) => {
  const procedureDetails = useProcedureDetails(procedureId);
  const [screens, setScreens] = useState([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [screenResponses, setScreenResponses] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [animationClass, setAnimationClass] = useState("");
  const [navigationDirection, setNavigationDirection] = useState("next");
  const [responseTypes, setResponseTypes] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState(false);

  const onSend = async (procedureResponse) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/procedure-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(procedureResponse),
        }
      );

      if (!response.ok) {
        setShowError(true);
      }

      const responseData = await response.json();

      setShowConfirmation(true);
    } catch (error) {
      setShowError(true);
      console.error("Error:", error);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  useEffect(() => {
    if (procedureDetails) {
      const phases = procedureDetails.Phases || [];
      const updatedScreens = [];

      const procedureDetailsScreen = {
        type: "procedureDetails",
        object: procedureDetails,
      };
      updatedScreens.push(procedureDetailsScreen);

      // Sort phases based on sequence field
      phases.sort((a, b) => a.sequence - b.sequence);

      let lastLocalization = null;

      phases.forEach((phase) => {
        const phaseScreen = { type: "phase", object: phase };
        updatedScreens.push(phaseScreen);

        phase.Operations.sort((a, b) => a.sequence - b.sequence);

        phase.Operations.forEach((operation) => {
          if (
            lastLocalization &&
            operation.Localization &&
            lastLocalization.localization_id !==
              operation.Localization.localization_id
          ) {
            const locationChangeScreen = {
              type: "locationChange",
              oldLocalization: lastLocalization,
              newLocalization: operation.Localization,
            };
            updatedScreens.push(locationChangeScreen);
          }
          lastLocalization = operation.Localization;

          const operationScreen = { type: "operation", object: operation };
          updatedScreens.push(operationScreen);

          operation.Actions.sort((a, b) => a.sequence - b.sequence);

          operation.Actions.forEach((action) => {
            const actionScreen = { type: "action", object: action };
            updatedScreens.push(actionScreen);
          });
        });
      });

      const endScreen = { type: "end", index: 0 };
      updatedScreens.push(endScreen);

      setScreens(updatedScreens);

      // Initialize current screen to procedure details
      setCurrentScreenIndex(0);

      //response types
      // Fetch response types from server
      const fetchResponseTypes = async () => {
        try {
          const response = await fetch(`${config.API_BASE_URL}/responseType`);
          const data = await response.json();
          setResponseTypes(data);
        } catch (error) {
          console.error("Error fetching response types:", error);
        }
      };

      fetchResponseTypes();
    }

    setTimeout(() => {
      setShowLoading(false); // Hide the loading spinner after 2 seconds
    }, 2000);
  }, [procedureDetails]);

  const collectResponse = (response) => {
    // Update the screenResponses array with the current screen's response
    const updatedResponses = [...screenResponses];
    updatedResponses[currentScreenIndex] = response;
    setScreenResponses(updatedResponses);
  };

  const goToNextScreen = () => {
    if (currentScreenIndex < screens.length - 1) {
      setNavigationDirection("next");
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const goToPreviousScreen = () => {
    if (currentScreenIndex > 0) {
      setNavigationDirection("prev");
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const getCurrentScreen = () => {
    if (showConfirmation) {
      return <ConfirmationScreen onClose={handleConfirmationClose} />;
    }
    if (showError) {
      return <ErrorScreen onClose={handleConfirmationClose} />;
    }

    const currentScreen = screens[currentScreenIndex];

    if (showLoading || !currentScreen) {
      return <DeviceSpinner />;
    }

    const screenKey = `${currentScreen.type}_${currentScreenIndex}`;
    const initialResponse = screenResponses[currentScreenIndex] || {};

    switch (currentScreen.type) {
      case "procedureDetails":
        return (
          <ProcedureDetailsScreen
            key={screenKey}
            procedureDetails={procedureDetails}
            collectResponse={collectResponse}
            initialResponse={initialResponse}
          />
        );
      case "phase":
        const phase = currentScreen.object;
        return (
          <PhaseScreen
            key={screenKey}
            phase={phase}
            collectResponse={collectResponse}
            initialResponse={initialResponse}
          />
        );
      case "operation":
        const operation = currentScreen.object;
        return (
          <OperationScreen
            key={screenKey}
            operation={operation}
            collectResponse={collectResponse}
            initialResponse={initialResponse}
          />
        );
      case "action":
        const action = currentScreen.object;
        return (
          <ActionScreen
            key={screenKey}
            action={action}
            collectResponse={collectResponse}
            initialResponse={initialResponse}
            responseTypes={responseTypes}
          />
        );
      case "end":
        return (
          <EndScreen
            procedureDetails={procedureDetails}
            screens={screens}
            screenResponses={screenResponses}
            onSend={onSend}
          />
        );
      case "locationChange":
        const { oldLocalization, newLocalization } = currentScreen;
        return (
          <LocationChangeScreen
            key={screenKey}
            oldLocalization={oldLocalization}
            newLocalization={newLocalization}
            collectResponse={collectResponse}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="device-modal-overlay" onClick={onClose}>
      <div
        className="device-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
      >
        <DeviceFrame deviceType={deviceType}>
          <div className="device-app-header">
            <img src="/logo.png" alt="Logo" />
          </div>
          <TransitionGroup className="device-app-content">
            <CSSTransition
              key={currentScreenIndex}
              timeout={300}
              classNames={
                navigationDirection === "next" ? "slide-next" : "slide-prev"
              }
              unmountOnExit
            >
              {getCurrentScreen()}
            </CSSTransition>
          </TransitionGroup>

          {!showConfirmation && !showError && (
            <div className="device-app-footer">
              <button
                onClick={goToPreviousScreen}
                disabled={currentScreenIndex === 0}
                className={`device-button ${
                  currentScreenIndex === 0 ? "disabled" : ""
                }`}
              >
                &lt; Back
              </button>
              <button
                onClick={goToNextScreen}
                disabled={currentScreenIndex === screens.length - 1}
                className={`device-button ${
                  currentScreenIndex === screens.length - 1 ? "disabled" : ""
                }`}
              >
                Next&nbsp;&gt;
              </button>
            </div>
          )}
        </DeviceFrame>
      </div>
    </div>
  );
};

export default SimulatedMobileApp;
