import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";

import Dashboard from "../components/Workspace/Dashboard.jsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getWorkspaceByMemberId} from "../store/actions/workspaceAction.jsx";


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
