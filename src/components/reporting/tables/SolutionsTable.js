import React from 'react';
import ReactRating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

const SolutionTable = ({ data }) => {
    console.log('in solution table data:', data);
    if (!data || data.length === 0) {
        return <div>No data available</div>;
      }

  return (
    <div>
    <h3 className="chart-title">Total solutions</h3>
    <table style={{ marginBottom: '20px' }}>
      <thead>
        <tr>
          <th>Total Solutions</th>
          <th>Total Objects</th>
          <th>Total Issues</th>
          <th>Views</th>
          <th>Usage</th>
          <th>Ratings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.totalSolutions}</td>
          <td>{data.totalObjects}</td>
          <td>{data.totalIssues}</td>
          <td>{data.totalViews}</td>
          <td>{data.totalUsage}</td>
          <td><ReactRating
              initialRating={data.averageRating} 
              readonly
              emptySymbol={<FontAwesomeIcon icon={farFaStar} style={{ color: 'lightgray', fontSize: '15px' }} />}
              fullSymbol={<FontAwesomeIcon icon={fasFaStar} style={{ color: 'gold', fontSize: '15px' }} />}
              fractions={2}
            /></td>
        </tr>
      </tbody>
    </table>
    
    </div>
    
  );
};

export default SolutionTable;
