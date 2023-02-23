import PropTypes from 'prop-types';
// @mui
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

CustomerNewDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default function CustomerNewDialog({open, onClose}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                New Customer
            </DialogTitle>
            <DialogContent>
                Hi
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Create
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}