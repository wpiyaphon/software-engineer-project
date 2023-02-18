// @mui
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

const navConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: <EqualizerRoundedIcon />,
    },
    {
        title: 'customers',
        path: '/dashboard/customers',
        icon: <GroupRoundedIcon />,
    },
    {
        title: 'products',
        path: '/dashboard/products',
        icon: <LocalMallIcon />,
    },
    {
        title: 'orders',
        path: '/dashboard/orders',
        icon: <ShoppingCartIcon />,
    },
    {
        title: 'logout',
        icon: <LogoutIcon />,
    },
];

export default navConfig;
