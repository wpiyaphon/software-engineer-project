import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

    const DUMMY_ORDERS = [
        {
            orderDate: '03/01/2023',
            product: 'Princess Candle',
            amount: 5,
            receipt: 'DownloadedImageFromFirebase'
        }
    ];

    // Add logic to get customer's orders here

    // Add logic to open receipt image on new Tab
    const handleOpenReceiptImage = () => {
        console.log("Receipt image will be added soon!")
    };

    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <DialogTitle>
                Fake Dummy
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Typography>
                        Email: Dummy@hotmail.com
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                    <Typography>
                        Address: 123 Fake Street, Fake City, Fake State
                    </Typography>
                </Stack>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 500 }}>
                        <Table>
                            <OrdersListHead />
                            <TableBody>
                                {DUMMY_ORDERS.map((order) => (
                                    <TableRow key={order.orderDate}>
                                        <TableCell align="left">{order.orderDate}</TableCell>
                                        <TableCell align="left">{order.product}</TableCell>
                                        <TableCell align="center">{order.amount}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={handleOpenReceiptImage}>
                                                <NavigateNextRoundedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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