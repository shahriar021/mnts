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
// function AddEmployeeModal({ open, handleClose, handleAddEmployee }) {
//   const [formData, setFormData] = useState({
//     company: '',
//     employeeId: '',
//     name: '',
//     age: '',
//     job: '',
//     email: '',
//     phone: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     handleAddEmployee(formData);
//     handleClose();
//     setFormData({
//       company: '',
//       employeeId: '',
//       name: '',
//       age: '',
//       job: '',
//       email: '',
//       phone: ''
//     });
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>Add Employee</DialogTitle>
//       <DialogContent>
//         <Stack spacing={2}>
//           <TextField label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth />
//           <TextField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} fullWidth />
//           <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
//           <TextField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} fullWidth />
//           <TextField label="Job" name="job" value={formData.job} onChange={handleChange} fullWidth />
//           <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
//           <TextField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} fullWidth />
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <MuiButton onClick={handleClose} color="secondary">
//           Cancel
//         </MuiButton>
//         <MuiButton onClick={handleSubmit} variant="contained" color="primary">
//           Add
//         </MuiButton>
//       </DialogActions>
//     </Dialog>
//   );
// }
function AddEmployeeModal({ open, handleClose, handleAddEmployee }) {
  const [formData, setFormData] = useState({
    contactId: '',
    phone: '',
    email: '',
    name: '',
    contactType: '',
    companies: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    handleAddEmployee(formData);
    handleClose();
    setFormData({
      contactId: '',
      phone: '',
      email: '',
      name: '',
      contactType: '',
      companies: '',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Contact ID" name="contactId" value={formData.contactId} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Contact Type" name="contactType" value={formData.contactType} onChange={handleChange} fullWidth />
          <TextField label="Companies" name="companies" value={formData.companies} onChange={handleChange} fullWidth />
          <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={3} fullWidth />
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
      <Tooltip title="Delete">
        <IconButton color="error" onClick={handleDelete}>
          <CloseOutlined />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="More Options">
        <IconButton onClick={handleOpenMenu} color="primary">
          <MoreOutlined />
        </IconButton>
      </Tooltip> */}

      {/* More Options Menu */}
      {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleUnemployed}>Unemployed</MenuItem>
      </Menu> */}
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
      setData((prevData) => prevData.filter((_, index) => index !== row.index));
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

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddEmployee = (newEmployee) => {
    setData((prevData) => [...prevData, newEmployee]);
  };
  const [data, setData] = useState(() => [
    {
      contactId: 'C001',
      phone: '123-456-7890',
      email: 'john.doe@companya.com',
      name: 'John Doe',
      contactType: 'Employee',
      companies: 'Company A',
      notes: 'Hired since 2020, Developer with excellent skills.'
    },
    {
      contactId: 'C002',
      phone: '234-567-8901',
      email: 'jane.smith@companyb.com',
      name: 'Jane Smith',
      contactType: 'Employee',
      companies: 'Company B',
      notes: 'Creative Designer, hired in 2021.'
    },
    {
      contactId: 'C003',
      phone: '345-678-9012',
      email: 'alice.johnson@companyc.com',
      name: 'Alice Johnson',
      contactType: 'Employee',
      companies: 'Company C',
      notes: 'Manager with over 5 years of experience.'
    },
    {
      contactId: 'C004',
      phone: '456-789-0123',
      email: 'michael.brown@companyd.com',
      name: 'Michael Brown',
      contactType: 'Employee',
      companies: 'Company D',
      notes: 'Project Lead since 2018.'
    },
    {
      contactId: 'C005',
      phone: '567-890-1234',
      email: 'sara.williams@companye.com',
      name: 'Sara Williams',
      contactType: 'Employee',
      companies: 'Company E',
      notes: 'UI/UX Designer, hired in 2020.'
    },
    {
      contactId: 'C006',
      phone: '678-901-2345',
      email: 'david.clark@companyf.com',
      name: 'David Clark',
      contactType: 'Employee',
      companies: 'Company F',
      notes: 'Software Engineer, joined in 2019.'
    },
    {
      contactId: 'C007',
      phone: '789-012-3456',
      email: 'emma.turner@companyg.com',
      name: 'Emma Turner',
      contactType: 'Employee',
      companies: 'Company G',
      notes: 'Marketing Specialist, hired in 2022.'
    },
    {
      contactId: 'C008',
      phone: '890-123-4567',
      email: 'chris.davis@companyh.com',
      name: 'Chris Davis',
      contactType: 'Employee',
      companies: 'Company H',
      notes: 'Business Analyst, joined in 2020.'
    },
    {
      contactId: 'C009',
      phone: '901-234-5678',
      email: 'sophia.walker@companyi.com',
      name: 'Sophia Walker',
      contactType: 'Employee',
      companies: 'Company I',
      notes: 'Content Writer, hired in 2021.'
    },
    {
      contactId: 'C010',
      phone: '012-345-6789',
      email: 'daniel.wilson@companyj.com',
      name: 'Daniel Wilson',
      contactType: 'Employee',
      companies: 'Company J',
      notes: 'HR Manager, part of the team since 2017.'
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

      { header: 'Contact Id', accessorKey: 'contactId', dataType: 'text' },
      { header: 'Phone', accessorKey: 'phone', dataType: 'text' },
      { header: 'Email', accessorKey: 'email', dataType: 'text' },
      { header: 'Name', accessorKey: 'name', dataType: 'text' },
      { header: 'Contact Type', accessorKey: 'contactType', dataType: 'text' },
      { header: 'Companies', accessorKey: 'companies', dataType: 'text' },
      { header: 'Notes', accessorKey: 'notes', dataType: 'text' },

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
          Add Contact
        </MuiButton>
      </Box>

      <ReactTable {...{ data, columns, setData }} />
      <AddEmployeeModal open={isModalOpen} handleClose={handleCloseModal} handleAddEmployee={handleAddEmployee} />
    </>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
