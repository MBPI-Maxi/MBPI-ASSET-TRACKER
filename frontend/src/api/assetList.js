import { useQuery } from "@tanstack/react-query"
import axios from "axios";

async function fetchAssets(data) {
    // data should be a javascript object
    const response = await axios.get("http://127.0.0.1:8000/api/asset/list", {
        params: data
    })

    return response.data;
}

function useAssetQuery(filters) {
    return useQuery({
        queryKey: ["assets", filters],
        queryFn: () => fetchAssets(filters),
        enabled: false
    })
}

export default useAssetQuery;