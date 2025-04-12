import {Navigate, useLocation, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useEffect} from "react";
import {getUserRoleInWorkspaceOrBoard} from "../store/actions/userAction.js";

const RoleProtectedRouteForWorkspace = ({children, allowedRoles = []}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const workspaceId = useParams().workspaceId || location.state.workspaceId
    const {role} = useSelector(state => state.user);
    useEffect(() => {
        if (workspaceId) {
            dispatch(getUserRoleInWorkspaceOrBoard({
                    workspaceId: workspaceId,
                    boardId: null,
                }
            ));
        }
    }, [workspaceId]);

    if (!role) {
        return <div>Loading...</div>; // bạn có thể custom lại loading UI
    }

    return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" replace/>;
};

RoleProtectedRouteForWorkspace.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default RoleProtectedRouteForWorkspace;
