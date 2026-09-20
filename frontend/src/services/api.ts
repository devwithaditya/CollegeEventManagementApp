import axios from "axios";

const api = axios.create({
    baseURL: "https://event-handler-backend.yellowbay-549b6eaf.eastasia.azurecontainerapps.io/api",
    withCredentials: true,
});

export default api;