import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { Button as MuiButton, TablePagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import { MoreOutlined } from '@ant-design/icons';

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

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// third-party
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table';

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
import TableFooter from 'themes/overrides/TableFooter';
function AddEmployeeModal({ open, handleClose, handleAddEmployee }) {
  const [formData, setFormData] = useState({
    company: '',
    employeeId: '',
    name: '',
    age: '',
    job: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    handleAddEmployee(formData);
    handleClose();
    setFormData({
      company: '',
      employeeId: '',
      name: '',
      age: '',
      job: '',
      email: '',
      phone: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth />
          <TextField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} fullWidth />
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} fullWidth />
          <TextField label="Job" name="job" value={formData.job} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={handleClose} color="secondary">
          Cancel
        </MuiButton>
        <MuiButton onClick={handleSubmit} variant="contained" color="primary">
          Add
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
}

AddEmployeeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddEmployee: PropTypes.func.isRequired
};

function DeleteAction({ row, table }) {
  const meta = table?.options?.meta;
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUnemployed = () => {
    // Handle the unemploy action here
    handleCloseMenu();
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* <Tooltip title="Delete">
        <IconButton color="error" onClick={handleDelete}>
          <CloseOutlined />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="More Options">
        <IconButton onClick={handleOpenMenu} color="primary">
          <MoreOutlined />
        </IconButton>
      </Tooltip>

      {/* More Options Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleUnemployed}>Unemployed</MenuItem>
      </Menu>
    </Stack>
  );
}

function EditAction({ row, table }) {
  const meta = table?.options?.meta;
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUnemployed = () => {
    // Handle the unemploy action here
    handleCloseMenu();
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* <Tooltip title="Delete">
        <IconButton color="error" onClick={handleDelete}>
          <CloseOutlined />
        </IconButton>
      </Tooltip> */}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // Track the current page
  const [pageSize, setPageSize] = useState(10); // Items per page
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5 // Default rows per page
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 items per page

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
      filters,
      pagination
    },
    onSortingChange: setSorting,
    onFiltersChange: setFilters,
    defaultColumn: {
      cell: RowEditable
    },
    onPaginationChange: (updater) => {
      table.setPagination((old) => ({
        ...old,
        ...updater
      }));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage
    }));
  };

  // To handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0 // Reset to the first page when rows per page change
    }));
  };

  // For filtering data based on current pagination
  const currentData = data.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize
  );

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
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button
                      onClick={() => setPagination({ pageIndex: pagination.pageIndex - 1, pageSize: pagination.pageSize })}
                      disabled={pagination.pageIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
                      disabled={pagination.pageIndex === table.getPageCount() - 1}
                    >
                      Next
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length} // Total count of items
          rowsPerPage={pagination.pageSize} // Use pageSize from pagination state
          page={pagination.pageIndex} // Use pageIndex from pagination state
          onPageChange={handleChangePage} // Page change handler
          onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
        />
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EDITABLE ROW WITH SORTING AND FILTERING ||============================== //

export default function Employee() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddEmployee = (newEmployee) => {
    setData((prevData) => [...prevData, newEmployee]);
  };
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
      desiredSalary: '55000',
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
      desiredSalary: '60000',
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
    },
    {
      company: 'Company D',
      employeeId: 'E126',
      name: 'Michael Brown',
      age: 40,
      oca: 'OCA126',
      resume: 'Resume Link 4',
      desiredSalary: '70000',
      revenue: 300000,
      hiredSince: '2018-10-12',
      profit: 170000,
      job: 'Project Lead',
      clientRate: 70,
      rate: 130,
      companyCharge: 18000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-15',
      sinceLastPaid: '10 days',
      maxWorkedHourLimit: 45
    },
    {
      company: 'Company E',
      employeeId: 'E127',
      name: 'Sara Williams',
      age: 29,
      oca: 'OCA127',
      resume: 'Resume Link 5',
      desiredSalary: '52000',
      revenue: 220000,
      hiredSince: '2020-05-05',
      profit: 110000,
      job: 'UI/UX Designer',
      clientRate: 55,
      rate: 105,
      companyCharge: 11000,
      bankNotes: 'Yes',
      contract: 'Contractual',
      lastPaid: '2025-01-05',
      sinceLastPaid: '20 days',
      maxWorkedHourLimit: 38
    },
    {
      company: 'Company F',
      employeeId: 'E128',
      name: 'David Clark',
      age: 32,
      oca: 'OCA128',
      resume: 'Resume Link 6',
      desiredSalary: '65000',
      revenue: 240000,
      hiredSince: '2019-07-22',
      profit: 130000,
      job: 'Software Engineer',
      clientRate: 65,
      rate: 110,
      companyCharge: 13000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-18',
      sinceLastPaid: '7 days',
      maxWorkedHourLimit: 42
    },
    {
      company: 'Company G',
      employeeId: 'E129',
      name: 'Emma Turner',
      age: 26,
      oca: 'OCA129',
      resume: 'Resume Link 7',
      desiredSalary: '48000',
      revenue: 170000,
      hiredSince: '2022-01-12',
      profit: 85000,
      job: 'Marketing Specialist',
      clientRate: 40,
      rate: 90,
      companyCharge: 10000,
      bankNotes: 'Yes',
      contract: 'Contractual',
      lastPaid: '2025-01-25',
      sinceLastPaid: '1 day',
      maxWorkedHourLimit: 37
    },
    {
      company: 'Company H',
      employeeId: 'E130',
      name: 'Chris Davis',
      age: 38,
      oca: 'OCA130',
      resume: 'Resume Link 8',
      desiredSalary: '58000',
      revenue: 200000,
      hiredSince: '2020-08-08',
      profit: 120000,
      job: 'Business Analyst',
      clientRate: 50,
      rate: 100,
      companyCharge: 14000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-10',
      sinceLastPaid: '15 days',
      maxWorkedHourLimit: 40
    },
    {
      company: 'Company I',
      employeeId: 'E131',
      name: 'Sophia Walker',
      age: 27,
      oca: 'OCA131',
      resume: 'Resume Link 9',
      desiredSalary: '55000',
      revenue: 210000,
      hiredSince: '2021-11-30',
      profit: 100000,
      job: 'Content Writer',
      clientRate: 55,
      rate: 95,
      companyCharge: 12000,
      bankNotes: 'Yes',
      contract: 'Contractual',
      lastPaid: '2025-01-12',
      sinceLastPaid: '14 days',
      maxWorkedHourLimit: 35
    },
    {
      company: 'Company J',
      employeeId: 'E132',
      name: 'Daniel Wilson',
      age: 34,
      oca: 'OCA132',
      resume: 'Resume Link 10',
      desiredSalary: '60000',
      revenue: 260000,
      hiredSince: '2017-04-18',
      profit: 140000,
      job: 'HR Manager',
      clientRate: 65,
      rate: 110,
      companyCharge: 16000,
      bankNotes: 'No',
      contract: 'Permanent',
      lastPaid: '2025-01-22',
      sinceLastPaid: '4 days',
      maxWorkedHourLimit: 48
    }
  ]);

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
      { header: 'Max Worked Hour Limit', accessorKey: 'maxWorkedHourLimit', dataType: 'text' },
      {
        header: 'Actions',
        id: 'delete',
        cell: DeleteAction,
        meta: {
          className: 'cell-center'
        }
      }
    ],
    []
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '16px' }}>
        <MuiButton variant="contained" color="primary" onClick={handleOpenModal} style={{ width: 'auto' }}>
          Add Employee
        </MuiButton>
      </Box>

      <ReactTable {...{ data, columns, setData }} />
      <AddEmployeeModal open={isModalOpen} handleClose={handleCloseModal} handleAddEmployee={handleAddEmployee} />
    </>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
