import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import ScrollConfig from "./config/scrollConfig";
import Admin from "./pages/Admin/Dashboard/Admin_Dashboard";
import Users from "./pages/Admin/Admin_Users/Admin_Users";
import Transactions from "./pages/Admin/Admin_Transactions/Admin_Transactions";
import AdminLogin from "./pages/Admin/Admin_Login/Admin_Login";
import Unauthorized from "./pages/Unauthozired/Unauthozired";
import RoleProtectedRoute from "./Utils/verifyRole";
import store from "./store/reducers/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "./store/reducers/store";


function App() {

    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <ScrollConfig/>
                        <Routes>
                            <Route path="/" element={<Navigate to="/admin/login" />} />
                            <Route path="/admin" element={
                                <RoleProtectedRoute requiredRole={'admin'}>
                                    <Admin/>
                                </RoleProtectedRoute>
                            }/>
                            <Route path="/admin/login"
                                   element={
                                       <AdminLogin/>
                                   }
                            />
                            <Route path="/admin/users" element={
                                <RoleProtectedRoute requiredRole={'admin'}>
                                    <Users/>
                                </RoleProtectedRoute>
                            }/>
                            <Route path="/admin/transactions" element={
                                <RoleProtectedRoute requiredRole={'admin'}>
                                    <Transactions/>
                                </RoleProtectedRoute>
                            }/>
                            <Route path='/unauthorized' element={<Unauthorized/>}/>
                        </Routes>
                    </Router>
                </PersistGate>
            </Provider>
        </>
    );
}

export default App;
