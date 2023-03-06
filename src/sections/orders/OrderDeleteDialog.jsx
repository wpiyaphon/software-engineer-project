import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE_API } from "../../config";
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

OrderDeleteDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    order: PropTypes.object
};

// ----------------------------------------------------------------------

export default function OrderDeleteDialog({ open, onClose, order }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "orders", order.id))
            .then(() => enqueueSnackbar('Successfully deteled the order', { variant: 'success' }))
            .catch((error) => console.error(error))
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
                Delete the order?
            </DialogTitle>
            <DialogContent>
                Once deleted, you will not be able to recover this order.
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