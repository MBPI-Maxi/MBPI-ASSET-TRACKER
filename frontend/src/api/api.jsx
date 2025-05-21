import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const ASSET_URL = import.meta.env.VITE_BACKEND_ASSET_URL;

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


const API_ROUTES = {
  getAllAssets: fetchAssets
}

export default API_ROUTES;
