//TicketPage.js
import React, { useState, useEffect } from 'react';
import TicketDataTable from '../components/tickets/TicketDataTable';
import TicketInputRow from '../components/tickets/TicketInputRow';
import EditModal from '../components/tickets/EditTicketModal';
import TicketFilter from '../components/tickets/TicketFilter';
import AvailableSolutionsModal from '../components/tickets/AvailableSolutionsModal';
import SolutionDetailsModal from '../components/tickets/SolutionDetailsModal';
import ResolveModal from '../components/tickets/ResolveModal'; 
import TicketInputMedias from '../components/tickets/TicketInputMedias';

import config from '../configuration/config';

const TicketPage = () => {
  const [ticketDataState, setTicketData] = useState([]);
  const [ticketConfig, setTicketConfig] = useState({ columns: [] });
  const [editingRow, setEditingRow] = useState(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isAvailableSolutionsModalOpen, setIsAvailableSolutionsModalOpen] = useState(false);
  const [isSolutionDetailsModalOpen, setSolutionDetailsModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [formDataForAvailableSolutions, setFormDataForAvailableSolutions] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveModalRowId, setResolveModalRowId] = useState(null);

  const [filterValues, setFilterValues] = useState(null);
  //const [filteredData, setFilteredData] = useState(initialTicketData);
  const [filteredData, setFilteredData] = useState([]);
  

  const [isTicketInputMediasModalOpen, setIsTicketInputMediasModalOpen] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [solutionFormValues, setSolutionFormValues] = useState({});

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    
    const fetchConf = async () => {
      //setLoading(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/ticket-config/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTicketConfig(data[0].conf);

        console.log('Fetched tickets conf:', data[0].conf); // Debugging

      } catch (error) {
        console.error('Error tickets checklist data:', error);
      } finally {
       // setLoading(false);
      }
    };

    const fetchData = async () => {
      
      try {
        const response = await fetch(`${config.API_BASE_URL}/ticket-data/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTicketData(data.map(item => ({
          ...item.entry, // Spread all properties of the entry object
          id: item.entryId // Add the entryId property
        })));

        setFilteredData(data.map(item => ({
          ...item.entry, // Spread all properties of the entry object
          id: item.entryId // Add the entryId property
        })));
      

        console.log('Fetched tickets data:', data.map(item => item.entry)); // Debugging

      } catch (error) {
        console.error('Error tickets checklist data:', error);
      } finally {
        
      }
    };

    setIsLoading(true);
    fetchConf();
    fetchData();
    setTimeout(() => setIsLoading(false), 500);
  }, []); 

  // Method to open the Resolve modal
  const handleResolveRow = (row) => {
    setResolveModalRowId(row.id);
    setIsResolveModalOpen(true); // Open the Resolve modal
  };

  // Method to close the Resolve modal
  const handleResolveModalClose = () => {
    setResolveModalRowId(null);
    setIsResolveModalOpen(false); // Close the Resolve modal
  };

  // Method to save changes when the Resolve modal is confirmed
  const handleResolveRowSave = (resolvedData) => {

    // Extract mediaData from resolvedData
    const { solutionFormValues, mediaData, ...ticketData } = resolvedData;

    console.log('solution for values:', solutionFormValues);

    // Call the update API with ticketData (excluding mediaData)
    updateTicketData(ticketData);
    // Add key/value pairs from ticketData to solutionFormValues
    solutionFormValues.codeObjet = ticketData.codeObjet;
    solutionFormValues.issue = ticketData.issue;
    
    postSolutionData(solutionFormValues, ticketData.id)
    .then(solutionId => {
      console.log('Solution ID:', solutionId);
      handleMediaUploadAndCreation(mediaData, solutionId, "solution");
      postTicketSolutionRelation(solutionId, ticketData.id);

    })
    .catch(error => {
      console.error('Error in posting solution data:', error);
    });
    setIsResolveModalOpen(false); // Close the Resolve modal
  };

  async function postTicketSolutionRelation(solutionId, ticketId) {
    const payload = {
      ticket_id: ticketId,
      solution_id: solutionId
    };
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/ticket-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('ticket solution relation created with response:', data);
    } catch (error) {
      console.error('Error posting solution data:', error);
      return null; // or you may choose to throw the error or handle it differently
    }
  }

  async function postSolutionData(solutionFormValues, ticketId) {
    const payload = {
      config_id: 1,
      data: solutionFormValues,
      ticket_Id: ticketId,
      views:0,
      usage:1
    };
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/solution-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.solution_id; // Assuming the response structure has a solution_id key
    } catch (error) {
      console.error('Error posting solution data:', error);
      return null; // or you may choose to throw the error or handle it differently
    }
  }
  

  const handleCreateIssue = (isSolutionUsed, solution) =>  {
    // Create a new issue row based on the formData
    const newIssueRow = {};
    const confColumns = ticketConfig.columns;
    // Iterate through the columns and populate newIssueRow
    confColumns.forEach((confColumn) => {
      // Skip columns without key or those not present in formDataForAvailableSolutions
      if (confColumn.key && formDataForAvailableSolutions.hasOwnProperty(confColumn.key)) {
        newIssueRow[confColumn.key] = formDataForAvailableSolutions[confColumn.key];
      }
    });

    //call the api to add the element in db
    apiCreateIssue(newIssueRow, isSolutionUsed, solution);
  
    // Close the AvailableSolutionsModal
    setIsAvailableSolutionsModalOpen(false);
    closeInputModal();
  };

  const apiCreateIssue = (newIssueRow, isSolutionUsed, solution) => {
    
    const confId = 1; 
  
    const requestBody = {
      entry: newIssueRow,
      confId: confId
    };
  
    fetch(`${config.API_BASE_URL}/ticket-data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      const newIssueWithId = { ...newIssueRow, id: data.entryId };
      // Add the new issue row with the ID to the ticketDataState
      setTicketData(prevData => [...prevData, newIssueWithId]);

      // Update filteredData if necessary
      setFilteredData(prevData => [...prevData, newIssueWithId]);

      // create associated medias
      console.log("Current mediaData:", mediaData);

      handleMediaUploadAndCreation(mediaData, data.entryId);

      //if resolved using existing solution
      if(isSolutionUsed){
        console.log('a solution is used for this:', data.entryId, 'a solution id:', solution.solution_id);
        postTicketSolutionRelation(solution.solution_id, data.entryId);
      }
    })
    .catch(error => {
      console.error('Error adding new ticket:', error);
      // Handle any errors
    });
  };

  async function handleMediaUploadAndCreation(mediaData, associatedId, associated_type = "ticket") {
    
    for (const media of mediaData) {
      console.log('start loop creating media');
      // Extract file and comment
      const { file, comment } = media;

      if (!file) {
        console.error('No image file present');
        continue; // Skip this iteration
      }
  
      // Upload the image
      const uploadResponse = await uploadImage(file);
      if (uploadResponse && uploadResponse.fileUrl) {
        // Extract the media type from the file
        const mediaType = file.type.split('/')[1]; // Example: 'image/jpeg' to 'jpeg'
        
        console.log('creating media: image uploaded with ', uploadResponse.fileUrl,mediaType, comment, associatedId);
        // Create and associate the media
        await createAndAssociateMedia(uploadResponse.fileUrl, mediaType, comment, associatedId, associated_type);
        console.log('start loop creating media');

      } else {
        console.error('Failed to upload image:', file.name);
        // Optionally handle the error, e.g., by notifying the user
      }
    }
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      console.log('Uploading file:', file);
      const response = await fetch(`${config.API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }
  
  async function createAndAssociateMedia(uploadedImageUrl, mediaType, comment, associatedId, associated_type = "ticket") {
    const payload = {
      associated_id: associatedId,
      associated_type: associated_type,
      media_url: uploadedImageUrl,
      media_type: mediaType,
      comment: comment
    };

    console.log('createAndAssociateMedia ', payload);
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating media:', error);
      return null;
    }
  }
  

  const handleEditRow = (editedRow) => {
    setTicketData((prevData) =>
      prevData.map((row) => (row === editingRow ? { ...editedRow, status: 'RECORDED' } : row))
    );
    setIsEditModalOpen(true);
    setEditingRow(editedRow);

  };

  const updateTicketData = (editedData) => {
    fetch(`${config.API_BASE_URL}/ticket-data/${editedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entry: editedData })
    })
    .then(response => response.json())
    .then(data => {
      // Handle successful update 
      // Update local state only after a successful API response
      const updatedData = ticketDataState.map((row) =>
      row.id === editedData.id ? editedData : row);
      setTicketData(updatedData);
      setFilteredData(updatedData);
    })
    .catch(error => console.error('Error updating ticket:', error));
  };
  

  const handleSaveEditedRow = (editedData) => {

    //call the update API
    updateTicketData(editedData);

    setEditingRow(null);
    setIsEditModalOpen(false);
  };

  const openInputModal = () => {
    setIsInputModalOpen(true);
  };

  const closeInputModal = () => {
    resetMediaData();
    setIsInputModalOpen(false);
  };

  const handleFilterChange = (values) => {
    const updatedValues = { ...filterValues };

    ticketConfig.columns.forEach((column) => {
      const { key } = column;
      if (key && values[key] !== undefined) {
        updatedValues[key] = values[key];
      }
    });

    setFilterValues(updatedValues);

    // The filteredData is now available here
    const filteredData = ticketDataState.filter((row) => {
      return ticketConfig.columns.every((column) => {
        const { key } = column;
        return !key || !updatedValues[key] || row[key] === updatedValues[key];
      });
    });

    setFilteredData(filteredData);

  };

  const handleviewSolutionDetails = (solution) => {
    openSolutionDetailsModal(solution);
    setIsAvailableSolutionsModalOpen(false); // Close AvailableSolutionsModal
  };

  const handleAvailableSolutionsModalClose = () => {
    closeSolutionDetailsModal();
    setIsAvailableSolutionsModalOpen(true); // Close AvailableSolutionsModal
  };

  const handleSolutionUse = (solution) => {
    handleCreateIssue(true, solution);
    setSolutionDetailsModalOpen(false);
  }

  const openSolutionDetailsModal = (solution) => {
    setSelectedSolution(solution);
    setSolutionDetailsModalOpen(true);
  };

  const closeSolutionDetailsModal = () => {
    setSelectedSolution(null);
    setSolutionDetailsModalOpen(false);
  };

  const handleBackClick = () => {
    setIsInputModalOpen(true); // Open TicketInputRow modal
    setIsAvailableSolutionsModalOpen(false); // Close AvailableSolutionsModal
    setFormDataForAvailableSolutions(formDataForAvailableSolutions);
  };

  const handleNextClickInTicketInputRow = (formData) => {
    setFormDataForAvailableSolutions(formData);
    setIsTicketInputMediasModalOpen(true); // Open TicketInputMedias modal
    setIsInputModalOpen(false); // Close TicketInputRow modal
  };

  const handleBackToTicketInputRow = () => {
    setIsTicketInputMediasModalOpen(false); // Close TicketInputMedias modal
    setIsInputModalOpen(true); // Open TicketInputRow modal
  };

  const handleNextClickInTicketInputMedias = () => {
    setIsTicketInputMediasModalOpen(false); // Close TicketInputMedias modal
    setIsAvailableSolutionsModalOpen(true); // Open AvailableSolutionsModal
  };

  const resetMediaData = () => {
    setMediaData([]);
  };
  

  return (
    <div className="app">
      
      <div className="row">
      
        <div className="col-12">
          <div className="card">
            <TicketFilter columns={ticketConfig.columns} onFilterChange={handleFilterChange} filter={filterValues}/>
          </div>
        </div>
      </div>
    <div className="row">
      
          <div className="col-12">
            <div className="card">

                <div className="card-header">
                  <h3 className="card-title">Tickets</h3>
                  
                  <div className="card-tools">
                  
                  <button className="btn btn-block btn-success float-right" onClick={openInputModal}>
                        Add Ticket
                  </button>

                  
                
                  </div>
              </div>
           
             <div class="card-body">
                    <TicketDataTable
                      data={filteredData}
                      onEditRow={(row) => handleEditRow(row)}
                      onResolveRow={(row) => handleResolveRow(row)}
                      columns={ticketConfig.columns}
                    />
                  </div>
                  
                </div>
            
        </div>
      </div>
        {isResolveModalOpen && resolveModalRowId !== null && (
          <ResolveModal
            rowData={ticketDataState.find((row) => row.id === resolveModalRowId)}
            onSave={(resolvedData) => handleResolveRowSave(resolvedData)}
            onClose={handleResolveModalClose}
          />
        )}

        {isInputModalOpen && (
          <TicketInputRow
            onClose={closeInputModal}
            editingRow={editingRow}
            onNextClick={handleNextClickInTicketInputRow}
            formData={formDataForAvailableSolutions}
            columns={ticketConfig.columns}
          />
        )}

        {isTicketInputMediasModalOpen && (
            <TicketInputMedias
              onBack={handleBackToTicketInputRow}
              onNext={handleNextClickInTicketInputMedias}
              mediaData={mediaData}
              setMediaData={setMediaData}
            />
          )}

        {isAvailableSolutionsModalOpen && (
          <AvailableSolutionsModal
            formData={formDataForAvailableSolutions}
            onClose={handleBackClick}
            onCreateIssue={handleCreateIssue}
            onSolutionViewDetails={handleviewSolutionDetails}
          />
        )}
        {isSolutionDetailsModalOpen && (
          <SolutionDetailsModal
            solution={selectedSolution}
            onClose={handleAvailableSolutionsModalClose}
            isFromTicket='true'
            onUse = {handleSolutionUse}
          />
        )}
        {isEditModalOpen && editingRow !== null && (
          <EditModal
            rowData={editingRow}
            onSave={handleSaveEditedRow}
            onClose={() => {
              setEditingRow(null);
              setIsInputModalOpen(false);
            }}
            
            columns={ticketConfig.columns}
          />
        )}

        {isLoading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
      
    </div>
  );
};

export default TicketPage;
