import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react';
import { format, getTime, formatDistanceToNow } from 'date-fns';
// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, query, where, collection } from "firebase/firestore";
import { FIREBASE_API } from "../../config";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Dialog, DialogTitle, DialogContent, Stack, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
// components
import Scrollbar from "../../components/scrollbar";
// ----------------------------------------------------------------------

CustomersDetailDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    customer: PropTypes.object
};

// ----------------------------------------------------------------------

export default function CustomersDetailDialog({ open, onClose, customer }) {

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const [orders, setOrders] = useState([])



    const defaultValues = {
        customerName: customer?.name || 'Dummy',
        customerEmail: customer?.email || 'dummy@dummy.com',
        customerAddress: customer?.address || 'Dummy place'
    }

    const fetchOrders = async () => {
        const orderRef = collection(db, "orders")
        const q = query(orderRef, where("customerRef", "==", defaultValues.customerEmail));

        await getDocs(q)
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setOrders(newData);
            })
    }

    useEffect(() => {
        fetchOrders();
    }, [customer])

    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>
                {defaultValues.customerName}
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Typography>
                        {defaultValues.customerEmail}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                    <Typography>
                        {defaultValues.customerAddress}
                    </Typography>
                </Stack>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 500 }}>
                        <Table>
                            <OrdersListHead />
                            <TableBody>
                                {orders.map((order) => {
                                    const { date, productRef, amount, id, receiptImage } = order

                                    const formattedDate = format(new Date(date.toDate().toString()), 'dd MMMM yyyy')

                                    return (

                                        <TableRow key={id}>
                                            <TableCell align="left">{formattedDate}</TableCell>
                                            <TableCell align="left">{productRef}</TableCell>
                                            <TableCell align="center">{amount}</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => window.open(receiptImage)}>
                                                    <NavigateNextRoundedIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </DialogContent>
        </Dialog>
    )
}

export function OrdersListHead() {
    return (
        <TableHead>
            <TableRow>
                <TableCell align="left">
                    Date
                </TableCell>
                <TableCell align="left">
                    Product
                </TableCell>
                <TableCell align="center">
                    Amount
                </TableCell>
                <TableCell align="center">
                    Receipt
                </TableCell>
            </TableRow>
        </TableHead>
    )
}