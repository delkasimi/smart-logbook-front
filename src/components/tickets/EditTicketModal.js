import React, { useState, useEffect } from 'react';
import config from '../../configuration/config';

const EditTicketModal = ({ rowData, onSave, onClose, columns }) => {
  const [editedData, setEditedData] = useState({ ...rowData });

  const [ticketImages, setTicketImages] = useState([]);

  useEffect(() => {
    console.log('calling get ticke images', rowData.id);
    fetch(`${config.API_BASE_URL}/media/ticket/${rowData.id}`)

    .then(response => response.json())
    .then(data => {
      console.log('response get ticke images', data);
      setTicketImages(data);
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });

  }, [rowData]);


  //function to access columns and options
  const findOptions = (columns, key, dependencyValue = null) => {
    const column = columns.find(col => col.key === key);
    if (!column) return [];
  
    if (column.dependancyColumn && dependencyValue !== null) {
      // For dependent fields, return the options based on the dependency value
      return column.options[dependencyValue] || [];
    }
  
    return column.options || [];
  };
  
  // Update the editedData when rowData changes
  useEffect(() => {
    setEditedData({ ...rowData });
  }, [rowData]);

  useEffect(() => {
    const issueOptions = findOptions(columns, 'issue', editedData.issueType);

    if (editedData.issueType && issueOptions.length > 0) {
      setEditedData((prevData) => ({
        ...prevData,
        issue: issueOptions[0] || '',
      }));
    }
  }, [editedData.issueType, columns]);

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
      <h3> Edit Ticket</h3>
        {/* Fleet */}
        <div className="form-group">
          <label htmlFor="fleet">Fleet:</label>
          <select
            id="fleet"
            value={editedData.fleet}
            onChange={(e) => handleInputChange('fleet', e.target.value)}
          >
            <option value="" disabled>
              Select Fleet
            </option>
            {findOptions(columns, 'fleet').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Main Asset */}
        <div className="form-group">
          <label htmlFor="mainAsset">Main Asset:</label>
          <select
            id="mainAsset"
            value={editedData.mainAsset}
            onChange={(e) => handleInputChange('mainAsset', e.target.value)}
          >
            <option value="" disabled>
              Select Main Asset
            </option>
            {editedData.fleet && findOptions(columns, 'mainAsset', editedData.fleet).map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={editedData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

        {/* System */}
        <div className="form-group">
          <label htmlFor="system">System:</label>
          <select
            id="system"
            value={editedData.system}
            onChange={(e) => handleInputChange('system', e.target.value)}
          >
            <option value="" disabled>
              Select System
            </option>
            {findOptions(columns, 'system').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Sub System */}
        <div className="form-group">
          <label htmlFor="subSystem">Sub System:</label>
          <select
            id="subSystem"
            value={editedData.subSystem}
            onChange={(e) => handleInputChange('subSystem', e.target.value)}
          >
            <option value="" disabled>
              Select Sub System
            </option>
            {editedData.system && findOptions(columns, 'subSystem', editedData.system).map((subSys)  => (
                <option key={subSys} value={subSys}>
                  {subSys}
                </option>
              ))}
          </select>
        </div>

        {/* Code Objet */}
        <div className="form-group">
          <label htmlFor="codeObjet">Code Objet:</label>
          <select
            id="codeObjet"
            value={editedData.codeObjet}
            onChange={(e) => handleInputChange('codeObjet', e.target.value)}
          >
            <option value="" disabled>
              Select Code Objet
            </option>
            {findOptions(columns, 'codeObjet').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Issue Type */}
        <div className="form-group">
          <label htmlFor="issueType">Issue Type:</label>
          <select
            id="issueType"
            value={editedData.issueType}
            onChange={(e) => handleInputChange('issueType', e.target.value)}
          >
            <option value="" disabled>
              Select Issue Type
            </option>
            {findOptions(columns, 'issueType').map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Issue */}
        <div className="form-group">
          <label htmlFor="issue">Issue:</label>
          <select
            id="issue"
            value={editedData.issue}
            onChange={(e) => handleInputChange('issue', e.target.value)}
          >
            <option value="" disabled>
              Select Issue
            </option>
            {editedData.issueType && findOptions(columns, 'issue', editedData.issueType).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <input
            type="text"
            id="comment"
            value={editedData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
          />
        </div>

        <div className="ticket-images">
              <div className="image-grid">
                {ticketImages.map(image => (
                  <div key={image.media_id}>
                    <img src={image.media_url} alt={`Ticket Image ${image.media_id}`} />
                    <p className="image-comment">{image.comment}</p> {/* Image comment */}
                  </div>
                ))}
              </div>
        </div>

        <div className="button-container">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
