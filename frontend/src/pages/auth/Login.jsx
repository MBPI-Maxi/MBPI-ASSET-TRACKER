import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import IconButton from "@mui/material/IconButton";
import InputAdornment from '@mui/material/InputAdornment';
import API_ROUTES from "@/api/api";
import formValidation from "@pages/validate";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useFormContext } from "@/context/FormProvider";
import { useState } from "react";
import { DefaultTextFieldStyle } from "@/components/TextFieldForm";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./validationSchema";
import { LoginSnackBar } from "@pages/alerts";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const {
    setIsAuthenticated,
  } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [serverError, setServerError] = useState({});

  const {
    openSnackbar,
    showSnackbar,
    hideSnackbar,
    errors,
    setErrors
  } = useFormContext();

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev, [e.target.name]: e.target.value
    }));

    if (serverError.status) {
      setServerError({});
    }
  };

  const LoginMutataion = useMutation({
    mutationFn: (data) => API_ROUTES.postLogin(data)
  })

  const VerifyMutation = useMutation({
    mutationFn: API_ROUTES.postIsAuthenticated,
    onSuccess: (data) => {
      console.log("Verify mutation onSuccess data:", data); // Let's log the data
      if (data) {
        setIsAuthenticated(true);

        setTimeout(() => {
          hideSnackbar();
          navigate("/app");
        }, 1000);
      } else {
        console.log("Verification failed after login.");

        setIsAuthenticated(false);

        setTimeout(() => {
          hideSnackbar();
          navigate("/");
        }, 1000);
      }
    },
    onError: (error) => {
      console.log("Verification error:", error);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formValidation(form, loginSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      console.log("Form submitted successful");

      // API CALL HERE
      LoginMutataion.mutate(form, {
        onSuccess: async (responseData) => {
          const { user_details } = responseData;

          // localStorage.setItem("access_token", access);
          // localStorage.setItem("refresh_token", refresh);
          localStorage.setItem("user", JSON.stringify(user_details));

          showSnackbar();
          setServerError({});

          // setTimeout(() => {
          //   VerifyMutation.mutate();
          // }, 1000);
          VerifyMutation.mutate();
        },
        onError: (error) => {
          console.error(`Server error has occured: ${error}`);

          alert("Make sure the backend is running.");

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
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <DefaultTextFieldStyle
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
          required
          autoFocus
        />
        <DefaultTextFieldStyle
          label="Password"
          name="password"
          type={ showPassword ? "text": "password" }
          value={form.password}
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

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
        >
          Login
        </Button>
      </Box>
      {/* snackbar here */}
      {
        openSnackbar &&
        <LoginSnackBar openSnackbar={openSnackbar} hideSnackbar={hideSnackbar} />
      }
      {/* alert if there is an error in the backend */}
      {
        serverError.status && serverError.error?.detail && (
          <Alert severity="error" sx={{ mt: 2, textAlign: "center" }}>
            {serverError.error.detail}
          </Alert>
        )
      }
    </Box>
  )
}