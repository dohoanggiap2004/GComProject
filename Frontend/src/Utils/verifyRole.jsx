import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { role } = useSelector((state) => state.auth);

    return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" replace />;
};

RoleProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default RoleProtectedRoute;
