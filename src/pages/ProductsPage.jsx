import { Helmet } from "react-helmet-async";
import { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Container, Stack, Typography, InputAdornment, Toolbar, Button, OutlinedInput, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
// components
import FormProvider, { RHFTextField, RHFUpload } from '../components/hook-form';
// sections
import { ProductList } from '../sections/products';
// mock
import PRODUCTS from '../_mock/products';
import db from "../_mock/firebase.js";
import {doc, setDoc, Timestamp} from "firebase/firestore";
import {faker} from "@faker-js/faker";
import {Product, productConverter} from "../_mock/products";
import { getStorage, ref } from "firebase/storage";

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 !important',
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: '100%',
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------
export default function ProductsPage() {

    const [filterName, setFilterName] = useState('');

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState({});

    const handleSelect = (data) => {
        setSelectedProduct(data);
        handleOpenEditDialog();
    }

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setTimeout(() => {
            setSelectedProduct({});
        }, 200)
    }

    return (
        <>
            <Helmet>
                <title>Products</title>
            </Helmet>

            <Container>
                <Typography variant="h4" gutterBottom>
                    Products
                </Typography>

                <StyledRoot>
                    <StyledSearch
                        value={filterName}
                        onChange={handleFilterByName}
                        placeholder="Search customer..."
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                            </InputAdornment>
                        }
                    />

                    <Button variant="contained" sx={{ height: 55, ml: 2, width: 240 }} onClick={() => setOpenNewProductDialog(true)}>
                        <AddRoundedIcon /> New Product
                    </Button>
                </StyledRoot>
                <ProductList products={PRODUCTS} onEdit={handleSelect} />
            </Container>
            <NewProductDialog open={openNewProductDialog} onClose={() => setOpenNewProductDialog(false)} />
            {Object.keys(selectedProduct).length !== 0 && (
                <EditProductDialog open={openEditDialog} onClose={handleCloseEditDialog} product={selectedProduct} />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

NewProductDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export function NewProductDialog({ open, onClose }) {

    const NewProductSchema = Yup.object().shape({
        productImage: Yup.string().required('Product image is required'),
        productName: Yup.string().required('Product name is required'),
        productAmount: Yup.string().required('Product amount is required')
    });

    const defaultValues = {
        productImage: '',
        productName: '',
        productAmount: ''
    }

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
        defaultValues
    });

    const {
        reset,
        setError,
        setValue,
        watch,
        handleSubmit,
        formState: { isSubmitting, isSubmitSuccessful }
    } = methods;

    const values = watch();

    const storage = getStorage();
    const [selectedProductImage, setSelectedProductImage] = useState("")

    const onSubmit = (data) => {
        try {
            /*
            const productData = new Product(
                data.productName,
                "/assets/images/products/product_13.jpg",
                data.productAmount,
                0,
                ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'],
                'sale',
                Timestamp.now()
            )
            const ref = doc(db, "products", faker.datatype.uuid()).withConverter(productConverter);
            await setDoc(ref, productData)
                .then(() => console.log("Product added!"))
                .catch((error) => console.error(error))

             */
            console.log(data.productImage)
            console.log(data);
        } catch (error) {
            console.error(error.message);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    }

    // Product Image 
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            if (file) {
                setValue('productImage', newFile);
            }
        },
        [setValue]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.productImage && values.productImage?.filter((file) => file !== inputFile);
        setValue('productImage', filtered);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset(defaultValues);
        }, 200)
    }

    return (
        <FormProvider methods={methods}>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>
                    New Product
                </DialogTitle>
                <DialogContent>
                    <RHFUpload
                        name="productImage"
                        thumbnail
                        onDrop={handleDropFiles}
                        onRemove={handleRemoveFile}
                    />
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <RHFTextField fullWidth name="productName" label="Product" />
                        <RHFTextField fullWidth name="productAmount" label="Amount" />
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
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}

// ----------------------------------------------------------------------

EditProductDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    product: PropTypes.object
};

export function EditProductDialog({ open, onClose, product }) {

    const EditProductDialog = Yup.object().shape({
        productImage: Yup.string().required('Product image is required'),
        productName: Yup.string().required('Product name is required'),
        productAmount: Yup.string().required('Product amount is required')
    });

    const defaultValues = {
        productImage: product?.cover || '',
        productName: product?.name || '',
        productAmount: '0'
    }

    const methods = useForm({
        resolver: yupResolver(EditProductDialog),
        defaultValues
    });

    const {
        reset,
        setError,
        setValue,
        watch,
        handleSubmit,
        formState: { isSubmitting, isSubmitSuccessful }
    } = methods;

    const values = watch();

    const onSubmit = async (data) => {
        try {
            console.log(data);
        } catch (error) {
            console.error(error.message);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    }

    // Product Image 
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            if (file) {
                setValue('productImage', newFile);
            }
        },
        [setValue]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.productImage && values.productImage?.filter((file) => file !== inputFile);
        setValue('productImage', filtered);
    };

    return (
        <FormProvider methods={methods}>
            <Dialog fullWidth open={open} onClose={onClose}>
                <DialogTitle>
                    New Product
                </DialogTitle>
                <DialogContent>
                    <RHFUpload
                        name="productImage"
                        thumbnail
                        onDrop={handleDropFiles}
                        onRemove={handleRemoveFile}
                    />
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <RHFTextField fullWidth name="productName" label="Product" />
                        <RHFTextField fullWidth name="productAmount" label="Amount" />
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