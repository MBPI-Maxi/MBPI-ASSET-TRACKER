import React, { useState } from 'react';
import { Box, Typography, Button, InputAdornment, IconButton } from '@mui/material';
import { registrationSchema } from './validationSchema';
import { RegistrationTextField } from '@/components/TextFieldForm';
import { useNavigate } from 'react-router-dom';
import { RegistrationSnackBar } from '../alerts';
import formValidation from "@pages/validate";
import { useFormContext } from '@/context/FormProvider';

const Registration = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const {
    openSnackbar, 
    showSnackbar, 
    hideSnackbar, 
    errors, 
    setErrors 
  } = useFormContext()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formValidation(formData, registrationSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      console.log("Form submitted successful");

      // API CALL HERE

      showSnackbar();

      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
        // border: '1px solid #ccc',
        // borderRadius: 2,
        // boxShadow: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" mb={2}>
        Registration
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <RegistrationTextField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={Boolean(errors.first_name)}
          helperText={errors.first_name}
          required
        />
        <RegistrationTextField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={Boolean(errors.last_name)}
          helperText={errors.last_name}
          required
        />
        <RegistrationTextField
          label="User Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
          required
        />
        <RegistrationTextField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />
        <RegistrationTextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          required
        />
        <RegistrationTextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Register
        </Button>

        
      </Box>
      {/* snackbar */}
      <RegistrationSnackBar
        openSnackbar={openSnackbar}
        hideSnackbar={hideSnackbar}
      />
    </Box>
  );
};


export default Registration;
