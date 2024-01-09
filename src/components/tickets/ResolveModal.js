// ResolveModal.js

import React, { useState, useMemo, useEffect} from 'react';
import { useTable} from 'react-table';
import config from '../../configuration/config';

const ResolveModal = ({ rowData, onSave, onClose }) => {
  
 const [newStatus, setNewStatus] = useState(null);
 const [columnsConfig, setColumnsConfig] = useState([]);
 const [mediaData, setMediaData] = useState([]);
 const [solutionFormValues, setSolutionFormValues] = useState({});

  const handleSave = () => {

    console.log('Saving with new status:', newStatus);
    
    // Pass the updated data to the onSave method
    onSave({ ...rowData, status: newStatus, mediaData, solutionFormValues});

    // Close the modal
    onClose();
  };

  const handleCancel = () => {
    // Close the modal without saving changes
    onClose();
  };

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Fleet', accessor: 'fleet' },
      { Header: 'Main Asset', accessor: 'mainAsset' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'System', accessor: 'system' },
      { Header: 'Sub System', accessor: 'subSystem' },
      { Header: 'Code Objet', accessor: 'codeObjet' },
      { Header: 'Issue', accessor: 'issue'},
      { Header: 'Comment', accessor: 'comment' },
      { Header: 'Status', accessor: 'status',
      Cell: ({ value }) => (
        <div 
          style={{
            backgroundColor: getStatusColor(value),
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center',
            color: 'white',
            width: '80%',
            margin: '0 auto',
            
          }}
        >
          {value}
        </div>
      ),
      },
      
     
    ],
    [] //empty dependency array to ensure the columns are memoized only once
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECORDED':
        return 'black';
      case 'SOLVED':
        return 'green';
      case 'OPEN':
        return 'brown';
      case 'PLANNED':
        return 'skyblue';
      case 'PLANNED/SOLVED':
        return '#caa630';
      case 'CLOSED 1ST LEVEL':
        return '#f24208';
      case 'CLOSED':
        return 'red';
      default:
        return 'white';
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: [rowData], // Wrap your single rowData object in an array
    },
  );
  
  // Solution part
  useEffect(() => {
    
    fetch(`${config.API_BASE_URL}/solution-config/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Assuming the API always returns at least one item
     
      if (data && data.length > 0) {
        console.log('solution conf received in resolve',data[0].conf.conf );
        setColumnsConfig(data[0].conf.conf);
      } else {
        // Handle the case where data is not in the expected format or empty
        console.error('Received unexpected format of data:', data);
      }
    })
    .catch(error => console.error('Error fetching column config:', error));
  }, []);
  
    // Handle form field changes
    const handleChange = (accessor, value) => {
      setSolutionFormValues(prev => ({
        ...prev,
        [accessor]: value,
      }));
    };

    const handleImageUpload = (e) => {

      if (mediaData.length >= 6) {
          // Optionally show an alert or a message to the user
          alert("You can upload up to 6 images.");
          return;
      }
  
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
          setMediaData(prevMediaData => [...prevMediaData, { image: reader.result, file, comment: '' }]);
      };
  
      reader.readAsDataURL(file);
    };
  
    const handleDeleteImage = (index) => {
      setMediaData(currentMediaData => currentMediaData.filter((_, i) => i !== index));
    };
    
    const handleCommentChange = (e, index) => {
      const newComment = e.target.value;
      setMediaData(currentMediaData =>
        currentMediaData.map((item, i) =>
          i === index ? { ...item, comment: newComment } : item
        )
      );
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Resolve Ticket</h3>
        {/* Display ticket details in a data table */}
        <table {...getTableProps()} className="zebra -highlight react-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="group-header depth-0">
              {headerGroup.headers.map((column) => (
                <th
                  className={`column-header`}
                >
                  {column.render('Header')}
                  
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row);

                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                </tr>
                );
            })}
        </tbody>


      </table>

        {/* Display "Choose New Status" label and drop-down list */}
        <div className="status-container">
          <label htmlFor="newStatus">Choose New Status:</label>
          <select
            id="newStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="RECORDED">RECORDED</option>
            <option value="SOLVED">SOLVED</option>
            <option value="OPEN">OPEN</option>
            <option value="PLANNED">PLANNED</option>
            <option value="PLANNED/SOLVED">PLANNED/SOLVED</option>
            <option value="CLOSED 1ST LEVEL">CLOSED 1ST LEVE</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <h3>Solution Details</h3>
        {columnsConfig.map((column) => {
          // Only create input fields for items with an inputType
          if (column.inputType) {
            return (
              <div key={column.accessor} className="form-group">
                <label htmlFor={column.accessor}>{column.Header}</label>
                <input
                  type={column.inputType}
                  id={column.accessor}
                  value={solutionFormValues[column.accessor] || ''}
                  onChange={(e) => handleChange(column.accessor, e.target.value)}
                />
              </div>
            );
          }
          return null;
        })}


      <h3 style={{ marginTop: '10px' }}>Add Medias</h3>

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <div className="image-grid">
        {mediaData.map((media, index) => (
            <div className="image-container" key={index}>
            <img src={media.image} alt={`Uploaded ${index}`} />
            <input 
                type="text" 
                placeholder="Add a comment..." 
                value={media.comment} 
                onChange={(e) => handleCommentChange(e, index)}
            />
            <div className="delete-icon" onClick={() => handleDeleteImage(index)}>
                <i className="fas fa-trash-alt"></i>
            </div>
            </div>
        ))}
        </div>
       
        
      <div className="button-container">
          
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleSave}>
          Confirm
          </button>
        </div>
      </div>

      

    </div>
  );
};

export default ResolveModal;
