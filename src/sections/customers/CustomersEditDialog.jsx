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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

CustomersEditDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    customer: PropTypes.object
};

// ----------------------------------------------------------------------

export default function CustomersEditDialog({ open, onClose, customer }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

     const app = initializeApp(FIREBASE_API);
     const db = getFirestore(app);



    const EditCustomerSchema = Yup.object().shape({
        customerFirstName: Yup.string().required('First name is required'),
        customerLastName: Yup.string().required('Last name is required'),
        customerEmail: Yup.string().email().required('Email is required'),
        customerAddress: Yup.string().required('Address is required')
    });

    const defaultValues = {
        customerFirstName: customer?.firstName || '',
        customerLastName: customer?.lastName || '',
        customerEmail: customer?.email || '',
        customerAddress: customer?.address || ''
    }
    const methods = useForm({
        resolver: yupResolver(EditCustomerSchema),
        defaultValues
    });

    const {
        reset,
        setError,
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

            // Add logic for updating customer to Firebase below!

            await setDoc(doc(db, "customers", `${customer.id}`), {
                name: customerFirstName + " " + customerLastName,
                firstName: customerFirstName,
                lastName: customerLastName,
                email: customerEmail,
                address: customerAddress,
            });

            enqueueSnackbar('Edited successfully', { variant: 'success' })
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

    const handleClose = () => {
        onClose();
        setTimeout(() => {
        }, 200)
    }

    return (
        <FormProvider methods={methods}>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>
                    Edit Customer
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
                    <Button variant="outlined" color="inherit" onClick={handleClose}>Close</Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSubmitSuccessful || isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Edit
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}