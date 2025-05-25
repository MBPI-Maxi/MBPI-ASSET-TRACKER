import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';

import IconButton from "@mui/material/IconButton";
import InputAdornment from '@mui/material/InputAdornment';
import API_ROUTES from '@/api/api';
import formValidation from "@pages/validate";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { IconButton, InputAdornment } from "@mui/material";
import { registrationSchema } from './validationSchema';
import { DefaultTextFieldStyle } from '@/components/TextFieldForm';
import { useNavigate } from 'react-router-dom';
import { RegistrationSnackBar } from '../alerts';
import { useFormContext } from '@/context/FormProvider';
import { DEPARTMENT_LIST } from '@/constants/backendData';
import { useMutation } from '@tanstack/react-query';



const Registration = ({ closeDialog }) => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  }

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
        onSuccess: () => {
          showSnackbar();
          setServerError({});

          setTimeout(() => {
            hideSnackbar();
            closeDialog();

            navigate("/");
          }, 3000);
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
          type={ showPassword ? "text": "password" }
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        <DefaultTextFieldStyle
          label="Confirm Password"
          name="confirmPassword"
          type={ showConfirmPassword ? "text": "password" }
          value={formData.confirmPassword}
          onChange={handleChange}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={handleShowConfirmPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
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
