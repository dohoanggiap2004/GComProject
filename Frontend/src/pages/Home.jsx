import Services from "../components/Home/Services/Services.jsx";
import Banner from "../components/Home/Banner/Banner.jsx";
import Subscribe from "../components/Home/Subscribe/Subscribe.jsx";
import Banner2 from "../components/Home/Banner/Banner2.jsx";
import Footer from "../components/Home/Footer/Footer.jsx";
import Hero from "../components/Home/Hero/Hero.jsx";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {refreshToken} from "../store/actions/tokenAction.jsx";
import {logoutUser} from "../store/actions/authAction.jsx";
import {loginUserSuccess} from "../store/reducers/authReducer.jsx";
import {getUserInfo} from "../store/actions/userAction.jsx";
import toast from "react-hot-toast";

const Home = () => {
    const dispatch = useDispatch();
    const {isLoginUser} = useSelector(state => state.auth)
    const getAccessToken = async () => {
        try {
            await dispatch(refreshToken());
            const newAccessToken = Cookies.get("accessToken");
            if (!newAccessToken) {
                dispatch(logoutUser());
            }
        } catch (error) {
            dispatch(logoutUser());
            toast.error('Error refreshing token: ', error);
        }
    };

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            dispatch(getUserInfo())
            dispatch(loginUserSuccess());
        } else if (!accessToken && isLoginUser) {
            getAccessToken();
        } else if (!isLoginUser) {
            dispatch(logoutUser());
        }

    }, []);
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
