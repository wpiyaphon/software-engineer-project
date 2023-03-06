import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import {getFirestore, doc, setDoc, addDoc, collection} from "firebase/firestore";
import { FIREBASE_API } from "../../config";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

CustomersNewDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

// ----------------------------------------------------------------------

export default function CustomersNewDialog({ open, onClose }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const NewCustomerSchema = Yup.object().shape({
        customerFirstName: Yup.string().required('First name is required'),
        customerLastName: Yup.string().required('Last name is required'),
        customerEmail: Yup.string().email().required('Email is required'),
        customerAddress: Yup.string().required('Address is required')
    });

    const defaultValues = {
        customerFirstName: '',
        customerLastName: '',
        customerEmail: '',
        customerAddress: ''
    }

    const methods = useForm({
        resolver: yupResolver(NewCustomerSchema),
        defaultValues
    });

    const {
        reset,
        setError,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isSubmitSuccessful }
    } = methods;

    const onSubmit = async (data) => {
        try {

            const {
                customerFirstName,
                customerLastName,
                customerEmail,
                customerAddress
            } = data;

            await addDoc(collection(db, "customers"), {
                name: customerFirstName + " " + customerLastName,
                firstName: customerFirstName,
                lastName: customerLastName,
                email: customerEmail,
                address: customerAddress,
            });

            enqueueSnackbar('Created customer successfully', { variant: 'success' })
            setTimeout(() => {
                closeSnackbar();
            }, 5000)

            onClose();
            setTimeout(() => {
                reset(defaultValues);
            }, 200);

        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setTimeout(() => {
                closeSnackbar();
            }, 5000);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    }

    return (
        <FormProvider methods={methods}>
            <Dialog fullWidth open={open} onClose={onClose}>
                <DialogTitle>
                    New Customer
                </DialogTitle>
                <DialogContent>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <RHFTextField fullWidth name="customerFirstName" label="First name" />
                        <RHFTextField fullWidth name="customerLastName" label="Last name" />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <RHFTextField fullWidth name="customerEmail" label="Email" />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <RHFTextField fullWidth name="customerAddress" label="Address" />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSubmitSuccessful || isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}