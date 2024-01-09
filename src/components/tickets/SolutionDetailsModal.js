// SolutionDetailsModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import PDFViewer from './PDFViewer';
import config from '../../configuration/config';
//import '../../style/Styles.css';
import SolutionDataTable from './SolutionDataTable';
import ExpandedRowContent from '../tickets/ExpandedRowContent';
import ReactRating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const UserRating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);

  return (
    <ReactRating
      initialRating={rating}
      onChange={(value) => {
        setRating(value);
        onRate(value);
      }}
      emptySymbol={<FontAwesomeIcon icon={regularStar} style={{ color: 'lightgray', fontSize: '24px' }} />}
      fullSymbol={<FontAwesomeIcon icon={solidStar} style={{ color: 'gold', fontSize: '24px' }} />}
      fractions={2}
    />
  );
};

const SolutionDetailsModal = ({ solution, onClose, isFromTicket, onUse }) => {
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [media, setMedia] = useState([]);
    const [relatedTickets, setRelatedTickets] = useState([]);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);


    console.log('solution received object:', solution);

    // Prepare data for SolutionDataTable
    const solutionDataForTable = useMemo(() => [solution], [solution]);
    

    const handleTicketClick = async (ticketId) => {
      try {
        // Fetch the ticket details
        console.log('Fetch the ticket details:', ticketId);
        const response = await fetch(`${config.API_BASE_URL}/ticket-data/${ticketId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const ticketDetails = await response.json();

        console.log('ticket details:received', ticketDetails);
        // Set the selected ticket details
        setSelectedTicketDetails(ticketDetails.entry);
        // Show the ticket details modal
        setShowTicketDetailsModal(true);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };

    const handleUserRate = (newRating) => {
      // Submit the new rating to the backend
      
      submitRatingToServer(solution.solution_id, newRating)
        .then(() => {
          // Handle the successful rating submission
          console.log('Rating submitted successfully');
        })
        .catch((error) => {
          // Handle any errors during rating submission
          console.error('Error submitting rating:', error);
        });
    };

    const submitRatingToServer = async (solutionId, rating) => {
      const payload = {
        newRating: rating
      };
      const response = await fetch(`${config.API_BASE_URL}/solution-data/${solutionId}/rate`, {
        method: 'POST', // or PUT, depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      return response.json();
    };
    
    const onUseSolution = () => {
      onUse(solution);
    };

    useEffect(() => {
      console.log('solution to fetch media:', solution);
      async function fetchMedia() {
          try {
            
              const response = await fetch(`${config.API_BASE_URL}/media/solution/${solution.solution_id}`);
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const mediaData = await response.json();
              console.log('media json received:', mediaData);
              setMedia(mediaData);
          } catch (error) {
              console.error('Fetching media failed:', error);
          }
      }

      async function addView() {
        try {
          
            const response = await fetch(`${config.API_BASE_URL}/solution-data/${solution.solution_id}/view`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('updating views failed:', error);
        }
    }

    // Fetch related tickets
    const fetchRelatedTickets = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/ticket-solution/solution/${solution.solution_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const relatedTicketsData = await response.json();
        setRelatedTickets(relatedTicketsData);
      } catch (error) {
        console.error('Fetching related tickets failed:', error);
      }
    };

      if (solution.solution_id) {
          fetchMedia();
          addView();
          fetchRelatedTickets();
      }
  }, [solution.solution_id]);

  // Static PDFs and Videos
  const staticPDFs = ['test.pdf', 'test.pdf'];
  const staticVideos = ['video1.mp4', 'video2.mp4'];

  const handlePdfClick = (pdf) => {
    setSelectedPDF(pdf);
    console.log(`File path: ../data/${selectedPDF}`);
    return <Document file={`../data/${selectedPDF}`} />;
  };


  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Solution Details</h3>
        {/* Display solution details in a data table */}
        <SolutionDataTable tabledata={solutionDataForTable} isDetailView={true} />

        <div className="rating-container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Rate this Solution</h4>
          <UserRating initialRating={solution.userRating} onRate={handleUserRate} />
        </div>

        {/* Display ticket ids */}
        {relatedTickets.length > 0 && (
          <div className="ticketid_section">
            <h4>Related Tickets</h4>
            {relatedTickets.map((ticket, index) => (
              <button
                key={index}
                className="ticketid-button"
                onClick={() => handleTicketClick(ticket.ticket_id)}
              >
                {ticket.ticket_id}
              </button>
            ))}
          </div>
        )}


        {showTicketDetailsModal && selectedTicketDetails && (
          <ExpandedRowContent
            row={{ original: selectedTicketDetails }}
            onClose={() => setShowTicketDetailsModal(false)}
          />
        )}

        <div style={{ marginTop: 20 }}>
          <h4>Steps:</h4>
          <div className="steps-grid">
            {media.map((imageItem, index) => (
              <div key={index} className="step-container"> {/* Container for each step */}
                <img src={imageItem.media_url} alt={`Step ${index + 1}`} className="step-image" />
                <p className="step-comment">{imageItem.comment}</p> {/* Comment below image */}
              </div>
            ))}
          </div>
        </div>



        {/* Display PDFs */}
        <div className="pdf-section">
          <h4>PDFs</h4>
          {staticPDFs.map((pdf, index) => (
            
            <PDFViewer pdfURL={pdf} />
          ))}
        </div>

        {/* Display Videos */}
        <div className="video-section">
          <h4>Videos</h4>
          {staticVideos.map((video, index) => (
            <button key={index} className="video-button">
              {/* Display Video icon or use an appropriate Video icon */}
              🎥 {video}
            </button>
          ))}
        </div>

        <div className="button-container">
          <button className="cancel-button" onClick={onClose}>
            Close
          </button>
          {isFromTicket && (
            <button className="confirm-button" onClick={onUseSolution}>
              Confirm
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionDetailsModal;