import React from 'react';
import ReactRating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

const TopRatedSolutions = ({ data }) => {
    console.log('in TopRatedSolutions  data:', data);
    if (!data || data.length === 0) {
        return <div>No data available</div>;
      }

      return (
        <div className="chart-container">
        <h3 className="chart-title">Top Rated Solutions</h3>
          <div style={{ width: '100%', height: '400px' }}>
            <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                <th>Solution ID</th>
                <th>Total Usage</th>
                <th>Issue</th>
                <th>Code Objet</th>
                <th>Ratings</th>
                </tr>
              </thead>
              <tbody>
                {data.map(({ solution_id, usage, issue, codeObjet, averageRating }) => (
                  <tr key={solution_id}>
                    <td>{solution_id}</td>
                    <td>{usage}</td>
                    <td>{issue}</td>
                    <td>{codeObjet}</td>
                    <td><ReactRating
                        initialRating={averageRating} 
                        readonly
                        emptySymbol={<FontAwesomeIcon icon={farFaStar} style={{ color: 'lightgray', fontSize: '15px' }} />}
                        fullSymbol={<FontAwesomeIcon icon={fasFaStar} style={{ color: 'gold', fontSize: '15px' }} />}
                        fractions={2}
                        /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      );
  return (
    
      <table>
      <thead>
        <tr>
          
        </tr>
      </thead>
      <tbody>
        <tr>
          
        </tr>
      </tbody>
    </table>
    

    
  );
};

export default TopRatedSolutions;
