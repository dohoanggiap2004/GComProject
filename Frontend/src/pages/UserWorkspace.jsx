import NavbarWorkspace from "../components/Workspace/Navbar-Workspace.jsx";

import Dashboard from "../components/Workspace/Dashboard.jsx";
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
