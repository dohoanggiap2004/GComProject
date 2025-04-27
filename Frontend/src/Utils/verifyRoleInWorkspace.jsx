import {Navigate, useLocation, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useEffect} from "react";
import {getUserRoleInWorkspaceOrBoard} from "../store/actions/userAction.jsx";
import LoadingSpinner from "../components/Shared/LoadingSpinner.jsx";

const RoleProtectedRouteForWorkspace = ({children, allowedRoles = []}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const workspaceId = useParams()?.workspaceId || location?.state?.workspaceId || null
    const boardId = useParams()?.boardId || null
    const {role, error} = useSelector(state => state.user);
    useEffect(() => {
        if (workspaceId || boardId) {
            dispatch(getUserRoleInWorkspaceOrBoard({
                    workspaceId: workspaceId,
                    boardId: boardId,
                }
            ));
        }
    }, [workspaceId, boardId]);

    if (error) {
        return (
            <Navigate to="/unauthorized" replace/>
        )
    }

    if (!role) {
        return <LoadingSpinner/>;
    }

    return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" replace/>;
};

RoleProtectedRouteForWorkspace.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default RoleProtectedRouteForWorkspace;
