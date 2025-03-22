import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { refreshToken } from "../store/actions/tokenAction";
import { useDispatch } from "react-redux";

export function useUserIdFromToken() {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                // Lấy accessToken từ cookies
                let accessToken = Cookies.get('accessToken');
                console.log('check acc', accessToken);

                if (!accessToken) {
                    console.log('Access token not found. Attempting to refresh...');
                    await dispatch(refreshToken()).unwrap(); // Chờ refresh token hoàn thành
                    accessToken = Cookies.get('accessToken'); // Lấy lại token sau khi làm mới
                    console.log('check acc aff', accessToken);

                    if (!accessToken) {
                        throw new Error('Access token not found in cookies even after refresh');
                    }
                }

                // Giải mã accessToken
                const decodedToken = jwtDecode(accessToken);
                console.log('decodedToken', decodedToken);
                if (!decodedToken || !decodedToken._id) {
                    throw new Error('Invalid token structure or missing ID');
                }

                // Trích xuất và đặt userId
                setUserId(decodedToken._id);
                setError(null);
            } catch (err) {
                console.error('Error decoding token:', err.message);
                setError(err.message);
                setUserId(null);
            }
        };

        fetchUserId();
    }, []);

    return { userId, error };
}
