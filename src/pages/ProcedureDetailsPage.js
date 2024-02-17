import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import GenericTable from "../components/generic/GenericTable";
import config from "../configuration/config";
import ExpandableTable from "../components/generic/ExpandableTable";
import GenericForm from "../components/generic/GenericForm";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import GenericConfirmation from "../components/generic/GenericConfirmation";

import SimulatedMobileApp from "../components/device/SimulatedMobileApp";

const ProcedureDetailsPage = () => {
  const { procedure_Id } = useParams();
  const [procedureDetails, setProcedureDetails] = useState(null);
  const [phases, setPhases] = useState([]);
  const [operations, setOperations] = useState({});
  const [actions, setActions] = useState({});
  const location = useLocation();

  const [operationTypes, setOperationTypes] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [responseTypes, setResponseTypes] = useState([]);
  const [actionReferences, setActionReferences] = useState([]);
  const [objects, setObjects] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);

  // State variables to control the visibility of "Add" modals
  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [isAddOperationModalOpen, setIsAddOperationModalOpen] = useState(false);
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);

  const [isEditPhaseModalOpen, setIsEditPhaseModalOpen] = useState(false);
  const [isEditOperationModalOpen, setIsEditOperationModalOpen] =
    useState(false);
  const [isEditActionModalOpen, setIsEditActionModalOpen] = useState(false);

  const [selectedPhaseData, setSelectedPhaseData] = useState(null);
  const [selectedOperationData, setSelectedOperationData] = useState(null);
  const [selectedActionData, setSelectedActionData] = useState(null);

  const [phaseIdToDelete, setPhaseIdToDelete] = useState(null);
  const [operationIdToDelete, setOperationIdToDelete] = useState(null);
  const [actionIdToDelete, setActionIdToDelete] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isMobileDeviceModalOpen, setIsMobileDeviceModalOpen] = useState(false);
  const [isTabletDeviceModalOpen, setIsTabletDeviceModalOpen] = useState(false);

  const {
    procedureTypesOptions,
    eventOptions,
    assetModelOptions,
    assetItemOptions,
  } = location.state || {};

  const fetchOperationTypes = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/operation-types`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOperationTypes(data);
    } catch (error) {
      console.error("Error fetching operation types:", error);
    }
  };
  const fetchLocalizations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/localizations`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setLocalizations(data);
    } catch (error) {
      console.error("Error fetching localizations:", error);
    }
  };
  const fetchResponseTypes = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/responseType`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResponseTypes(data);
    } catch (error) {
      console.error("Error fetching response types:", error);
    }
  };
  const fetchActionReferences = async () => {
    const response = await fetch(`${config.API_BASE_URL}/actionReferences`);
    if (!response.ok) throw new Error("Failed to fetch action references");
    const data = await response.json();
    setActionReferences(data);
  };

  const fetchObjects = async () => {
    const response = await fetch(`${config.API_BASE_URL}/objects`);
    if (!response.ok) throw new Error("Failed to fetch objects");
    const data = await response.json();
    setObjects(data);
  };

  const fetchActionTypes = async () => {
    const response = await fetch(`${config.API_BASE_URL}/actionType`);
    if (!response.ok) throw new Error("Failed to fetch action types");
    const data = await response.json();
    setActionTypes(data);
  };

  // Fetch procedure details based on the procedure_Id from the URL
  useEffect(() => {
    const fetchProcedureDetails = async () => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/procedure/${procedure_Id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProcedureDetails(data);
      } catch (error) {
        console.error("Error fetching procedure details:", error);
      }
    };

    fetchProcedureDetails();
    fetchOperationTypes();
    fetchLocalizations();
    fetchResponseTypes();
    fetchActionReferences();
    fetchObjects();
    fetchActionTypes();
  }, [procedure_Id]);

  // Fetch phases based on procedure ID
  const fetchPhases = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/phase/procedure/${procedure_Id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const sortedPhases = data.sort((a, b) => a.sequence - b.sequence);
      setPhases(sortedPhases);
    } catch (error) {
      console.error("Error fetching phases:", error);
    }
  };
  const fetchOperations = async () => {
    const ops = {};

    for (const phase of phases) {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/operations/phase/${phase.phase_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        data = data.map((operation) => ({
          ...operation,
          operation_type_id: getOperationTypeName(operation.operation_type_id),
          localization_id: getLocalizationName(operation.localization_id),
          response_type_id: getResponseTypeName(operation.response_type_id),
        }));
        const sortedOperations = data.sort((a, b) => a.sequence - b.sequence);
        ops[phase.phase_id] = sortedOperations;
      } catch (error) {
        console.error("Error fetching operations:", error);
      }
    }

    setOperations(ops);
  };

  const fetchActions = async () => {
    const acts = {};

    for (const phase of phases) {
      for (const operation of operations[phase.phase_id] || []) {
        try {
          const response = await fetch(
            `${config.API_BASE_URL}/action/operation/${operation.operation_id}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          let data = await response.json();

          // Transform action data and add processing for objects
          data = data.map(async (action) => {
            const mediaData = await fetchMediaForAction(action.action_id);
            const localization = await fetchLocalizationForAction(
              action.localization_id
            );

            return {
              ...action,
              action_reference_id: getActionReferenceDetails(
                action.action_reference_id
              ),
              object_id: getObjectDetails(action.object_id),
              response_type_id: getResponseTypeName(action.response_type_id),
              media: mediaData,
              localization: localization,
            };
          });

          const actData = await Promise.all(data);
          const sortedActions = actData.sort((a, b) => a.sequence - b.sequence);

          acts[operation.operation_id] = sortedActions;
        } catch (error) {
          console.error("Error fetching actions:", error);
        }
      }
    }

    setActions(acts);
  };

  const fetchLocalizationForAction = async (localization_id) => {
    const localization = localizations.find(
      (loc) => loc.localization_id === localization_id
    );
    if (localization) {
      return `${localization.localization_id} - ${localization.name}`;
    }
    return "Unkown Localization";
  };

  const fetchMediaForAction = async (actionId) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/media/action/${actionId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const mediaData = await response.json();
      return mediaData;
    } catch (error) {
      console.error(`Error fetching media for action ${actionId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchPhases();
  }, [procedure_Id]);

  useEffect(() => {
    fetchOperations();
  }, [phases]);

  useEffect(() => {
    fetchActions();
  }, [actionReferences, operations, phases]);

  // Transofmration functions
  const getOperationTypeName = (operationTypeId) => {
    const operationType = operationTypes.find(
      (type) => type.operation_type_id === operationTypeId
    );
    return operationType
      ? `${operationType.operation_type_id} - ${operationType.name}`
      : "Unknown";
  };
  const getLocalizationName = (localizationId) => {
    const localization = localizations.find(
      (loc) => loc.localization_id === localizationId
    );
    return localization
      ? `${localization.localization_id} - ${localization.name}`
      : "Unknown";
  };
  const getResponseTypeName = (responseTypeId) => {
    const responseType = responseTypes.find(
      (type) => type.response_type_id === responseTypeId
    );
    if (responseType) {
      const formattedName = `${responseType.response_type_id} - ${responseType.type}`;
      if (responseType.options && responseType.options.length) {
        return `${formattedName} - Options (${responseType.options.join(
          ", "
        )})`;
      }
      return formattedName;
    } else {
      return "Unknown";
    }
  };
  const getActionReferenceDetails = (actionReferenceId) => {
    const actionReference = actionReferences.find(
      (ar) => ar.action_reference_id === actionReferenceId
    );
    const actionType = actionTypes.find(
      (at) => at.type_id === actionReference?.type_id
    );

    return actionReference && actionType
      ? `${actionReference.action_reference_id} - ${actionType.name} - ${actionReference.description}`
      : "Unknown";
  };

  const getObjectDetails = (objectIds) => {
    const objectDetails = {};

    if (objectIds && objectIds.length > 0) {
      objectIds.forEach((id) => {
        if (id === null) {
          return;
        }

        const object = objects.find((o) => o.object_id === id);
        objectDetails[`${id}`] = object ? object.object_name : "Unknown Object";
      });
    }

    return objectDetails;
  };

  // Define columns for the GenericTable
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
        if (!procedureTypesOptions || procedureTypesOptions.length === 0) {
          return "N/A";
        }
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
        if (!eventOptions || eventOptions.length === 0) {
          return "N/A";
        }
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
        if (!assetModelOptions || assetModelOptions.length === 0) {
          return "N/A";
        }
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
        if (!assetItemOptions || assetItemOptions.length === 0) {
          return "N/A";
        }
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
  ];

  const procedureDataArray = procedureDetails ? [procedureDetails] : [];

  const operationsByPhaseId = {};
  const actionsByOperationId = {};

  // Check if phases is an array and not empty
  if (Array.isArray(phases)) {
    phases.forEach((phase) => {
      const phaseId = phase.phase_id;
      const phaseOperations = operations[phaseId] || [];

      if (Array.isArray(phaseOperations)) {
        operationsByPhaseId[phaseId] = phaseOperations;

        // Iterate through the phase operations to build actionsByOperationId
        phaseOperations.forEach((operation) => {
          const operationId = operation.operation_id;
          const operationActions = actions[operationId] || [];

          if (Array.isArray(operationActions)) {
            actionsByOperationId[operationId] = operationActions;
          }
        });
      }
    });
  }
  const phaseAttributes = [
    { label: "ID", attribute: "phase_id", type: "number" },
    { label: "Sequence", attribute: "sequence", type: "number" },
    { label: "Phase Name", attribute: "phase_name", type: "text" },
    { label: "Description", attribute: "description", type: "textarea" },
    { label: "Status", attribute: "status", type: "select" },
    { label: "From", attribute: "from", type: "text" },
    { label: "To", attribute: "to", type: "text" },
    { label: "Parameters", attribute: "attributes", type: "object" },
  ];

  const operationAttributes = [
    { label: "ID", attribute: "operation_id", type: "number" },
    { label: "Sequence", attribute: "sequence", type: "number" },
    { label: "Localization", attribute: "localization_id", type: "text" },
    { label: "Name", attribute: "name", type: "text" },
    {
      label: "Type",
      attribute: "operation_type_id",
      type: "text",
    },
    { label: "Description", attribute: "description", type: "textarea" },
    { label: "Status", attribute: "status", type: "select" },
    { label: "From", attribute: "from", type: "text" },
    { label: "To", attribute: "to", type: "text" },
    { label: "Flag", attribute: "flag", type: "text" },
    { label: "Comments", attribute: "comments", type: "textarea" },
  ];

  const actionAttributes = [
    { label: "ID", attribute: "action_id", type: "number" },
    { label: "Sequence", attribute: "sequence", type: "number" },
    { label: "Reference ID", attribute: "action_reference_id", type: "text" },
    { label: "Description", attribute: "description", type: "textarea" },
    { label: "Localization", attribute: "localization", type: "textarea" },
    { label: "Response Type", attribute: "response_type_id", type: "text" },
    { label: "Objects", attribute: "object_id", type: "object" },
    { label: "Medias", attribute: "media", type: "media" },
    { label: "Comment", attribute: "comment", type: "textarea" },
  ];

  const phaseFormSchema = [
    {
      label: "Phase Name",
      name: "phase_name",
      type: "text",
      required: true,
    },
    {
      label: "Sequence",
      name: "sequence",
      type: "number",
      required: true,
    },

    {
      label: "Description",
      name: "description",
      type: "textarea",
      required: false,
    },
    {
      label: "Parameters",
      name: "attributes",
      type: "object",
      required: false,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
      required: true,
    },
    {
      label: "Valid From",
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
  ];

  const initialOperationFormSchema = [
    {
      name: "phase_id",
      type: "hidden",
      defaultValue: "",
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Type",
      name: "operation_type_id",
      type: "select",
      options: [],
      required: true,
    },
    {
      label: "Sequence",
      name: "sequence",
      type: "number",
      required: true,
    },
    {
      label: "Localization",
      name: "localization_id",
      type: "select",
      options: [],
      required: true,
    },

    {
      label: "Description",
      name: "description",
      type: "textarea",
      required: false,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
      required: true,
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
      label: "Flag",
      name: "flag",
      type: "select",
      options: [
        { label: "important", value: "important" },
        { label: "information", value: "information" },
        { label: "normal", value: "normal" },
      ],
      required: true,
    },
    {
      label: "Comments",
      name: "comments",
      type: "textarea",
      required: false,
    },
  ];

  const initialActionFormSchema = [
    {
      name: "operation_id",
      type: "hidden",
      defaultValue: "",
    },
    {
      label: "Sequence",
      name: "sequence",
      type: "number",
      required: true,
    },
    {
      label: "Action Reference",
      name: "action_reference_id",
      type: "select",
      options: actionReferences.map((ar) => ({
        label: getActionReferenceDetails(ar.action_reference_id),
        value: ar.action_reference_id,
      })),
      required: true,
      relatedfield: "action_reference_id",
    },
    {
      label: "Related Objects",
      name: "related_objects",
      type: "relatedtextarea", // Custom type if you want to handle it differently
      readOnly: true, // Make sure this field is read-only
      options: "", // Default empty value, will be updated when an action reference is selected
    },

    {
      label: "Comment",
      name: "comment",
      type: "textarea",
      required: false,
    },
  ];

  const [operationFormSchema, setOperationFormSchema] = useState([
    ...initialOperationFormSchema,
  ]);
  const [actionFormSchema, setActionFormSchema] = useState([
    ...initialActionFormSchema,
  ]);

  useEffect(() => {
    const newSchema = initialOperationFormSchema.map((field) => {
      if (field.name === "operation_type_id") {
        return {
          ...field,
          options: operationTypes.map(({ operation_type_id, name }) => ({
            label: `${operation_type_id} - ${name}`,
            value: operation_type_id,
          })),
        };
      } else if (field.name === "localization_id") {
        return {
          ...field,
          options: localizations.map(({ localization_id, name }) => ({
            label: `${localization_id} - ${name}`,
            value: localization_id,
          })),
        };
      } else if (field.name === "response_type_id") {
        return {
          ...field,
          options: responseTypes.map(({ response_type_id, type, options }) => ({
            label: `${response_type_id} - ${type}${
              options ? ` - Options: ${options.join(", ")}` : ""
            }`,
            value: response_type_id,
          })),
        };
      }
      return field;
    });

    setOperationFormSchema(newSchema);
  }, [operationTypes, localizations, responseTypes]);

  const updateActionFormSchemaWithActionReferences = () => {
    setActionFormSchema((prevSchema) => {
      return prevSchema.map((field) => {
        if (field.name === "action_reference_id") {
          return {
            ...field,
            options: actionReferences.map(
              ({
                action_reference_id,
                description,
                Act,
                ActionType,
                Objects,
              }) => {
                // Construct the label to include Act details, action reference ID, description, and object details
                let objectDetails = "";
                if (Objects && Objects.length > 0) {
                  objectDetails = Objects.filter((obj) => obj !== null) // Filter out null values
                    .map(
                      ({ object_code, object_name }) =>
                        `${object_code} - ${object_name}`
                    )
                    .join(", ");
                }

                const label = `${ActionType.name} ${Act.act} (${action_reference_id}) - ${description} - [${objectDetails}]`;

                return {
                  label: label,
                  value: action_reference_id,
                };
              }
            ),
          };
        }

        if (field.name === "related_objects") {
          // Flatten the structure by mapping over actionReferences and then over each of their Objects
          const options = actionReferences.flatMap(
            ({ action_reference_id, Objects }) =>
              Objects.filter((obj) => obj !== null).map(
                ({ object_code, object_name }) => ({
                  label: `${object_code} - ${object_name}`,
                  value: action_reference_id,
                })
              )
          );

          // Return the updated field with the new options array
          return {
            ...field,
            options: options,
          };
        }

        return field;
      });
    });
  };

  const updateActionFormSchemaWithResponseTypes = () => {
    setActionFormSchema((prevSchema) => {
      return prevSchema.map((field) => {
        if (field.name === "response_type_id") {
          return {
            ...field,
            options: responseTypes.map(({ response_type_id, type }) => ({
              label: `${response_type_id} - ${type}`,
              value: response_type_id,
            })),
          };
        }
        return field;
      });
    });
  };

  const updateActionFormSchemaWithObjects = () => {
    setActionFormSchema((prevSchema) => {
      return prevSchema.map((field) => {
        if (field.name === "object_id") {
          return {
            ...field,
            options: objects.map(({ object_id, object_name }) => ({
              label: `${object_id} - ${object_name}`,
              value: object_id,
            })),
          };
        }
        return field;
      });
    });
  };

  useEffect(() => {
    updateActionFormSchemaWithActionReferences();
  }, [actionReferences]);

  useEffect(() => {
    updateActionFormSchemaWithResponseTypes();
  }, [responseTypes]);

  useEffect(() => {
    updateActionFormSchemaWithObjects();
  }, [objects]);

  const openAddPhaseModal = () => {
    setIsAddPhaseModalOpen(true);
  };

  const openAddOperationModal = (phase_id) => {
    const phaseIdField = operationFormSchema.find(
      (field) => field.name === "phase_id"
    );

    phaseIdField.defaultValue = phase_id;
    setIsAddOperationModalOpen(true);
  };

  const openAddActionModal = (operation_id) => {
    const operationIdField = actionFormSchema.find(
      (field) => field.name === "operation_id"
    );

    operationIdField.defaultValue = operation_id;
    setIsAddActionModalOpen(true);
  };

  const closeModals = () => {
    setIsAddPhaseModalOpen(false);
    setIsAddOperationModalOpen(false);
    setIsAddActionModalOpen(false);
    setIsEditPhaseModalOpen(false);
    setIsEditOperationModalOpen(false);
    setIsEditActionModalOpen(false);
  };

  const handlePhaseAddSubmit = (formData) => {
    submitPhase(formData);
    closeModals();
  };

  const handleOperationAddSubmit = (formData) => {
    submitOperation(formData);
    closeModals();
  };

  const handleActionAddSubmit = async (formData) => {
    try {
      const transformedData = {
        ...formData,
        object_id: formData.object_id,
      };
      delete transformedData.object_id;
      const response = await fetch(`${config.API_BASE_URL}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      await fetchActions();

      // Handle success, close modal, or perform any other actions
      toastr.success("action added successfully", "Success");
      return data.action_id; // Return the object ID for media handling
    } catch (error) {
      console.error("Error adding action:", error);
      toastr.error("Failed to add action", "Error");
      return null;
    }
  };

  const handlePhaseEditSubmit = (formData) => {
    submitPhaseEdit(formData);
    closeModals();
  };

  const handleOperationEditSubmit = (formData) => {
    submitOperationEdit(formData);
    closeModals();
  };

  const handleActionEditSubmit = async (formData, mediaData) => {
    await submitActionEdit(formData);
    // Handle media data upload and creation here if needed
    if (mediaData && mediaData.length > 0) {
      await handleMediaUploadAndCreation(mediaData, formData.action_id);
    }
    closeModals();
  };

  const handlePhaseFormSubmit = async (formData) => {
    const { mediaData, ...otherFormData } = formData;
    try {
      let objectId;

      if (selectedPhaseData) {
        // Editing mode
        handlePhaseEditSubmit(otherFormData);
      } else {
        // Adding mode
        handlePhaseAddSubmit(otherFormData);
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
      // Handle errors
    }
  };
  const handleOperationFormSubmit = async (formData) => {
    const { mediaData, ...otherFormData } = formData;
    try {
      let objectId;

      if (selectedOperationData) {
        // Editing mode
        handleOperationEditSubmit(otherFormData);
      } else {
        // Adding mode
        handleOperationAddSubmit(otherFormData);
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
      // Handle errors
    }
  };
  const handleActionFormSubmit = async (formData) => {
    const { mediaData, ...otherFormData } = formData;
    try {
      let objectId;

      if (selectedActionData) {
        // Editing mode
        await handleActionEditSubmit(otherFormData, mediaData);
      } else {
        // Adding mode
        objectId = await handleActionAddSubmit(otherFormData);
      }

      if (mediaData && mediaData.length > 0 && objectId) {
        await handleMediaUploadAndCreation(mediaData, objectId);
      }

      fetchActions();
      closeModals();
    } catch (error) {
      console.error("Error handling form submission:", error);
      // Handle errors
    }
  };

  //Media ---------------

  async function handleMediaUploadAndCreation(
    mediaData,
    associatedId,
    associated_type = "action"
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
        }
      }

      if (isCommentUpdated && mediaId !== undefined && mediaId !== null) {
        // If isCommentUpdated is true and mediaId is defined, call updateMediaForObject
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
    associated_type = "action"
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

  //----------------
  const submitPhase = async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/phase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procedure_id: procedure_Id,
          phase_name: formData.phase_name,
          sequence: formData.sequence,
          status: formData.status,
          attributes: formData.attributes,
          from: formData.from,
          to: formData.to,
          mediaData: formData.mediaData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Phase added successfully:", data);

      // Handle success, close modal, or perform any other actions
      await fetchPhases();
      setIsAddPhaseModalOpen(false);
      toastr.success("Phase added successfully", "Success");
    } catch (error) {
      console.error("Error adding phase:", error);
      toastr.error("Failed to add Phase", "Error");
    }
  };

  const submitOperation = async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/operations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Operation added successfully:", data);

      const phaseIdForNewOperation = formData.phaseId || formData.phase_id;
      setOperations((prevOperations) => {
        const updatedOperations = { ...prevOperations };
        if (!updatedOperations[phaseIdForNewOperation]) {
          updatedOperations[phaseIdForNewOperation] = [];
        }
        updatedOperations[phaseIdForNewOperation].push(data);
        return updatedOperations;
      });
      await fetchOperations();
      toastr.success("operation added successfully", "Success");
    } catch (error) {
      console.error("Error adding operation:", error);
      toastr.error("Failed to add operation", "Error");
    }
  };

  const submitPhaseEdit = async (formData) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/phase/${formData.phase_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedPhaseData = await response.json();
      console.log("Phase updated successfully:", updatedPhaseData);
      toastr.success("Phase updated successfully", "Success");
      await fetchPhases();
      closeModals();
    } catch (error) {
      console.error("Error updating phase:", error);
      toastr.error("Failed to update phase", "Error");
    }
  };

  const submitOperationEdit = async (formData) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/operations/${formData.operation_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedOperationData = await response.json();
      console.log("Operation updated successfully:", updatedOperationData);
      toastr.success("Operation updated successfully", "Success");
      await fetchOperations();
      closeModals();
    } catch (error) {
      console.error("Error updating operation:", error);
      toastr.error("Failed to update operation", "Error");
    }
  };

  const submitActionEdit = async (formData) => {
    try {
      const transformedData = {
        ...formData,
        object_id: formData.object_id,
      };
      delete transformedData.object_id;
      const response = await fetch(
        `${config.API_BASE_URL}/action/${formData.action_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedActionData = await response.json();
      console.log("Action updated successfully:", updatedActionData);
      toastr.success("Action updated successfully", "Success");
      await fetchActions();
      closeModals();
    } catch (error) {
      console.error("Error updating action:", error);
      toastr.error("Failed to update action", "Error");
    }
  };

  const handleEditPhase = (phase) => {
    setSelectedPhaseData(phase);
    setIsEditPhaseModalOpen(true);
  };

  const handleEditOperation = (operation) => {
    // Create a function to extract the numeric ID from a string value
    const extractNumericID = (value) => {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    };

    // Modify the operation object to set numeric IDs
    const modifiedOperation = {
      ...operation,
      operation_type_id: extractNumericID(operation.operation_type_id),
      localization_id: extractNumericID(operation.localization_id),
      response_type_id: extractNumericID(operation.response_type_id),
    };

    setSelectedOperationData(modifiedOperation);
    setIsEditOperationModalOpen(true);
  };

  const handleEditAction = (action) => {
    // Create a function to transform media to mediaData
    const transformMediaToMediaData = (media) => {
      return media.map((m) => ({
        mediaId: m.media_id,
        mediaUrl: m.media_url,
        comment: m.comment,
      }));
    };
    const extractNumericID = (value) => {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    };

    // Modify the action object to set numeric IDs and replace media with mediaData
    const modifiedAction = {
      ...action,
      action_reference_id: extractNumericID(action.action_reference_id),
      response_type_id: extractNumericID(action.response_type_id),
      object_id: Object.keys(action.object_id || {}).map((key) =>
        extractNumericID(key.toString())
      ),
      mediaData: transformMediaToMediaData(action.media), // Replace media with mediaData
    };

    setSelectedActionData(modifiedAction);
    setIsEditActionModalOpen(action);
  };

  //Delete logic
  // Function to handle the "Delete" button click
  const handleDeletePhaseClick = (phaseId) => {
    // Show the confirmation modal and set the object ID to delete
    setShowConfirmation(true);
    setPhaseIdToDelete(phaseId);
  };
  const handleDeleteOperationClick = (operationId) => {
    // Show the confirmation modal and set the object ID to delete
    setShowConfirmation(true);
    setOperationIdToDelete(operationId);
  };
  const handleDeleteActionClick = (actionId) => {
    // Show the confirmation modal and set the object ID to delete
    setShowConfirmation(true);
    setActionIdToDelete(actionId);
  };

  const handleDelete = () => {
    if (phaseIdToDelete) {
      deletePhase(phaseIdToDelete);
      setPhaseIdToDelete(null);
    }
    if (operationIdToDelete) {
      deleteOperation(operationIdToDelete);
      setOperationIdToDelete(null);
    }
    if (actionIdToDelete) {
      deleteAction(actionIdToDelete);
      setActionIdToDelete(null);
    }
    setShowConfirmation(false);
  };

  const deletePhase = async (phaseId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/phase/${phaseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Phase with ID ${phaseId} deleted successfully`);
      toastr.success("Phase deleted successfully", "Success");
      fetchPhases();
    } catch (error) {
      console.error(`Error deleting phase with ID ${phaseId}:`, error);
      toastr.error("Failed to delete phase", "Error");
    }
  };
  const deleteOperation = async (operationId) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/operations/${operationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Operation with ID ${operationId} deleted successfully`);
      toastr.success("Operation deleted successfully", "Success");
      fetchOperations();
    } catch (error) {
      console.error(`Error deleting operation with ID ${operationId}:`, error);
      toastr.error("Failed to delete operation", "Error");
    }
  };
  const deleteAction = async (actionId) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/action/${actionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Action with ID ${actionId} deleted successfully`);
      toastr.success("Action deleted successfully", "Success");
      fetchActions();
    } catch (error) {
      console.error(`Error deleting action with ID ${actionId}:`, error);
      toastr.error("Failed to delete action", "Error");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const expandableTables =
    Array.isArray(phases) && phases.length > 0 ? (
      phases.map((phase) => {
        // Check if operations for the current phase exist
        const phaseOperations = operationsByPhaseId[phase.phase_id] || [];
        return (
          <ExpandableTable
            key={phase.phase_id}
            phase={phase}
            phaseAttributes={phaseAttributes}
            operationAttributes={operationAttributes}
            actionAttributes={actionAttributes}
            operations={phaseOperations}
            actions={actionsByOperationId}
            onAddOperation={openAddOperationModal}
            onAddAction={openAddActionModal}
            onEditPhase={handleEditPhase}
            onEditOperation={handleEditOperation}
            onEditAction={handleEditAction}
            onDeletePhase={handleDeletePhaseClick}
            onDeleteOperation={handleDeleteOperationClick}
            onDeleteAction={handleDeleteActionClick}
          />
        );
      })
    ) : (
      <div>No phases available</div>
    );

  // Device logic

  const openMobileDeviceModal = () => {
    setIsMobileDeviceModalOpen(true);
  };

  const closeMobileDeviceModal = () => {
    setIsMobileDeviceModalOpen(false);
  };

  const openTabletDeviceModal = () => {
    setIsTabletDeviceModalOpen(true);
  };

  const closeTabletDeviceModal = () => {
    setIsTabletDeviceModalOpen(false);
  };

  return (
    <div className="app">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Procedure Details</h3>
              <div className="card-tools"></div>
            </div>
            <div className="card-body">
              <div>
                {procedureDetails ? (
                  <GenericTable
                    columns={tableColumns}
                    data={procedureDataArray}
                    showPagination={false}
                  />
                ) : (
                  <p>Loading procedure details...</p>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="button-container">
                <button
                  className="OpenDeviceButton"
                  onClick={openMobileDeviceModal}
                >
                  <i className="fas fa-mobile-alt"></i> Device Simulator
                </button>
              </div>
            </div>
          </div>

          <div>{expandableTables}</div>
        </div>
      </div>

      {(isAddPhaseModalOpen || isEditPhaseModalOpen) && (
        <GenericForm
          formSchema={phaseFormSchema}
          onSubmit={handlePhaseFormSubmit}
          isOpen={isAddPhaseModalOpen}
          onClose={() => {
            setSelectedPhaseData(null);
            closeModals();
          }}
          initialData={selectedPhaseData}
          title="Add New Phase"
        />
      )}

      {(isAddOperationModalOpen || isEditOperationModalOpen) && (
        <GenericForm
          formSchema={operationFormSchema}
          onSubmit={handleOperationFormSubmit}
          isOpen={isAddOperationModalOpen}
          onClose={() => {
            setSelectedOperationData(null);
            closeModals();
          }}
          initialData={selectedOperationData}
          title="Add New Operation"
        />
      )}

      {(isAddActionModalOpen || isEditActionModalOpen) && (
        <GenericForm
          formSchema={actionFormSchema}
          onSubmit={handleActionFormSubmit}
          isOpen={isAddActionModalOpen}
          onClose={() => {
            setSelectedActionData(null);
            closeModals();
          }}
          initialData={selectedActionData}
          title="Add New Action"
        />
      )}

      {showConfirmation && (
        <GenericConfirmation
          message="Are you sure you want to delete this item?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {isMobileDeviceModalOpen && (
        <SimulatedMobileApp
          deviceType="phone"
          procedureId={procedure_Id}
          onClose={closeMobileDeviceModal}
        />
      )}
      {isTabletDeviceModalOpen && (
        <SimulatedMobileApp
          deviceType="tablet"
          procedureId={procedure_Id}
          onClose={closeTabletDeviceModal}
        />
      )}
    </div>
  );
};

export default ProcedureDetailsPage;
