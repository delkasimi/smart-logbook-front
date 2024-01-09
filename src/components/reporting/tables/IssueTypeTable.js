import React from 'react';

const IssueTypeTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Aggregate issues and counts by type and subtype
  const issuesMap = new Map();

  data.forEach(({ issueType, issue }) => {
    if (!issuesMap.has(issueType)) {
      issuesMap.set(issueType, new Map());
    }
    const subMap = issuesMap.get(issueType);
    subMap.set(issue, (subMap.get(issue) || 0) + 1);
  });

  // Calculate total count for percentages
  const totalCount = data.length;

  // Convert the Map to an array for rendering and sort and slice the sub-issues
  const issuesArray = Array.from(issuesMap, ([issueType, subMap]) => {
    // Convert the sub-issues to an array, sort by count descending and take the top 3
    const subIssuesArray = Array.from(subMap)
      .map(([subType, count]) => ({ subType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // Only take the top 3 sub-issues

    return {
      issueType,
      subIssues: subIssuesArray
    };
  });

  return (

    <div className="chart-container">
    
      <div style={{ width: '100%', height: '400px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th className="vertical-text">Type</th>
                <th>Sub Type</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {issuesArray.map(({ issueType, subIssues }) => (
                <React.Fragment key={issueType}>
                  {subIssues.map((sub, index) => (
                    <tr key={sub.subType}>
                      {index === 0 && (
                        <td rowSpan={subIssues.length} className="vertical-text-cell">
                          <div>{issueType}</div>
                        </td>
                      )}
                      <td>{sub.subType}</td>
                      <td>{sub.count}</td>
                      <td>{((sub.count / totalCount) * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </div>
       
  );
};

export default IssueTypeTable;
