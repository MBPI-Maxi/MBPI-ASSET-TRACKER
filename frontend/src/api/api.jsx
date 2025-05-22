import axios from "axios";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;
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

export const fetchDeptPurchasedSummary = async ({ startDate, endDate, page }) => {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("start_date", startDate.toISOString().split("T")[0]);
  }
  if (endDate) {
    params.append("end_date", endDate.toISOString().split("T")[0]);
  }
  params.append("page", page || 1);

  const res = await axios.get(`${SUMMARY_URL}/dept-purchased-summary?${params.toString()}`, { params });

  return res.data;
};


const API_ROUTES = {
  getAllAssets: fetchAssets,
  getDeptPurchasedSummary: fetchDeptPurchasedSummary,
}

export default API_ROUTES;
