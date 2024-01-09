// SolutionDataTable.js
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import config from '../../configuration/config';
import ReactRating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

const SolutionDataTable = ({ tabledata, handleViewDetails, isDetailView = false }) => {
  
  const [columnsConfig, setColumnsConfig] = useState([]);

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
        
        setColumnsConfig(data[0].conf.conf);
      } else {
        // Handle the case where data is not in the expected format or empty
        console.error('Received unexpected format of data:', data);
      }
    })
    .catch(error => console.error('Error fetching column config:', error));
  }, []);
  

  const mergedColumns = useMemo(() => {
    // Merge your custom columns with the ones loaded from the configuration
    const customColumns = [
      {
        Header: 'Views',
        accessor: 'views',
        Cell: ({ value }) => <span>{value}</span> // Display the number of views
      },
      {
        Header: 'Usage',
        accessor: 'usage',
        Cell: ({ value }) => <span>{value}</span> // Display the number of views
      },
      {
        Header: 'Rating',
        accessor: 'average_rating',
        Cell: ({ value }) => {
          if (value === null) {
            return <span>Not rated</span>;
          }
          return (
            <ReactRating
              initialRating={value}
              readonly
              emptySymbol={<FontAwesomeIcon icon={farFaStar} style={{ color: 'lightgray', fontSize: '15px' }} />}
              fullSymbol={<FontAwesomeIcon icon={fasFaStar} style={{ color: 'gold', fontSize: '15px' }} />}
              fractions={2}
            />

          );
        }
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button className="confirm-button" onClick={() => handleViewDetails(row.original)}>View</button>
        ),
      }
    ];
  
    // Assuming columns from the configuration file is an array
    const configColumns = columnsConfig.map((column) => ({
      Header: column.Header,
      accessor: column.accessor,
    }));

    if (isDetailView) {
      let finalColumns = customColumns.filter(column => column.accessor !== 'action');
      return [...configColumns, ...finalColumns];
    } else {
      return [...configColumns, ...customColumns];
    }

  }, [columnsConfig]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
  } = useTable(
    {
      columns: mergedColumns || [], // Ensure columns is an array
      data: tabledata || [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const pageCount = Math.ceil(tabledata.length / pageSize);
  const pageOptions = useMemo(() => {
    return new Array(pageCount).fill(null).map((_, index) => index + 1);
  }, [pageCount]);

  return (
    <div>
      <div className="table-wrapper">
        <table {...getTableProps()} className="zebra -highlight react-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="group-header depth-0">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`column-header`}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
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
        {!isDetailView && (
            <div className="pagination">
              {/* Pagination controls */}
              <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions ? pageOptions.length : 1}
                  </strong>{' '}
                </span>
                <span>
                  | Go to page:{' '}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(page);
                    }}
                    style={{ width: '50px' }}
                  />
                </span>{' '}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            )}
      </div>
    </div>
  );
};

export default SolutionDataTable;

