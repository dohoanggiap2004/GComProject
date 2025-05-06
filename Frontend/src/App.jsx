import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "./store/reducers/store.jsx";
import store from "./store/reducers/store.jsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import UserWorkspace from "./pages/UserWorkspace.jsx";
import BoardWorkspace from "./pages/BoardWorkspace.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import RoleProtectedRoute from "./Utils/verifyRole.jsx";
import Unauthorized from "./pages/Unauthozired.jsx";
import {Toaster} from "react-hot-toast";
import WorkspaceSetting from "./pages/WorkspaceSetting.jsx";
import MemberManagement from "./pages/MemberManagement.jsx";
import RoleProtectedRouteForWorkspace from "./Utils/verifyRoleInWorkspace.jsx";
import Pricing from "./pages/Pricing.jsx";
import PremiumPayment from "./pages/PremiumPayment.jsx";
import Messenger from "./pages/Messenger.jsx";
import BoardDashboard from "./pages/BoardDashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Toaster
                        toastOptions={{
                            className: " p-6 min-w-96 w-full",
                            position: "bottom-left",
                        }}
                    />
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/pricing" element={<Pricing/>}/>
                        <Route path={'/register'} element={<Register/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path={'/premium-payment'} element={
                            <RoleProtectedRoute allowedRoles={['user']}>
                                <PremiumPayment/>
                            </RoleProtectedRoute>
                        }
                        />
                        <Route path={'/user-workspace'} element={
                            <RoleProtectedRoute allowedRoles={['user']}>
                                <UserWorkspace/>
                            </RoleProtectedRoute>
                        }
                        />
                        <Route path={'/messenger'} element={
                            <RoleProtectedRoute allowedRoles={['user']}>
                                <Messenger/>
                            </RoleProtectedRoute>
                        }
                        />
                        <Route path={'/user-workspace/board/:boardId'}
                               element={
                                   <RoleProtectedRoute allowedRoles={['user']}>
                                       <RoleProtectedRouteForWorkspace allowedRoles={["workspaceMember", "admin", "member", "viewer"]}>
                                           <BoardWorkspace/>
                                       </RoleProtectedRouteForWorkspace>
                                   </RoleProtectedRoute>}/>
                        <Route path={'/user-workspace/board/dashboard/:boardId'}
                               element={
                                   <RoleProtectedRoute allowedRoles={['user']}>
                                       <RoleProtectedRouteForWorkspace allowedRoles={["workspaceMember", "admin"]}>
                                           <BoardDashboard/>
                                       </RoleProtectedRouteForWorkspace>
                                   </RoleProtectedRoute>}/>
                        <Route
                            path="/user-workspace/member/:workspaceId"
                            element={
                                <RoleProtectedRoute allowedRoles={['user']}>
                                    <RoleProtectedRouteForWorkspace allowedRoles={["workspaceMember"]}>
                                        <MemberManagement/>
                                    </RoleProtectedRouteForWorkspace>
                                </RoleProtectedRoute>
                            }
                        />

                        <Route path={'/user-profile'} element={
                            <RoleProtectedRoute allowedRoles={['user']}>
                                <UserProfile/>
                            </RoleProtectedRoute>
                        }/>
                        <Route path={'/user-workspace/workspace-setting'} element={
                            <RoleProtectedRoute allowedRoles={['user']}>
                                <RoleProtectedRouteForWorkspace allowedRoles={["workspaceMember"]}>
                                    <WorkspaceSetting/>
                                </RoleProtectedRouteForWorkspace>
                            </RoleProtectedRoute>
                        }/>
                        <Route path='/coming-soon' element={<ComingSoon/>}/>
                        <Route path='/unauthorized' element={<Unauthorized/>}/>
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;
