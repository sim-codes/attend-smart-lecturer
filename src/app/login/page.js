"use client";

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { z } from 'zod';
import { colorPalette } from '../constants/color';
import Card from '../components/card';
import ForgotPassword from '../components/forgot-password';
import StyledButton from '../components/button';
import { authService } from '@/lib/services';
import { authUtils } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundColor: colorPalette.background.main,
  color: colorPalette.text.primary,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  }
}));

const StyledFormLabel = styled(FormLabel)({
  color: colorPalette.text.secondary,
  marginBottom: '4px',
  fontSize: '0.9rem'
});

const StyledTextField = styled(TextField)(({ error }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: colorPalette.background.field,
    '& fieldset': {
      borderColor: error ? colorPalette.error : 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: error ? colorPalette.error : colorPalette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: error ? colorPalette.error : colorPalette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: colorPalette.text.primary,
  },
  '& .MuiFormHelperText-root': {
    color: colorPalette.error,
  }
}));

const StyledLink = styled(Link)({
  color: colorPalette.primary.light,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  }
});

const StyledDivider = styled(Divider)({
  '&::before, &::after': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  color: colorPalette.text.secondary,
  margin: '16px 0',
});

const schema = z.object({
  email: z.string().email('Enter correct email format some@email.com'),
  password: z.string().min(8, 'Password must be at least 8 characters long.')
});

export default function Page() {
  const [errors, setErrors] = useState({ email: '', password: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get('email'),
      password: data.get('password')
    };

    const validation = schema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0] || '',
        password: fieldErrors.password?._errors[0] || ''
      });
      return;
    }

    // Clear any previous errors
    setErrors({ email: '', password: '' });
    setIsLoading(true);

    try {
      const result = await authService.login(formData);

      if (result.success) {
        authUtils.setUserData(result.data.user),
          authUtils.setTokens(result.data.token);
        router.push('/dashboard');
      }
    } catch (error) {
      setErrors({ message: error?.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
    return;
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center" alignItems="center">
        <Card variant="outlined">
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              width: '100%', 
              fontSize: 'clamp(1.8rem, 8vw, 2rem)', 
              textAlign: 'center',
              fontWeight: 700,
              color: colorPalette.text.primary,
              marginBottom: '8px'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: colorPalette.text.secondary,
              marginBottom: '16px'
            }}
          >
            Sign in to continue to your account
          </Typography>

          { errors.message && (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: colorPalette.text.error,
                marginBottom: '16px'
              }}
            >
              {errors.message}
            </Typography>
          )}


          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2.5 }}>
            <FormControl>
              <StyledFormLabel htmlFor="email">Email</StyledFormLabel>
              <StyledTextField
                error={!!errors.email}
                helperText={errors.email}
                id="email"
                type="text"
                name="email"
                placeholder="simcodes@gmail.com"
                required
                fullWidth
                variant="outlined"
                size="medium"
              />
            </FormControl>

            <FormControl>
              <StyledFormLabel htmlFor="password">Password</StyledFormLabel>
              <StyledTextField
                error={!!errors.password}
                helperText={errors.password}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                size="medium"
              />
            </FormControl>

            <ForgotPassword open={ open } handleClose={ handleClose } />

            <StyledButton type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in"}
            </StyledButton>

            <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'center', color: colorPalette.text.secondary }}
              >
                Forgot your password?
              </Link>
          </Box>

          <StyledDivider>or</StyledDivider>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Typography sx={{ color: colorPalette.text.secondary }}>
              Don&apos;t have an account?
            </Typography>
            <StyledLink href="/register" variant="body2">
              Sign up
            </StyledLink>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
