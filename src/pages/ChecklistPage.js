// ChecklistPage.js
import '../style/Styles.css';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import CheckListTable from '../components/checklist/CheckListTable';
import CheckListInput from '../components/checklist/CheckListInput';
import CheckListEdit from '../components/checklist/CheckListEdit';
import ChecklistConfirmation from '../components/checklist/ChecklistConfirmation';

import config from '../configuration/config';

const ChecklistPage = () => {
  const [tableData, setTableData] = useState([]);
  const [tableConfig, setTableConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // New state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [showInputModal, setShowInputModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    document.title = 'Smart LogBook';

    const fetchConf = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/checklist-config/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTableConfig(data);

        console.log('Fetched checklist config:', data); // Debugging

      } catch (error) {
        console.error('Error fetching checklist data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/checklist-data/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTableData(data.map(item => ({
          ...item.entry, // Spread all properties of the entry object
          id: item.entryId // Add the entryId property
        })));


        console.log('Fetched checklist data:', tableData); // Debugging

      } catch (error) {
        console.error('Error fetching checklist data:', error);
      } finally {
        setLoading(false);
      }
    };

    setIsLoading(true);
    fetchConf();
    fetchData();
    setTimeout(() => setIsLoading(false), 500); // Keep the loader for at least 1s

  }, []); 

  // Extract headers from the first item
  const headers = useMemo(() => {
    if (tableConfig && tableConfig.length > 0) {
      return tableConfig[0].conf.headers;
    }
    return [];
  }, [tableConfig]);


  const apiCreateRow = (newRow) => {
    
    const confId = 1; 
  
    const requestBody = {
      entry: newRow,
      confId: confId
    };
  
    fetch(`${config.API_BASE_URL}/checklist-data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      
      const newRowWithId = { ...newRow, id: data.entryId };
      setTableData([...tableData, newRow]);

    })
    .catch(error => {
      console.error('Error adding new ticket:', error);
      // Handle any errors
    });
  };

  const apiUpdateRow = (editedData) => {
    fetch(`${config.API_BASE_URL}/checklist-data/${editedData.id}`, {
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
      const updatedData = tableData.map((row) =>
      row === editingRow ? editedData : row
    );
    setTableData(updatedData);
    })
    .catch(error => console.error('Error updating ticket:', error));
  };

  const handleAddRow = (rowData) => {
    //setTableData([...tableData, rowData]);
    apiCreateRow(rowData);
  };

  const handleEditRow = (row) => {
    setEditingRow(row);
    setShowEditModal(true);
  };

  const handleSaveEditedRow = (editedData) => {
    apiUpdateRow(editedData);
    setEditingRow(null);
    setShowEditModal(false);
  };

  const handleDeleteRow = (rowToDelete) => {
    setRowToDelete(rowToDelete);
    setShowDeleteConfirmation(true);
  };

  const apiDeleteRow = (rowToDelete) => {
    fetch(`${config.API_BASE_URL}/checklist-data/${rowToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      
    })
    .then(data => {
      // Handle successful delete 
      const updatedData = tableData.filter((row) => row !== rowToDelete);
      setTableData(updatedData);
    })
    .catch(error => console.error('Error deleting ticket:', error));
  };

  const handleConfirmDelete = () => {
    apiDeleteRow(rowToDelete);
    
    setRowToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setRowToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleInputRowClose = () => {
    setShowInputModal(false);
  };

  return (
    <div className="app">
      <div class="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Checklist</h3>
              
                
             
              <div className="card-tools">

                <button type="button" className="btn btn-block btn-success" dataToggle="modal" dataTarget="#modal-xl" onClick={() => setShowInputModal(true)}>
                Add New Entry
                 </button>
                
              </div>
            </div>
            <div class="card-body">
              <CheckListTable
                data={tableData}
                headers={headers}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
              />
            </div>
            
          </div>
        </div>
        
      </div>
          {/* CheckListInput Modal */}
        {showInputModal && (
          <div className="modal-overlay">
            
            <CheckListInput 
              onAddRow={handleAddRow} 
              onClose={handleInputRowClose} 
              config={headers}
            />

          </div>
        )}
        
        {showEditModal && editingRow !== null && (
          <div className="modal-overlay">
            <CheckListEdit
              rowData={editingRow}
              onSave={handleSaveEditedRow}
              onClose={() => {
                setEditingRow(null);
                setShowEditModal(false);
              }}
              config={headers}
            />
          </div>
        )}
        {showDeleteConfirmation && (
          <ChecklistConfirmation
            message="Are you sure you want to delete this row?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
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

export default ChecklistPage;