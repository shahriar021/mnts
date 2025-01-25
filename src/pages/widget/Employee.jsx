import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// third-party
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, RowEditable, HeaderSort } from 'components/third-party/react-table';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditTwoTone from '@ant-design/icons/EditTwoTone';
import SendOutlined from '@ant-design/icons/SendOutlined';
import Button from 'themes/overrides/Button';

function EditAction({ row, table }) {
  const meta = table?.options?.meta;
  const setSelectedRow = (e) => {
    meta?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));

    // @ts-ignore
    meta?.revertData(row.index, e?.currentTarget.name === 'cancel');
  };

  const handleDelete = () => {
    meta?.deleteRow(row);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Delete">
        <IconButton color="error" onClick={handleDelete}>
          <CloseOutlined />
        </IconButton>
      </Tooltip>
      {meta?.selectedRow[row.id] && (
        <Tooltip title="Cancel">
          <IconButton color="error" name="cancel" onClick={setSelectedRow}>
            <CloseOutlined />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={meta?.selectedRow[row.id] ? 'Save' : 'Edit'}>
        <IconButton
          color={meta?.selectedRow[row.id] ? 'success' : 'primary'}
          sx={{ '&::after': { content: 'none' } }}
          onClick={setSelectedRow}
        >
          {meta?.selectedRow[row.id] ? <SendOutlined /> : <EditTwoTone />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function ReactTable({ columns, data, setData }) {
  const [originalData, setOriginalData] = useState(() => [...data]);
  const [selectedRow, setSelectedRow] = useState({});
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({});

  const deleteRow = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.original.name}?`)) {
      setData((prevData) => prevData.filter((item) => item.employeeId !== row.original.employeeId));
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      filters
    },
    onSortingChange: setSorting,
    onFiltersChange: setFilters,
    defaultColumn: {
      cell: RowEditable
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      selectedRow,
      setSelectedRow,
      deleteRow,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
        } else {
          setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    },
    debugTable: true
  });

  let headers = [];
  table.getAllColumns().map(
    (columns) =>
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        key: columns.columnDef.accessorKey
      })
  );

  // Handling the input for column filters
  const handleFilterChange = (e, columnId) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [columnId]: value || undefined // Empty value removes the filter
    }));
    table.setColumnFilters((oldFilters) =>
      [
        ...oldFilters.filter((filter) => filter.id !== columnId), // Remove existing filter for the column
        value ? { id: columnId, value } : null // Add new filter if a value exists
      ].filter(Boolean)
    ); // Ensure no null entries
  };

  return (
    <MainCard
      content={false}
      title="Editable Row with Sorting & Filtering"
      secondary={
        <CSVExport
          {...{
            data: table.getSortedRowModel().rows.map((row) => row.original),
            headers,
            filename: 'editable-row-sorting-filtering.csv'
          }}
        />
      }
    >
      <ScrollX>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            cursor: header.column.getCanSort() ? 'pointer' : 'default'
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Box>
                        {header.column.getCanSort() && <HeaderSort column={header.column} />}
                      </Stack>
                      {/* Filter Input */}
                      {header.column.getCanFilter() && (
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder={`Filter ${header.column.columnDef.header}`}
                          value={filters[header.column.id] || ''}
                          onChange={(e) => handleFilterChange(e, header.column.id)}
                          sx={{ width: '100%' }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EDITABLE ROW WITH SORTING AND FILTERING ||============================== //

export default function Employee() {
  const [data, setData] = useState(() => [
    {
      company: 'Company A',
      employeeId: 'E123',
      name: 'John Doe',
      age: 30,
      oca: 'OCA123',
      resume: 'Resume Link',
      desiredSalary: '50000',
      revenue: 200000,
      hiredSince: '2020-01-01',
      profit: 100000,
      job: 'Developer',
      clientRate: 50,
      rate: 100,
      companyCharge: 10000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-01',
      sinceLastPaid: '30 days',
      maxWorkedHourLimit: 40
    },
    {
      company: 'Company B',
      employeeId: 'E124',
      name: 'Jane Smith',
      age: 28,
      oca: 'OCA124',
      resume: 'Resume Link 2',
      desiredSalary: 55000,
      revenue: 180000,
      hiredSince: '2021-06-15',
      profit: 90000,
      job: 'Designer',
      clientRate: 45,
      rate: 95,
      companyCharge: 12000,
      bankNotes: 'Yes',
      contract: 'Contractual',
      lastPaid: '2025-01-10',
      sinceLastPaid: '15 days',
      maxWorkedHourLimit: 35
    },
    {
      company: 'Company C',
      employeeId: 'E125',
      name: 'Alice Johnson',
      age: 35,
      oca: 'OCA125',
      resume: 'Resume Link 3',
      desiredSalary: 60000,
      revenue: 250000,
      hiredSince: '2019-03-20',
      profit: 150000,
      job: 'Manager',
      clientRate: 60,
      rate: 120,
      companyCharge: 15000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-20',
      sinceLastPaid: '5 days',
      maxWorkedHourLimit: 50
    }
  ]);

  const handleAddRow = () => {
    const newRow = {
      company: '',
      employeeId: `E${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
      name: '',
      age: null,
      oca: '',
      resume: '',
      desiredSalary: '',
      revenue: 0,
      hiredSince: '',
      profit: 0,
      job: '',
      clientRate: 0,
      rate: 0,
      companyCharge: 0,
      bankNotes: '',
      contract: '',
      lastPaid: '',
      sinceLastPaid: '',
      maxWorkedHourLimit: 0
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Actions',
        id: 'edit',
        cell: EditAction,
        meta: {
          className: 'cell-center'
        }
      },

      { header: 'Company', accessorKey: 'company', dataType: 'text' },
      { header: 'Employee ID', accessorKey: 'employeeId', dataType: 'text' },
      { header: 'Name', accessorKey: 'name', dataType: 'text' },
      { header: 'Age', accessorKey: 'age', dataType: 'text' },
      { header: 'OCA', accessorKey: 'oca', dataType: 'text' },
      { header: 'Resume', accessorKey: 'resume', dataType: 'text' },
      { header: 'Desired Salary', accessorKey: 'desiredSalary', dataType: 'text' },
      { header: 'Revenue', accessorKey: 'revenue', dataType: 'text' },
      { header: 'Hired Since', accessorKey: 'hiredSince', dataType: 'text' },
      { header: 'Profit', accessorKey: 'profit', dataType: 'text' },
      { header: 'Job', accessorKey: 'job', dataType: 'text' },
      { header: 'Client Rate', accessorKey: 'clientRate', dataType: 'text' },
      { header: 'Rate', accessorKey: 'rate', dataType: 'text' },
      { header: 'Employee ID', accessorKey: 'employeeId', dataType: 'text' },
      { header: 'Company Charge', accessorKey: 'companyCharge', dataType: 'text' },
      { header: 'Bank Notes', accessorKey: 'bankNotes', dataType: 'text' },
      { header: 'Contract', accessorKey: 'contract', dataType: 'text' },
      { header: 'Last Paid', accessorKey: 'lastPaid', dataType: 'date' },
      { header: 'Since Last Paid', accessorKey: 'sinceLastPaid', dataType: 'text' },
      { header: 'Max Worked Hour Limit', accessorKey: 'maxWorkedHourLimit', dataType: 'text' }
    ],
    []
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Employee Management</h2>
        <div
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
          onClick={handleAddRow}
        >
          Add Employee
        </div>
      </Box>
      <ReactTable {...{ data, columns, setData }} />
    </>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
