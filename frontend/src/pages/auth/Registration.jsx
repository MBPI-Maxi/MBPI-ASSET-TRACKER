import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Alert 
} from '@mui/material';
import { registrationSchema } from './validationSchema';
import { DefaultTextFieldStyle } from '@/components/TextFieldForm';
import { useNavigate } from 'react-router-dom';
import { RegistrationSnackBar } from '../alerts';
import { useFormContext } from '@/context/FormProvider';
import { DEPARTMENT_LIST } from '@/constants/backendData';
import { useMutation } from '@tanstack/react-query';
import API_ROUTES from '@/api/api';
import formValidation from "@pages/validate";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    department: "",
    confirmPassword: "",
  });

  const [serverError, setServerError] = useState({});
  
  const {
    openSnackbar, 
    showSnackbar, 
    hideSnackbar, 
    errors, 
    setErrors 
  } = useFormContext()

  const mutation = useMutation({
    mutationFn: (data) => API_ROUTES.postCreateUser(data)
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    if (serverError.status) {
      setServerError({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formValidation(formData, registrationSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      mutation.mutate(formData, {
        onSuccess: (responseData) => {
          const { tokens, data } = responseData

          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("access_token", tokens.access);
          localStorage.setItem("refresh_token", tokens.refresh);

          showSnackbar();
          setServerError({});

          setTimeout(() => {
            navigate("/app");
          }, 2000);
        },
        onError: (error) => {
          console.error(`Server error has occured: ${error}`);
          
          setServerError({
            status: true,
            error: error
          });
        }
      })
      
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
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" mb={2}>
        Registration
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <DefaultTextFieldStyle
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={Boolean(errors.first_name)}
          helperText={errors.first_name}
          required
          autoFocus  
        />
        <DefaultTextFieldStyle
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={Boolean(errors.last_name)}
          helperText={errors.last_name}
          required
        />
        <DefaultTextFieldStyle
          label="User Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
          required
        />
        <DefaultTextFieldStyle
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />
        
        <FormControl fullWidth required error={Boolean(errors.department)}>
          <InputLabel id="registerDropdownDepartment">Department</InputLabel>
          <Select
            labelId="registerDropdownDepartment"
            id="dropdownDepartmentRegistration"
            value={formData.department}
            name="department"
            label="department"
            onChange={handleChange}
            error={Boolean(errors.department)}
                      
          >
            {
              DEPARTMENT_LIST.map((department, index) => {
                let key = `registrationDpt-${department}-${index}`;

                return <MenuItem key={key} value={department}>
                  {department}
                </MenuItem>
              })
            }
          </Select>
          {
            errors.department &&
            <FormHelperText>
              { errors.department }
            </FormHelperText>
          }
        </FormControl>

        <DefaultTextFieldStyle
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          required
        />
        <DefaultTextFieldStyle
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

      {/* alert if there is an error in the backend */}
      {
        serverError.status && serverError.error?.username && (
          <Alert severity="error" sx={{mt: 2, textAlign: "center"}}>
            { serverError.error.username }
          </Alert>
        )
      }
    </Box>
  );
};


export default Registration;
