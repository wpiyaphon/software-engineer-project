import { Helmet } from "react-helmet-async";
// @mui
import { Container, Typography, Grid } from "@mui/material";
// components
import Logo from "../components/logo/Logo";
//
import LoginForm from '../sections/LoginForm';

export default function LoginPage() {
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} sx={{pr: 2, mb: 5, mt: 15}}>
                    <Logo disabledLink sx={{ width: '200px', height: '200px' }} />
                </Grid>
                <Grid item xs={12}>
                    <LoginForm />
                </Grid>

            </Grid>
        </>
    )
}