import PropTypes from 'prop-types';
import { useCallback } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { FIREBASE_API } from "../../config";
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField, RHFSelect, RHFUpload } from '../../components/hook-form';
//
import { Upload } from '../../components/upload';


// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb

const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

// ----------------------------------------------------------------------

OrderDetailDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    order: PropTypes.object
};

// ----------------------------------------------------------------------

export default function OrderDetailDialog({ open, onClose, order }) {

    const DUMMY_ORDER = {
        receiptImage: '',
        orderDate: '02/24/2023',
        soldProduct: 'Princess Candle',
        soldAmount: 4,
        customer: { email: "hong@hotmail.com", firstName: "Piyaphon", lastName: "Wu", address: "Fake Street 123" }
    };

    const handleCloseDialog = () => {
        onClose();
    };

    return (
        <Dialog fullWidth open={open} onClose={handleCloseDialog}>
            <DialogTitle>
                Order Detail
            </DialogTitle>
            <DialogContent>
                {/* Drop Downloaded image from firebase here */}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Date" value={DUMMY_ORDER.orderDate} disabled />
                </Stack>
                <Grid container direction="row" spacing={2} sx={{ mt: 0 }}>
                    <Grid item xs={6} md={8}>
                        <TextField fullWidth label="Sold Product" value={DUMMY_ORDER.soldProduct} disabled />
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth label="Sold Amount" value={DUMMY_ORDER.soldAmount} disabled />
                    </Grid>
                </Grid>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Customer" value={`${DUMMY_ORDER.customer.firstName} ${DUMMY_ORDER.customer.lastName}`} disabled />
                </Stack>
            </DialogContent>
        </Dialog>
    )
}