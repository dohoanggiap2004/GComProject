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

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path={'/register'} element={<Register/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path={'/user-workspace'} element={
                            <RoleProtectedRoute requiredRole={'user'}>
                                <UserWorkspace/>
                            </RoleProtectedRoute>
                        }
                        />
                        <Route path={'/user-workspace/board/:boardId'}
                               element={<RoleProtectedRoute requiredRole={'user'}>
                                   <BoardWorkspace/>
                               </RoleProtectedRoute>}/>
                        <Route path={'/user-profile'} element={
                            <RoleProtectedRoute requiredRole={'user'}>
                                <UserProfile/>
                            </RoleProtectedRoute>
                        }/>
                        <Route path='/unauthorized' element={<Unauthorized/>}/>
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;
