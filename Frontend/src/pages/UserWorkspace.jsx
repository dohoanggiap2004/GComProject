import NavbarWorkspace from "../components/Navbar/Navbar-Workspace.jsx";

import Dashboard from "../components/Dashboard/Dashboard.jsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getWorkspaceByMemberId} from "../store/actions/workspaceAction.js";


const UserWorkspace = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getWorkspaceByMemberId())
    }, []);
    return (
        <>
            <NavbarWorkspace/>
            <Dashboard/>
        </>
    )
}

export default UserWorkspace;
