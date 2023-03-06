import PropTypes from 'prop-types';
import { format} from 'date-fns';
// firebase
import { styled, alpha } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField, RHFSelect, RHFUpload } from '../../components/hook-form';
//
import { SingleFilePreview, Upload } from '../../components/upload';


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

const StyledDropZone = styled('div')(({ theme }) => ({
    width: '100%',
    height: '500px',
    margin: 'auto',
    display: 'flex',
    cursor: 'pointer',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

export default function OrderDetailDialog({ open, onClose, order }) {

    const DUMMY_ORDER = {
        receiptImage: '',
        orderDate: '02/24/2023',
        soldProduct: 'Princess Candle',
        soldAmount: 4,
        customer: { email: "hong@hotmail.com", firstName: "Piyaphon", lastName: "Wu", address: "Fake Street 123" }
    };

    const {
        amount,
        customerRef,
        date,
        productRef,
        receiptImage
    } = order;

    const formattedDate = format(new Date(date.toDate().toString()), 'dd MMMM yyyy')

    const handleCloseDialog = () => {
        onClose();
    };

    return (
        <Dialog fullWidth open={open} onClose={handleCloseDialog}>
            <DialogTitle>
                Order Detail
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 1 }}>
                    <StyledDropZone
                        sx={{
                            '&:hover': {
                                '& .placeholder': {
                                    opacity: 1,
                                },
                            },
                            cursor: "auto"
                        }}
                    >
                        <SingleFilePreview file={receiptImage} />
                    </StyledDropZone>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Date" value={formattedDate} disabled />
                </Stack>
                <Grid container direction="row" spacing={2} sx={{ mt: 0 }}>
                    <Grid item xs={6} md={8}>
                        <TextField fullWidth label="Sold Product" value={productRef} disabled />
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth label="Sold Amount" value={amount} disabled />
                    </Grid>
                </Grid>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Customer" value={customerRef} disabled />
                </Stack>
            </DialogContent>
        </Dialog>
    )
}