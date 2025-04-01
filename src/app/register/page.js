"use client";

import { useState } from 'react';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Card from '../components/card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import StyledButton from '../components/button';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';
import { Button } from '@mui/material';

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  }
}));

const steps = ['Profile Image', 'Personal Info', 'Account Details', 'Contact Info'];

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  // profileImageUrl: z.string().url('Profile image is required')
});

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    roles: [
      'lecturer',
      'administrator'
    ],
    profileImageUrl: ''
  });

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      // const imageUrl = await authService.uploadImage(file);
      const imageUrl = "image.jpg";
      setFormData(prev => ({ ...prev, profileImageUrl: imageUrl }));
      setErrors(prev => ({ ...prev, profileImageUrl: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, profileImageUrl: 'Failed to upload image' }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    switch (step) {
      case 1:
        // if (!formData.profileImageUrl) {
        //   newErrors.profileImageUrl = 'Profile image is required';
        //   isValid = false;
        // }
        break;
      case 2:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        break;
      case 3:
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        break;
      case 4:
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = signUpSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors({
        firstName: formattedErrors.firstName?._errors[0],
        lastName: formattedErrors.lastName?._errors[0],
        username: formattedErrors.username?._errors[0],
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
        phoneNumber: formattedErrors.phoneNumber?._errors[0],
        profileImageUrl: formattedErrors.profileImageUrl?._errors[0]
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.register(formData);
      console.log('Register reponse', result);
      if (result.success) {
        router.push('/login');
      }
    } catch (error) {
      setErrors({ message: error?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="center" alignItems="center">
      <Card variant="outlined">
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 3 }}>
          Create Your Account
        </Typography>

        <Box sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <span key={label} style={{ marginRight: '8px', opacity: currentStep > index + 1 ? 1 : 0.5 }}>
              {label}
            </span>
          ))}
        </Box>

        {errors.message && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errors.message}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <FormControl fullWidth sx={ { mb: 2, display: 'flex', alignItems: 'center', gap: '5px' } }>
              <Box sx={{ height: '150px', width: '150px', backgroundColor: 'white', borderRadius: '100%', backgroundImage: 'url(/avatar.jpg)', backgroundSize: 'cover' }} />
              <FormLabel>Profile Image</FormLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                disabled={isUploading}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </label>
              {formData.profileImageUrl && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Image uploaded successfully
                </Typography>
              )}
              {errors.profileImageUrl && (
                <Typography color="error" variant="caption">
                  {errors.profileImageUrl}
                </Typography>
              )}
            </FormControl>
          )}

          {currentStep === 2 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>First Name</FormLabel>
                <TextField
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Last Name</FormLabel>
                <TextField
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Username</FormLabel>
                <TextField
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </FormControl>
            </>
          )}

          {currentStep === 3 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Email</FormLabel>
                <TextField
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Password</FormLabel>
                <TextField
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </FormControl>
            </>
          )}

          {currentStep === 4 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Phone Number</FormLabel>
              <TextField
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </FormControl>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {currentStep > 1 && (
              <StyledButton
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
              >
                Back
              </StyledButton>
            )}

            {currentStep < steps.length ? (
              <StyledButton
                variant="contained"
                onClick={handleNext}
                disabled={isLoading || isUploading}
                sx={{ ml: 'auto' }}
              >
                Next
              </StyledButton>
            ) : (
              <StyledButton
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ ml: 'auto' }}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </StyledButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Card>
    </SignUpContainer>
  );
}