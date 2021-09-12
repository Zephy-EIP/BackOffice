import axios from "axios";
import { API_URL } from "@/utils/constants";
import { getToken, setToken } from "@/utils/token";

const client = axios.create({
    baseURL: API_URL
});

/// Automatically put the authorization token in request headers
client.interceptors.request.use(config => {
    let token = getToken();
    if (token !== null)
        config.headers.Authorization = token;
    return config;
});

client.interceptors.response.use(res => { return res; }, (err) => {
    if (axios.isAxiosError(err)) {
        const code = err.response?.status;
        console.log(code);
        if (code === 401) {
            setToken(null);
        }
    }
})

export default client;
