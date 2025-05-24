import { Box, Typography, Button, Alert } from "@mui/material";
import { useFormContext } from "@/context/FormProvider";
import { useState } from "react";
import { DefaultTextFieldStyle } from "@/components/TextFieldForm";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./validationSchema";
import { LoginSnackBar } from "@pages/alerts";
import { useMutation } from "@tanstack/react-query";
import API_ROUTES from "@/api/api";
import formValidation from "@pages/validate";

export default function Login() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev, [e.target.name]: e.target.value
    }));

    if (serverError.status) {
      setServerError({});
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => API_ROUTES.postLogin(data)
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formValidation(form, loginSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      console.log("Form submitted successful");

      // API CALL HERE
      mutation.mutate(form, {
        onSuccess: (responseData) => {
          const { access, refresh, user_details } = responseData;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
          localStorage.setItem("user", JSON.stringify(user_details));

          showSnackbar();
          setServerError({});
          
          setTimeout(() => {
            navigate("/app");
          }, 2000)
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
          type="password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          required
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