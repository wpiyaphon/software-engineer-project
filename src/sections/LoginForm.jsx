import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// components
import FormProvider, { RHFTextField } from '../components/hook-form';

export default function LoginForm() {
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const defaultValues = {
        email: 'owner@gmail.com',
        password: '123456'
    }

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = methods;

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
        } catch (error) {
            console.error(error.message);
            reset(defaultValues);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    }


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField
                    fullWidth
                    name="email"
                    label="Email address"

                />

                <RHFTextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitSuccessful || isSubmitting}
                sx={{
                    my: 2,
                    bgcolor: '#eacdb2',
                    color: 'black',
                    '&:hover': {
                        bgcolor: '#785020',
                        color: 'white',
                    },
                }}
            >
                Login
            </LoadingButton>
        </FormProvider>
    )
}