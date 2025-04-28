import axios from "axios";

export const instanceAxios8000 = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_TIMEOUT || 10000),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const instanceAxiosFile8000 = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_TIMEOUT || 10000),
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

instanceAxios8000.interceptors.response.use(
    (response) => response,
    async (error) => {
        const {response, config} = error;

        if (response.status !== 401) {
            return Promise.reject(error); // Không phải lỗi 401, trả về lỗi bình thường
        }
        // Làm mới token
        try {
            await axios.get("/refresh-token", {
                baseURL: import.meta.env.VITE_API_URL,
                timeout: Number(import.meta.env.VITE_TIMEOUT || 10000),
                withCredentials: true,
            });
            return await instanceAxios8000(config);
        } catch {
            return await Promise.reject(error);
        }
    }
);



