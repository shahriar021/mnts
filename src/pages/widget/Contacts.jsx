import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
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
    contact_id: '',
    contact_phone: '',
    contact_email: '',
    contact_name: '',
    contact_type: '',
    //companies: '',
    Notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');

    const response = await fetch('https://gari.remoteintegrity.com/api/contacts', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    console.log(response, 'post data..', token);

    if (response.ok) {
      const newEmployee = await response.json(); // Get the new contact from API
      handleAddEmployee(newEmployee); // Update UI only if API succeeds
      handleClose();
      setFormData({
        contact_id: '',
        contact_phone: '',
        contact_email: '',
        contact_name: '',
        contact_type: '',
        Notes: ''
      });
    } else {
      console.error('Failed to add contact', response.statusText);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Contact ID" name="contact_id" value={formData.contact_id} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="contact_phone" type="tel" value={formData.contact_phone} onChange={handleChange} fullWidth />
          <TextField label="Email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} fullWidth />
          <TextField label="Name" name="contact_name" value={formData.contact_name} onChange={handleChange} fullWidth />
          <TextField label="Contact Type" name="contact_type" value={formData.contact_type} onChange={handleChange} fullWidth />
          {/* <TextField label="Companies" name="companies" value={formData.companies} onChange={handleChange} fullWidth /> */}
          <TextField label="Notes" name="Notes" value={formData.Notes} onChange={handleChange} multiline rows={3} fullWidth />
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
    pageSize: 10 // Default rows per page
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
  const [data, setData] = useState([]);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const token = localStorage.getItem('authToken');
  console.log(token, 'token.');
  const handleAddEmployee = (newEmployee) => {
    setData((prevData) => [...prevData, newEmployee]);
  };
  console.log(localStorage.getItem('authToken'), 'helloe');
  useEffect(() => {
    const getContactsData = async () => {
      const data = await fetch('https://gari.remoteintegrity.com/api/contacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const jsonData = await data.json();
      setData(jsonData);
    };
    if (token) {
      getContactsData();
    }
  }, [token]);
  console.log(data, 'info');

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

      { header: 'Contact Id', accessorKey: 'contact_id', dataType: 'text' },
      { header: 'Phone', accessorKey: 'contact_phone', dataType: 'text' },
      { header: 'Email', accessorKey: 'contact_email', dataType: 'text' },
      { header: 'Name', accessorKey: 'contact_name', dataType: 'text' },
      { header: 'Contact Type', accessorKey: 'contact_type', dataType: 'text' },
      { header: 'Companies', accessorKey: 'companies', dataType: 'text' },
      { header: 'Notes', accessorKey: 'Notes', dataType: 'text' },

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
