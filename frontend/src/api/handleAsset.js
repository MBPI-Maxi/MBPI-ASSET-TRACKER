import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const url = "http://127.0.0.1:8000/api/asset"

function createAssetCall() {
    const mutation = useMutation({
        mutationFn: (data) => {
            return axios.post(url, data);
        }
    })

    return mutation;
}

export default createAssetCall;