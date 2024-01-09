import React, { useState, useEffect, useMemo } from 'react';
import config from '../../configuration/config';

// Separate component for expanded row content
function ExpandedRowContent({ row , onClose}) {
    const [ticketImages, setTicketImages] = useState([]);
  
    useEffect(() => {
      console.log('calling get ticke images', row.original.id);
      fetch(`${config.API_BASE_URL}/media/ticket/${row.original.id}`)
  
      .then(response => response.json())
      .then(data => {
        console.log('response get ticke images', data);
        setTicketImages(data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  
    }, [row]);
  
    
  
    return (
  
      <div className="modal-overlay">
        <div className="modal-container">
        <h3>Ticket {row.original.id} Details </h3>
  
        <div className="expanded-row">
        <table className="table-no-border">
          <tr>
            <td>
            <div className="ticket-details">
              <dl>
                {Object.entries(row.original).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt>{key}:</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
  
            </td>
            {ticketImages.length > 0 && (
              <td>
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
              </td>
              )}
          </tr>
        </table>
        <div className="button-container">
            
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
            
          </div>
        </div>
        
        
      </div>
      
        </div>
     
     
    );
  };


export default ExpandedRowContent;