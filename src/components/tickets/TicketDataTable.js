// TicketDataTable.js
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ExpandedRowContent from './ExpandedRowContent';


const TicketDataTable = ({ data, onEditRow, onResolveRow, columns  }) => {
  
  const [rowStates, setRowStates] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);


  const mergedColumns = useMemo(() => {
    // Merge your custom columns with the ones loaded from the configuration
    const customColumns = [
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <div className="button-container">
              <button className="edit-button" onClick={() => onEditRow(row.original)}>
                <FaEdit />
              </button>
              <button className="resolve-button" onClick={() => onResolveRow(row.original)}>
                Resolve
              </button>
            </div>
          </>
        ),
      },
    ];
  
    // Assuming columns from the configuration file is an array
    const configColumns = columns.map((column) => ({
      Header: column.label,
      accessor: column.key, // Assuming 'key' is the property containing the unique identifier
      id: column.key,
    }));
  
    // Assuming columns from the configuration file is an array
    return [...configColumns, ...customColumns];
  }, [columns, onEditRow, onResolveRow]);

  const handleRowClick = (row, event) => {

    // Check if the clicked element or any of its parents is a button
  if (event.target.closest('button')) {
    // If it's a button, stop the function
    return;
  }

    // Create a new object with all rows set to not expanded
    const newRowStates = Object.fromEntries(
      Object.keys(rowStates).map((id) => [id, false])
    );
  
    // Toggle the expanded class for the clicked row
  newRowStates[row.id] = !rowStates[row.id];
  
    // Set the expanded row and its details
    setRowStates(newRowStates);

  };

  const handleRowClose = () => {
    // Create a new object with all rows set to not expanded
    const newRowStates = Object.fromEntries(
      Object.keys(rowStates).map((id) => [id, false])
    );
  
    // Set the expanded row and its details
    setRowStates(newRowStates);
    setExpandedRow(null);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'RECORDED':
        return 'black'; // Set the background color for 'RECORDED'
      case 'SOLVED':
        return 'green'; // Set the background color for 'PENDING'
      case 'OPEN':
        return 'brown'; // Set the background color for 'FAILED'
      case 'PLANNED':
        return 'SKYBLUE'; // Set the background color for 'FAILED'
        case 'PLANNED/SOLVED':
          return '#caa630'; // Set the background color for 'PENDING'
        case 'CLOSED 1ST LEVEL':
          return '#f24208'; // Set the background color for 'FAILED'
        case 'CLOSED':
          return 'red'; // Set the background color for 'FAILED'
      default:
        return 'white'; // Default background color
    }
  };

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
      data: data || [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const pageCount = Math.ceil(data.length / pageSize);

  const pageOptions = useMemo(() => {
    return new Array(pageCount).fill(null).map((_, index) => index + 1);
  }, [pageCount]);

  

  return (
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
              <>
                <tr
                  onClick={(event) => handleRowClick(row.original, event )}
                  style={{ cursor: 'pointer' }}
                  className={`${
                    rowStates[row.original.id] ? 'expanded-row' : ''
                  }`}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                    {cell.column.id === 'status' ? (
                      <div
                        style={{
                          backgroundColor: getStatusColor(cell.value),
                          padding: '4px',
                          borderRadius: '4px',
                          color: 'white',
                          display: 'inline-block',
                        }}
                      >
                        {cell.value}
                      </div>
                    ) : (
                      cell.render('Cell')
                    )}
                  </td>
                  ))}
                </tr>

                {rowStates[row.original.id] && (
                
                  <ExpandedRowContent row={row} onClose={handleRowClose} />
                
              )}


              </>
            );
          })}

        </tbody>
      </table>
      <div className="pagination">
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
    </div>
  );
};

export default TicketDataTable;
