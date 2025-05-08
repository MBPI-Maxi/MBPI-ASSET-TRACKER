import { useQuery } from "@tanstack/react-query"
import axios from "axios";

async function fetchAssets(data) {
    // data should be a javascript object
    const url = "http://127.0.0.1:8000/api/asset/list"
    
    const response = await axios.get(url, {
        params: data
    })
    
    return response.data;
}

export function useAssetQuery(filters) {
    return useQuery({
        queryKey: ["assets", filters],
        queryFn: () => fetchAssets(filters),
        enabled: false
    })
}
