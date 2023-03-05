import { Helmet } from "react-helmet-async";
import {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Timestamp } from "firebase/firestore";
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// components
import Label from '../components/label';
import Scrollbar from "../components/scrollbar";
// sections
import { CustomersListHead, CustomersListToolbar } from '../sections/customers';
import { OrderNewDialog, OrderDeleteDialog, OrderEditDialog, OrderDetailDialog } from '../sections/orders';

// firebase api
import {initializeApp} from "firebase/app";
import {FIREBASE_API} from "../config.jsx";
import {collection, getFirestore, onSnapshot, query} from "firebase/firestore";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'orderId', label: 'Order ID', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'customer', label: 'Customer', alignRight: false },
    { id: 'product', label: 'Product', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function CustomersPage() {

    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const [orders, setOrders] = useState([])

    useEffect(()=> {
        const q = query(collection(db, "orders"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        });

        return () => unsubscribe()
    }, [])

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = orders.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

    const filteredUsers = applySortFilter(orders, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    // Create/Edit/Delete order dialogs
    const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);
    const [openDetailOrderDialog, setOpenDetailOrderDialog] = useState(false);
    const [openEditOrderDialog, setOpenEditOrderDialog] = useState(false);
    const [openDeleteOrderDialog, setOpenDeleteOrderDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpenDetailOrderDialog = () => {
        // setSelectedOrder
        setOpenDetailOrderDialog(true);
    }

    const handleOpenDeleteOrderDialog = () => {
        // setSelectedOrder
        setOpenDeleteOrderDialog(true);
    };

    const handleOpenEditOrderDialog = () => {
        // setSelectedOrder
        setOpenEditOrderDialog(true);
    };

    const handleCloseDialog = (setDialog) => {
        // Set selected customer to be empty object here
        setDialog(false);
    };

    console.log(orders)

    return (
        <>
            <Helmet>
                <title>Orders</title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Orders
                    </Typography>
                    <Button variant="contained" size="large" startIcon={<AddRoundedIcon />} onClick={() => setOpenNewOrderDialog(true)}>
                        New Order
                    </Button>
                </Stack>

                <Card>
                    <CustomersListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <CustomersListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={orders.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        
                                        const { customerRef, date, productRef, id } = row;
                                        const formattedDate = date.toDate().toString()
                                        
                                        const selectedUser = selected.indexOf(id) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none" onClick={handleOpenDetailOrderDialog} sx={{ cursor: 'pointer' }}>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {id}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left" onClick={handleOpenDetailOrderDialog} sx={{ cursor: 'pointer' }}>{formattedDate}</TableCell> 

                                                <TableCell align="left" onClick={handleOpenDetailOrderDialog} sx={{ cursor: 'pointer' }}>{customerRef}</TableCell>

                                                <TableCell align="left" onClick={handleOpenDetailOrderDialog} sx={{ cursor: 'pointer' }}>{productRef}</TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={orders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleOpenEditOrderDialog}>
                    <EditIcon sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDeleteOrderDialog}>
                    <DeleteIcon sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>

            <OrderNewDialog open={openNewOrderDialog} onClose={() => setOpenNewOrderDialog(false)} />
            <OrderDeleteDialog open={openDeleteOrderDialog} onClose={() => setOpenDeleteOrderDialog(false)} />
            <OrderEditDialog open={openEditOrderDialog} onClose={() => setOpenEditOrderDialog(false)} />
            <OrderDetailDialog open={openDetailOrderDialog} onClose={() => setOpenDetailOrderDialog(false)} />
        </>
    )
}