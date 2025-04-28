import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";

import Dashboard from "../components/Workspace/Dashboard.jsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getWorkspaceByMemberId} from "../store/actions/workspaceAction.jsx";
import Cookies from "js-cookie";

const UserWorkspace = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getWorkspaceByMemberId())
    }, []);

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        console.log('cookie: ', accessToken)
        // if (accessToken) {
        //     dispatch(getUserInfo())
        //     dispatch(loginUserSuccess());
        // } else if (!accessToken && isLoginUser) {
        //     getAccessToken();
        // } else if (!isLoginUser) {
        //     dispatch(logoutUser());
        // }

    }, [Cookies.get("accessToken")]);
    return (
        <>
            <NavbarWorkspace/>
            <Dashboard/>
        </>
    )
}

export default UserWorkspace;
