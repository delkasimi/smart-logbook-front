import React, { useEffect, useState } from 'react';
import SolutionDataTable from '../components/tickets/SolutionDataTable'; // Adjust the path as per your project structure
import config from '../configuration/config'; // Adjust the path as per your project structure
import SolutionDetailsModal from '../components/tickets/SolutionDetailsModal';
import SolutionsFilter from '../components/solutions/SolutionsFilter'; // Adjust the path as per your project structure


const SolutionsPage = () => {
  const [solutions, setSolutions] = useState([]);
  const [isSolutionDetailsModalOpen, setSolutionDetailsModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  const [filter, setFilter] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  
  const [filterColumns, setFilterColumns] = useState([
    {
      Header: 'Code Object',
      accessor: 'codeObjet',
      inputType: 'select',
      options: [] // To be populated dynamically
    },
    {
      Header: 'Code Issue',
      accessor: 'issue',
      inputType: 'select',
      options: [] // To be populated dynamically
    },
    {
      Header: 'Date',
      accessor: 'date',
      inputType: 'date'
    }
  ]);
  
  useEffect(() => {
    setIsLoading(true);
    fetch(`${config.API_BASE_URL}/solution-data`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data.map(item => ({
          ...item.data,        // Spread all properties of the item's data object
          solution_id: item.solution_id, // Add the solution_id property
          views: item.views, // Add the views property from the solution object
          usage: item.usage,
          average_rating: item.average_rating

        }));

            // Generate unique options for 'Code Object' and 'Code Issue'
        const codeObjetOptions = Array.from(new Set(formattedData.map(item => item.codeObjet))).filter(Boolean);
        const issueOptions = Array.from(new Set(formattedData.map(item => item.issue))).filter(Boolean);

        // Update filterColumns with dynamic options
        setFilterColumns(oldColumns => oldColumns.map(column => {
            if (column.accessor === 'codeObjet') {
            return { ...column, options: codeObjetOptions };
            } else if (column.accessor === 'issue') {
            return { ...column, options: issueOptions };
            }
            return column;
        }));

        setSolutions(formattedData);
        setFilteredSolutions(formattedData);
      })
      .catch(error => {
        console.error('Error fetching solutions:', error);
      })
      .finally (setTimeout(() => setIsLoading(false), 500)); 
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter);
  };

  const applyFilter = (newFilter) => {
    const filtered = solutions.filter(solution => {
      return Object.entries(newFilter).every(([key, value]) => {
        return value === '' || solution[key] === value;
      });
    });
    setFilteredSolutions(filtered);
  };

  const handleviewSolutionDetails = (solution) => {
    openSolutionDetailsModal(solution);
  };

  const openSolutionDetailsModal = (solution) => {
    setSelectedSolution(solution);
    setSolutionDetailsModalOpen(true);
  };

  const handleAvailableSolutionsModalClose = () => {
    closeSolutionDetailsModal();
  };

  const closeSolutionDetailsModal = () => {
    setSelectedSolution(null);
    setSolutionDetailsModalOpen(false);
  };

  return (
    <div className="app">

<div class="row">
      
      <div className="col-12">
        <div className="card">
        <SolutionsFilter onFilterChange={handleFilterChange} columns={filterColumns} filter={filter} />
        </div>
      </div>
    </div>
    <div class="row">
    
        <div className="col-12">
          <div className="card">

              <div className="card-header">
                <h3 className="card-title">Solutions</h3>
                
              </div>
         
            <div class="card-body">
              <SolutionDataTable tabledata={filteredSolutions} handleViewDetails={handleviewSolutionDetails} />
                
            </div>
          
          </div>
        </div>
      </div>
        {isSolutionDetailsModalOpen && (
          <SolutionDetailsModal
            solution={selectedSolution}
            onClose={handleAvailableSolutionsModalClose}
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

export default SolutionsPage;
