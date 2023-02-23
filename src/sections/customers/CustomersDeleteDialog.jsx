import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { FIREBASE_API } from "../../config";
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

CustomersNewDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

// ----------------------------------------------------------------------

export default function CustomersNewDialog({ open, onClose, customer }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // const app = initializeApp(FIREBASE_API);
    // const db = getFirestore(app);

    const handleDelete = async (customer) => {
        try {

            // Add logic for deleting customer in Firebase below!

            // await setDoc(doc(db, "customers", `${customerEmail}`), {
            //     firstName: customerFirstName,
            //     lastName: customerLastName,
            //     email: customerEmail,
            //     address: customerAddress
            // });

            console.log("deleting customer will be added soon!");

            enqueueSnackbar('Successfully deteled the customer', { variant: 'success' })
            setTimeout(() => {
                closeSnackbar();
            }, 5000);
            onClose();

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
            <Dialog fullWidth open={open} onClose={onClose}>
                <DialogTitle>
                    Delete the customer?
                </DialogTitle>
                <DialogContent>
                    Once deleted, you will not be able to recover this customer.
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
                    <LoadingButton
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete
                    </LoadingButton>
                </DialogActions>
            </Dialog>
    )
}