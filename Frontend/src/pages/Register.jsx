import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {registerUser, setFalseRegister} from "../store/actions/authAction.jsx";
import toast from "react-hot-toast";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isRegister, registerError} = useSelector(state => state.auth);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        setError('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if( formData?.password !== formData?.confirmPassword ) {
            setError('Confirm password does not match');
        } else if( !formData.terms ) {
            setError('Term must be checked');
        }
        else {
            dispatch(registerUser(formData))
        }
    };

    useEffect(() => {
        setError(registerError)
    }, [registerError])

    useEffect(() => {
        if (isRegister) {
            toast.success("Register successfully!");
            dispatch(setFalseRegister())
            navigate("/login")
        }
    }, [isRegister, dispatch]);


    return (
        <div className="bg-blue-50 flex items-center justify-center min-h-screen">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                    Create an Account
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 mt-2 text-sm font-medium mb-2">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center mb-5">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-gray-700">
                            I agree to the <a href="#" className="text-blue-500 hover:underline">terms and
                            conditions</a>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <Link to={'/login'} className="mt-6 text-center text-gray-600">
                    Already have an account? <a href="#" className="text-blue-500 hover:underline">Sign in</a>
                </Link>
            </div>
        </div>
    );
};

export default Register
