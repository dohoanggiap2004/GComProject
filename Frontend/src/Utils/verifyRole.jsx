import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const RoleProtectedRoute = ({ children, requiredRole }) => {
    const { role } = useSelector((state) => state.auth);

    return role === requiredRole ? children : <Navigate to="/unauthorized" replace />;
};

RoleProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string.isRequired,
};

export default RoleProtectedRoute;
