import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import API_ROUTES from "@/api/api";
import formValidation from "../validate";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { maintenanceSchema } from "../auth/validationSchema";
import { MaintenanceReportSnackbar } from "../alerts";
import { useMutation } from "@tanstack/react-query";
import { useReducer, useState, useEffect } from "react";
import { useFormContext } from "@/context/FormProvider";

function reducer(state, action) {
  switch (action.type) {
    case "FIELD_CHANGE":
      return {
        ...state,
        [action.field]: action.value
      }
    case "TOGGLE_STATUS":
      return {
        ...state,
        status: !state.status
      }
    case "RESET_FORM":
      return {
        service_type: "",
        asset: "",
        service_date: "",
        cost: 0,
        status: false
      };
    default:
      return state;
  }
}

function MaintenanceReport() {
  const [state, dispatch] = useReducer(reducer, {
    service_type: "",
    asset: "",
    service_date: "",
    cost: 0,
    status: false
  })

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [allAssets, setAllAssets] = useState([]);

  const {
    openSnackbar,
    hideSnackbar,
    showSnackbar,
    errors,
    setErrors
  } = useFormContext();

  const {
    data: initialAssetsData = { results: [] },
    isLoading: isLoadingInitialAssets,
    isSuccess: initialAssetsSuccess,
  } = useQuery({
    queryKey: ["allMaintenanceAssets"], // A distinct key for the "all assets" query
    queryFn: () => API_ROUTES.getAllAssets({ page: 1, pageSize: 1000 }), // Fetch a large page size or implement true "get all"
    staleTime: Infinity, // Assets probably don't change very often, make them stale only on manual invalidation
    onSuccess: (data) => {
      // Store all fetched assets in local state
      setAllAssets(data.results);
    },
  });

  const { data: searchResultsData = { results: [] }, isLoading: isLoadingSearch } = useQuery({
      queryKey: ["maintenanceAssetSearch", searchText, page],
      queryFn: () => API_ROUTES.getAllAssets({ page, pageSize: 10, search: searchText }),
      placeholderData: keepPreviousData,
      enabled: !!searchText, // Only enable this query if there's search text
      // If you want initial options to be from the 'allAssets' and then search on top:
      // initialData: initialAssetsData, // This would merge, but usually not what you want for search
    });

  const mutation = useMutation({
    mutationFn: (data) => API_ROUTES.postMaintenanceAsset(data)
  })

  const handleChange = (event) => {
    const { name, value } = event.target;

    const parseValue =
      (name === "cost" || name === "asset")
        ? value === ""
          ? ""
          : Number(value)
        : value;

    dispatch({
      type: "FIELD_CHANGE",
      field: name,
      value: parseValue
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = await formValidation(state, maintenanceSchema);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      console.log("Maintenance report: ", state);

      mutation.mutate(state, {
        onSuccess: (responseData) => {
          console.log(responseData);

          showSnackbar();
        },
        onError: (error) => {
          console.log(error);
          showSnackbar();
        }
      })
    } else {
      setErrors(validationErrors);
    }

    dispatch({ type: "RESET_FORM" });
  }

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_STATUS" });
  }

  const autocompleteOptions = searchText ? searchResultsData.results : allAssets;
  const loadingState = searchText ? isLoadingSearch : isLoadingInitialAssets;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        mt: 4
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Maintenance Report
      </Typography>
      <TextField
        label="Service Type"
        name="service_type"
        value={state.service_type}
        onChange={handleChange}
        error={Boolean(errors.service_type)}
        helperText={errors.service_type}
        required
        fullWidth
      />
      {/* <TextField
        label="Asset ID"
        name="asset"
        type="number"
        value={state.asset}
        onChange={handleChange}
        error={Boolean(errors.asset)}
        helperText={errors.asset}
        required
        fullWidth
        slotProps={{
          input: {
            inputMode: "numeric",
            pattern: '[0-9]*',
            type: "number"
          }
        }}
      /> */}
      <Autocomplete
        // Use allAssets initially, or searchResultsData if searchText is present
        options={autocompleteOptions}
        getOptionLabel={(option) => `Asset ${option.asset_id} - ${option.vendor}`}
        loading={loadingState} // Use the appropriate loading state
        onInputChange={(event, newInputValue) => {
          setSearchText(newInputValue);
          setPage(1); // Reset to first page if search changes
        }}
        onChange={(event, newValue) => {
          dispatch({
            type: "FIELD_CHANGE",
            field: "asset",
            value: newValue ? newValue.asset_id : "",
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asset"
            required
            error={Boolean(errors.asset)}
            helperText={errors.asset}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingState && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }
            }}
          />
        )}
      />
      <TextField
        fullWidth
        label="Service Date"
        name="service_date"
        type="date"
        required
        value={state.service_date}
        onChange={handleChange}
        error={Boolean(errors.service_date)}
        helperText={errors.service_date}
        slotProps={{
          inputLabel: { shrink: true }
        }}
      />
      <TextField
        fullWidth
        required
        label="Cost"
        name="cost"
        type="number"
        value={state.cost}
        onChange={handleChange}
        error={Boolean(errors.cost)}
        helperText={errors.cost}
        slotProps={{
          inputLabel: { shrink: true }
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={state.status}
            onChange={handleToggle}
            color="primary"
          // error={Boolean(errors.status)}
          />
        }
        label="Status (Completed)"
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Submit Report
      </Button>
      {/* snackbar here */}
      {
        openSnackbar && mutation.isSuccess
          ? <MaintenanceReportSnackbar
            openSnackbar={openSnackbar}
            hideSnackbar={hideSnackbar}
            msg="Successfully Added"
            severity="success"
          />
          : openSnackbar && mutation.isError && (
            <MaintenanceReportSnackbar
              openSnackbar={openSnackbar}
              hideSnackbar={hideSnackbar}
              msg="Error adding maintenance for this asset"
              severity="error"
            />
          )
      }
    </Box>
  );
}

export default MaintenanceReport;