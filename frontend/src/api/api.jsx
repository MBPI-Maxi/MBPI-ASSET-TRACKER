import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const ASSET_URL = import.meta.env.VITE_BACKEND_ASSET_URL;
const SUMMARY_URL = import.meta.env.VITE_BACKEND_SUMMARY_URL;
const AUTH_URL = import.meta.env.VITE_BACKEND_AUTH_URL;
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const refreshTokenApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

const assetApiClient = axios.create({
  baseURL: ASSET_URL,
  withCredentials: true
});

const summaryApiClient = axios.create({
  baseURL: SUMMARY_URL,
  withCredentials: true
});

const authApiClient = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true
});

// Async refresh token logic for axios-auth-refresh
async function refreshAuthLogic(failedRequest) {
  try {
    await refreshTokenApiClient.post("/api/token/refresh"); // No body needed

    return Promise.resolve();
  } catch (error) {
    
    return Promise.reject(error);
  }
}

// fetch all the asset data
async function fetchAssets({ page, pageSize, ...filters }) {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
  });

  // Add any additional filters if they are truthy
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const res = await assetApiClient.get("/list", {params});

  return res.data;
}

export const fetchSummaries = async ({ startDate, endDate, page, rowsPerPage, endpoint }) => {
  const params = {};

  if (startDate) {
    params.start_date = startDate.toISOString().split("T")[0];
  }
  if (endDate) {
    params.end_date = endDate.toISOString().split("T")[0];
  }

  params.page = page || 1;
  params.page_size = rowsPerPage;

  const res = await summaryApiClient.get(`/${endpoint}`, { params });

  return res.data;
};

export const fetchDepreciation = async ({ page, rowsPerPage, endpoint, method, usefulLife }) => {
  const params = {};

  if (method) {
    params.method = method;
  }
  if (usefulLife) {
    params.useful_life = usefulLife;
  }

  params.page = page || 1;
  params.page_size = rowsPerPage;

  const res = await summaryApiClient.get(`/${endpoint}`, {
    params
  });

  return res.data;
}

export const createUser = async (bodyData) => {
  const { username, password, email, first_name, last_name, department } = bodyData;
  
  try {
    const res = await authApiClient.post("/registration", {
      username,
      password,
      email,
      first_name,
      last_name,
      department
    });

    return res.data;

  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw new Error("Unexpected error has occured.")
  } 
}

export const loginUser = async (bodyData) => {
  try {
    const res = await authApiClient.post("/login", bodyData);

    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw new Error("Unexpected error has occured.");
  }
}

export const logoutUser = async () => {
  try {
    const res = await authApiClient.post("/logout");

    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw new Error("Unexpected error has occured.");
  }
}

export const createMaintenanceReport = async (bodyData) => {
  try {
    const res = await summaryApiClient.post("/maintenance-report", bodyData);

    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw new Error("Unexpected error has occured.");
  }
}

export const verifyAuth = async () => {
  try{
    const res = await authApiClient.post("/verify");

    return res.data.is_authenticated;
  } catch (error) {
    console.log(error);
    return false;
  }
}


// Refresh token logic with axios-auth-refresh on asset and summary clients
createAuthRefreshInterceptor(assetApiClient, refreshAuthLogic);
createAuthRefreshInterceptor(summaryApiClient, refreshAuthLogic);
createAuthRefreshInterceptor(authApiClient, refreshAuthLogic);

const API_ROUTES = {
  getAllAssets: fetchAssets,
  getSummaries: fetchSummaries,
  getDepreciation: fetchDepreciation,
  postCreateUser: createUser,
  postLogin: loginUser,
  postMaintenanceAsset: createMaintenanceReport,
  postIsAuthenticated: verifyAuth,
  postLogout: logoutUser
}

export default API_ROUTES;
