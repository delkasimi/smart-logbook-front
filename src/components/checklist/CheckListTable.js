// CheckListTable.js
import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditModal from "./CheckListEdit";

const CheckListTable = ({
  data,
  headers,
  onEditRow,
  onDeleteRow,
  setEditingRow,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

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
      columns: useMemo(() => headers, [headers]),
      data: useMemo(() => data, [data]),
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination
  );

  const pageCount = Math.ceil(data.length / pageSize);
  const pageOptions = useMemo(() => {
    return new Array(pageCount).fill(null).map((_, index) => index + 1);
  }, [pageCount]);

  const handleEditRow = (row) => {
    setEditingRow(row);
    setShowEditModal(true);
  };

  return (
    <div className="table-wrapper">
      <table {...getTableProps()} className="zebra -highlight react-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className={`group-header depth-${headerGroup.headers[0].depth}`}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`column-header`}
                  style={{ border: "2px solid black" }} // Add this line for thick borders
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onMouseEnter={() => {
                  // ...
                }}
                onMouseLeave={() => {
                  // ... Y
                }}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      backgroundColor:
                        //cell.column.id === 'yourColumnId' // Replace 'yourColumnId' with the actual column id
                        cell.value === "<MINI[" ||
                        cell.value === ">MAXI[" ||
                        cell.value === "Mauvais"
                          ? "#ee020275"
                          : cell.value === "<MINI-25[" ||
                            cell.value === "<25-50["
                          ? "#fffacd"
                          : cell.value === "<75-MAXI[" ||
                            cell.value === "<50-75[" ||
                            cell.value === "Bon"
                          ? "#00bc8c6e"
                          : "transparent", // Default background color
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
                <td>
                  <button
                    className="edit-button"
                    onClick={() => onEditRow(row.original)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => onDeleteRow(row.original)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showEditModal && setEditingRow !== null && (
        <EditModal
          rowData={setEditingRow}
          onSave={(editedData) => {
            onEditRow(editedData);
            setShowEditModal(false);
          }}
          onClose={() => {
            setEditingRow(null);
            setShowEditModal(false);
          }}
        />
      )}

      <div className="pagination">
        {/* Pagination controls */}
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions ? pageOptions.length : 1}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "50px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[15, 20, 30, 40, 50].map((pageSize) => (
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

export default CheckListTable;
