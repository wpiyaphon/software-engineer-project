import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Container, Stack, Typography, InputAdornment, Toolbar, Button, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
// sections
import { ProductList } from '../sections/products';
// mock
import PRODUCTS from '../_mock/products';

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

                    <Button variant="contained" sx={{ height: 55, ml: 2, width: 240 }}>
                        <AddRoundedIcon /> New Product
                    </Button>
                </StyledRoot>
                <ProductList products={PRODUCTS} />
            </Container>
        </>
    )
}