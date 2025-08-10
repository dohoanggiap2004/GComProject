import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginGG, loginUser} from "../store/actions/authAction.jsx";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoginUser, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(() => (
            {
                ...formData,
                [name]: value,
            }
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData))
    };

    useEffect(() => {
        if (isLoginUser) {
            toast.success("Login successfully!");
            navigate("/");
        } else {
            navigate("/login");
        }
    }, [isLoginUser])


    const handleClickGG = () => {
        dispatch(loginGG())
    };

    return (
        <div className={'bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center p-4'}>
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div
                        className="bg-linear-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">

                    </div>
                </div>

                {/* Login Card */}
                <div
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-500 hover:shadow-xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 mt-2">Please sign in to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="relative">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">

                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">

                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            {/*error log*/}
                            {error && (
                                <div className="text-red-500 mt-2 text-sm font-medium mb-2">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    // checked={formData.remember}
                                    // onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-sm"
                                />
                                <label
                                    className="ml-2 text-gray-600 text-sm"
                                    htmlFor="remember"
                                >
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500">
                Or continue with
              </span>
                            </div>
                        </div>

                        {/* GG Button */}
                        <button
                            onClick={handleClickGG}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg group"
                        >
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
              Login with Google
            </span>
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to={'/register'}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login

