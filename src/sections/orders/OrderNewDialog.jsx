import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack'
// firebase
import { initializeApp } from "firebase/app";
import {getFirestore, addDoc, getDocs, collection, Timestamp, setDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb

const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

// ----------------------------------------------------------------------

OrderNewDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

// ----------------------------------------------------------------------

export default function OrderNewDialog({ open, onClose }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const [customer_options, setCustomer_Options] = useState([])
    const [product_options, setProduct_Options] = useState([])
    

    const fetchCustomers = async () => {

        await getDocs(collection(db, "customers"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data() }));
                setCustomer_Options(newData);
            })
    }

    const fetchProducts = async () => {

        await getDocs(collection(db, "products"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data() }));
                setProduct_Options(newData);
            })
    }

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, [])


    const PRODUCT_OPTIONS = product_options;

    const CUSTOMER_OPTIONS = customer_options;

    const NewOrderSchema = Yup.object().shape({
        receiptImage: Yup.mixed()
            .test('required', "Product image is required", (value) => value !== '')
            .test('fileSize', 'The file is too large', (file) => file && file.size <= MAX_FILE_SIZE)
            .test('fileFormat', 'Unsupported Format', (file) => file && FILE_FORMATS.includes(file.type)),
        orderDate: Yup.string().required('Date is required'),
        soldProduct: Yup.string().required('Sold product is required'),
        soldAmount: Yup.number().typeError('Must be a number')
            .min(1, 'Sold amount must be greater than 0')
            .required('Sold amount is required'),
        customer: Yup.string().email('Must be a valid email').required('Customer is required'),
    });

    const defaultValues = {
        receiptImage: '',
        orderDate: '',
        soldProduct: '',
        soldAmount: 0,
        customer: ''
    }

    const methods = useForm({
        resolver: yupResolver(NewOrderSchema),
        defaultValues
    });

    const {
        reset,
        setError,
        setValue,
        control,
        watch,
        handleSubmit,
        formState: { isSubmitting, isSubmitSuccessful }
    } = methods;

    const values = watch();

    const {
        orderDate,
        soldProduct,
        soldAmount
    } = values;

    const onSubmit = async (data) => {

        try {
            const {
                customer,
                orderDate,
                receiptImage,
                soldAmount,
                soldProduct
            } = data;

            const storage = getStorage();
            const fileExtension = receiptImage.name.split('.').pop();
            const storageRef = ref(storage, `orders/${customer}-${orderDate}.${fileExtension}`);

            let imgURL = "/assets/images/products/product_4.jpg";

            uploadBytes(storageRef, receiptImage)
                .then(() => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            imgURL = url
                            addDoc(collection(db, "orders"), {
                                customerRef: customer,
                                date: Timestamp.fromDate(new Date(orderDate)),
                                amount: soldAmount,
                                productRef: soldProduct,
                                receiptImage: imgURL
                            })
                                .then(() => onClose())
                                .then(() => enqueueSnackbar('Added product successfully', { variant: 'success' }))
                                .then(() => setTimeout(() => {
                                    reset(defaultValues)
                                }, 200))
                                .then(() => setTimeout(() => {
                                    closeSnackbar()
                                }, 2000))
                        })
                        .catch((error) => {
                            console.error(error.message)
                            enqueueSnackbar(error.message, { variant: 'error' });

                            setTimeout(() => {
                                closeSnackbar();
                            }, 5000);

                            setError('afterSubmit', {
                                ...error,
                                message: error.message
                            });
                        });
                })

        } catch (error) {
            console.error(error.message);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    // Amount validation
    const handleChangeAmount = (event) => {
        const minValue = 0
        const maxValue = PRODUCT_OPTIONS.find(product => product.name === soldProduct).amount;
        if (maxValue === 0) {
            setValue('soldAmount', 'Product is out of stock');
        } else {
            const value = Math.max(minValue, Math.min(maxValue, Number(event.target.value)));
            setValue('soldAmount', value);
        }
    };

    // Receipt Image 
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            if (file) {
                setValue('receiptImage', newFile);
            }
        },
        [setValue]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.productImage && values.productImage?.filter((file) => file !== inputFile);
        setValue('receiptImage', filtered);
    };

    const handleCloseDialog = () => {
        onClose();
        setTimeout(() => {
            reset(defaultValues);
        }, 200)
    };

    return (
        <FormProvider methods={methods}>
            <Dialog fullWidth open={open} onClose={handleCloseDialog}>
                <DialogTitle>
                    New Order
                </DialogTitle>
                <DialogContent>
                    <RHFUpload
                        name="receiptImage"
                        thumbnail
                        onDrop={handleDropFiles}
                        onRemove={handleRemoveFile}
                    />
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="orderDate"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Order date"
                                    value={field.value}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                    )}
                                    disableMaskedInput
                                    inputFormat="dd-MMM-yyyy"
                                />
                            )}
                        />
                    </Stack>
                    <Grid container direction="row" spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={6} md={8}>
                            <RHFSelect
                                name="soldProduct"
                                label="Sold product"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            >
                                {PRODUCT_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.name}
                                        value={option.name}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <RHFTextField name="soldAmount" label="Amount" disabled={!soldProduct} onChange={handleChangeAmount} />
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <RHFSelect
                            name="customer"
                            label="Customer"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                        >
                            {CUSTOMER_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.email}
                                    value={option.email}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {option.firstName} {option.lastName}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={handleCloseDialog}>Close</Button>
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