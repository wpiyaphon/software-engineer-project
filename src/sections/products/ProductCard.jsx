import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
// utils
import { fCurrency } from '../../utils/formatNumber';
// components
import Label from '../../components/label';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onEdit: PropTypes.func,
};

export default function ShopProductCard({ product, onEdit }) {
  const { name, cover } = product;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <IconButton 
        size="large" 
        sx={{
          zIndex: 9,
          bottom: 12,
          right: 16,
          position: 'absolute',
          cursor: 'pointer',
          color: 'white',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark'
          },
        }}
        onClick={() => onEdit(product)}
        >
          <EditIcon />
        </IconButton>

        <StyledProductImg alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
            </Typography>
            &nbsp;
            0 In Stock
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
