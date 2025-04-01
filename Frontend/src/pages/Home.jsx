import Services from "../components/Services/Services.jsx";
import Banner from "../components/Banner/Banner.jsx";
import Subscribe from "../components/Subscribe/Subscribe.jsx";
import Banner2 from "../components/Banner/Banner2.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Hero from "../components/Hero/Hero.jsx";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {refreshToken} from "../store/actions/tokenAction.js";
import {logoutUser} from "../store/actions/authAction.jsx";
import {loginUserSuccess} from "../store/reducers/authReducer.jsx";
import {useUserFromToken} from "../Utils/User.jsx";

const Home = () => {
    const dispatch = useDispatch();
    const {isLoginUser} = useSelector(state => state.auth)
    const { user } = useUserFromToken()
    const getAccessToken = async () => {
        try {
            await dispatch(refreshToken());
            const newAccessToken = Cookies.get("accessToken");
            if (!newAccessToken) {
                dispatch(logoutUser());
            }
        } catch (error) {
            dispatch(logoutUser());
            console.error('Error refreshing token:', error);
        }
    };

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
            dispatch(loginUserSuccess(user));
        } else if (!accessToken && isLoginUser) {
            getAccessToken();
        } else if (!isLoginUser) {
            dispatch(logoutUser());
        }
    }, [user]);
    return (

        <main className="overflow-x-hidden bg-white text-dark">
            <Hero/>
            <Services/>
            <Banner/>
            <Subscribe/>
            <Banner2/>
            <Footer/>
        </main>
    )
}

export default Home
