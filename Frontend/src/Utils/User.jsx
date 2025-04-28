import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { refreshToken } from "../store/actions/tokenAction.jsx";
import { useDispatch } from "react-redux";

export function useUserFromToken() {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        _id: '',
        fullname: '',
        email: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                // Lấy accessToken từ cookies
                let accessToken = Cookies.get('accessToken');

                if (!accessToken) {
                    await dispatch(refreshToken()).unwrap();
                    accessToken = Cookies.get('accessToken');

                    if (!accessToken) {
                        throw new Error('Access token not found in cookies even after refresh');
                    }
                }

                // Giải mã accessToken
                const decodedToken = jwtDecode(accessToken);
                if (!decodedToken || !decodedToken._id) {
                    throw new Error('Invalid token structure or missing ID');
                }

                // Trích xuất và đặt userId
                setUser({
                    _id: decodedToken._id,
                    fullname: decodedToken.fullname,
                    email: decodedToken.email,
                });
                setError(null);
            } catch (err) {
                // console.error('Error decoding token:', err.message);
                setError(err.message);
                setUser(null);
            }
        };

        fetchUserId();
    }, []);

    return { user, error };
}
