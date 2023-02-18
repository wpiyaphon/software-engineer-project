import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

    const logo = (
        <Box
            component="img"
            src="/logo/shop_logo_nobg.png"
            sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
        />
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return (
        <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
            {logo}
        </Link>
    );
});

Logo.propTypes = {
    sx: PropTypes.object,
    disabledLink: PropTypes.bool,
};

export default Logo;
