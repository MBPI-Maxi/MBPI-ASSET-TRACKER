import axios from "axios";

const ASSET_URL = import.meta.env.VITE_BACKEND_ASSET_URL;
const SUMMARY_URL = import.meta.env.VITE_BACKEND_SUMMARY_URL;

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

  const api = `${ASSET_URL}/list?${params.toString()}`;
  const res = await axios.get(api);

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

  const res = await axios.get(`${SUMMARY_URL}/${endpoint}`, {
    params
  });
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${SUMMARY_URL}/${endpoint}?${queryString}`;
  console.log(fullUrl);

  return res.data;
};

export const fetchDepreciation = async({ page, rowsPerPage, endpoint, method, usefulLife  }) => {
  const params = {};

  if (method) {
    params.method = method;
  }
  if (usefulLife) {
    params.useful_life = usefulLife;
  }

  params.page = page || 1;
  params.page_size = rowsPerPage;

  const res = await axios.get(`${SUMMARY_URL}/${endpoint}`, {
    params
  })

  return res.data;
}


const API_ROUTES = {
  getAllAssets: fetchAssets,
  getSummaries: fetchSummaries,
  getDepreciation: fetchDepreciation
}

export default API_ROUTES;
