// ReportingPage.js
import React, { useState, useEffect } from 'react';
import TicketFilter from '../components/tickets/TicketFilter';
import StatusCountBarChart from '../components/reporting/charts/StatusCountBarChart';
import IssuesPerSystemStackedBarChart from '../components/reporting/charts/IssuesPerSystemStackedBarChart';
import IssueTypeDonutChart from '../components/reporting/charts/IssueTypeDonutChart';
import TopIssuesBarChart from '../components/reporting/charts/TopIssuesBarChart';
import IssueDensityHeatmap from '../components/reporting/charts/IssueDensityHeatmap';
import IssueTypeTable from '../components/reporting/tables/IssueTypeTable';
import IssuesPerSystemTable from '../components/reporting/tables/IssuesSystemsTable';
import config from '../configuration/config';

import SolutionTable from '../components/reporting/tables/SolutionsTable';
import SolutionPerIssuesBarChart from '../components/reporting/charts/SolutionsPerIssuesBarChart';
import TopPopularSolutions from '../components/reporting/charts/TopPopularSolutions';
import TopRatedSolutions from '../components/reporting/tables/TopeRatedSolutions';



const ReportingPage = () => {
  const [ticketConfig, setTicketConfig] = useState({ columns: [] });
  const [filterValues, setFilterValues] = useState(null);
  const [ticketDataState, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [showStatusCountBarChart, setShowStatusCountBarChart] = useState(true);
  const [showIssuesPerSystemStackedBarChart, setShowIssuesPerSystemStackedBarChart] = useState(true);
  const [showIssueTypeDonutChart, setShowIssueTypeDonutChart] = useState(true);
  const [showTopIssuesBarChart, setShowTopIssuesBarChart] = useState(true);
  const [showIssueDensityHeatmap, setShowIssueDensityHeatmap] = useState(true);

  const [solutions, setSolutions] = useState({});
  const [solutionsTableData, setSolutionsTableData] = useState([]);
  const [solutionsPerIssue, setSolutionsPerIssue] = useState([]);
  const [topPopularSolutions, setTopPopularSolutions] = useState([]);
  const [topRatedSolutions, setTopRatedSolutions] = useState([]);


  const [activeTab, setActiveTab] = useState('ticketReporting'); // 'ticketReporting' or 'otherTab'

  const [isLoading, setIsLoading] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

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
      //setLoading(true);
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
        //setLoading(false);
      }
    };

    const fetchSolutions = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/solution-data/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('solution afte fetch', data);
        const formattedSolutions = data.map(solution => ({
          ...solution.data,
          solution_id: solution.solution_id,
          views: solution.views,
          usage: solution.usage,
          rating: solution.rating,
          average_rating: solution.average_rating,
          created_at: solution.created_at,
          updated_at: solution.updated_at,
        }));
        // Set state for solutions and any filtered views you need
        setSolutions(formattedSolutions);
        console.log('solution afte fetch set', formattedSolutions);
        setSolutionsTableData(prepareDataForSolutionTable(formattedSolutions));
        setSolutionsPerIssue(prepareDataForSolutionPerIssuesBarChart(formattedSolutions));
        setTopPopularSolutions(prepareDataForTopPopularSolutions(formattedSolutions));
        setTopRatedSolutions(prepareDataForTopRatedSolutions(formattedSolutions));

      } catch (error) {
        console.error('Error fetching solutions:', error);
      }
    };
    
    setIsLoading(true);
    fetchConf();
    fetchData();
    fetchSolutions();
    setTimeout(() => setIsLoading(false), 500)

  }, []);

  const prepareDataForSolutionTable = (solutions) => {
    console.log('preparing solutions', solutions);
    const totalSolutions = solutions.length;
    const totalViews = solutions.reduce((acc, curr) => acc + curr.views, 0);
    const totalUsage = solutions.reduce((acc, curr) => acc + curr.usage, 0);
    const issuesSet = new Set();
    const objectsSet = new Set();
    let totalRatingSum = 0;

    solutions.forEach(solution => {
      issuesSet.add(solution.issue);
      objectsSet.add(solution.codeObjet);
      totalRatingSum += solution.average_rating;
    });

    const totalIssues = issuesSet.size;
    const totalObjects = objectsSet.size;
    const averageRating = totalSolutions > 0 ? totalRatingSum / totalSolutions : 0;

    return {
      totalSolutions,
      totalViews,
      totalUsage,
      totalIssues,
      totalObjects,
      averageRating
    };

  };
  
  const prepareDataForSolutionPerIssuesBarChart = (solutions) => {
    console.log('in prepar per issue bar chart solutions', solutions);
    const issuesMap = new Map();
    
    solutions.forEach((solution) => {
      if (issuesMap.has(solution.issue)) {
        issuesMap.set(solution.issue, issuesMap.get(solution.issue) + 1);
      } else {
        issuesMap.set(solution.issue, 1);
      }
    });
  
    return Array.from(issuesMap, ([issue, count]) => ({ issue, count }));
  };

  const prepareDataForTopPopularSolutions = (solutions) => {
    console.log('in prepar top popular', solutions);
    const sortedSolutions = [...solutions].sort((a, b) => b.usage - a.usage);
    return sortedSolutions.slice(0, 10).map(solution => ({
      solution_id: solution.solution_id,
      usage: solution.usage,
      issue: solution.issue,
      codeObjet: solution.codeObjet

    }));
  };

  const prepareDataForTopRatedSolutions = (solutions) => {
    console.log('in prepar top popular', solutions);
    const sortedSolutions = [...solutions].sort((a, b) => b.average_rating - a.average_rating);
    return sortedSolutions.slice(0, 10).map(solution => ({
      solution_id: solution.solution_id,
      usage: solution.usage,
      issue: solution.issue,
      codeObjet: solution.codeObjet,
      averageRating: solution.average_rating
    }));
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

  const processDataForHeatMap = (rawData) => {
    const dataMap = new Map();
  
    rawData.forEach((item) => {
      const { system, issue } = item;
      if (!dataMap.has(system)) {
        dataMap.set(system, {});
      }
      if (!dataMap.get(system)[issue]) {
        dataMap.get(system)[issue] = 0;
      }
      dataMap.get(system)[issue] += 1;
    });
  
    const processedData = [];
    dataMap.forEach((counts, system) => {
      Object.keys(counts).forEach((issue) => {
          processedData.push({
            system,
            issue,
            count: counts[issue],
          });
      });
    });

    return processedData;
  };

  return (
    <div className="app">
        <TicketFilter columns={ticketConfig.columns} onFilterChange={handleFilterChange} filter={filterValues}/>

        <div className="tab-header">
            <div 
              className={`tab ${activeTab === 'ticketReporting' ? 'active' : ''}`}
              onClick={() => handleTabClick('ticketReporting')}
            >
              Ticket Reporting
            </div>
            <div 
              className={`tab ${activeTab === 'solutionReporting' ? 'active' : ''}`}
              onClick={() => handleTabClick('solutionReporting')}
            >
              Solutions Reporting
            </div>
        </div>

        {activeTab === 'ticketReporting' && (
            <>
              <div className="chart-grid">

                <div className="chart-cell">
                  <IssueTypeTable data={filteredData} />
                  <IssuesPerSystemTable data={filteredData} />
                </div>

                <div className="chart-cell">
                  {showStatusCountBarChart && 
                    <StatusCountBarChart data={filteredData} />
                  } 
                    {showTopIssuesBarChart && 
                    <TopIssuesBarChart data={filteredData} />
                    }
                </div>


                <div className="chart-cell">
                  {showIssueTypeDonutChart && 
                    
                      <IssueTypeDonutChart data={filteredData} />
                    
                  } 
                  {showIssuesPerSystemStackedBarChart && 
                      <IssuesPerSystemStackedBarChart data={filteredData} />
                  }
                </div>

             </div>
            </>
          )}
          {activeTab === 'solutionReporting' && (
            <div className="chart-grid">

              <div className="chart-cell">
                <SolutionTable data={solutionsTableData} />
                <TopRatedSolutions data={topRatedSolutions} />
              </div>
              <div className="chart-cell">
                <SolutionPerIssuesBarChart data={solutionsPerIssue} />
              </div>
              <div className="chart-cell">
                <TopPopularSolutions data={topPopularSolutions} />
              </div>
            </div>
          )}
          {isLoading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
        </div>
  );
};

export default ReportingPage;