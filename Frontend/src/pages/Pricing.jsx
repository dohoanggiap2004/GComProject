import Navbar from "../components/Home/Navbar/Navbar.jsx";
import {CheckmarkIcon} from "react-hot-toast";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const Pricing = () => {
    const { isLoginUser } = useSelector(state => state.auth);
    return (
        <>
            <Navbar/>
            <div className="text-center mt-24 mb-4 px-4">
                <h1 className="text-4xl sm:text-5xl font-bold">GCom your way.</h1>
                <p className="mt-4 text-base sm:text-lg font-medium">
                    Trusted by millions, GCom powers teams all around the world. <br/>
                    Explore which option is right for you.
                </p>
            </div>
            <div
                className="mt-4 p-10 sm:mt-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-3xl lg:mx-auto">
                {/* Free Plan */}
                <div className="border border-neutral-200 rounded-lg shadow-sm divide-y divide-neutral-200">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-neutral-900">Free</h2>
                        <p className="mt-4 text-sm h-10 text-neutral-500">
                            Ideal for individuals managing personal boards and tasks.
                        </p>
                        <p className="mt-4 flex flex-col space-y-2">
                            <span className="text-5xl font-extrabold text-neutral-900">Free</span>
                        </p>
                        <Link to={`${isLoginUser ? '/user-workspace' : '/login'}`}
                            className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Get Started
                        </Link>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h3 className="text-xs font-medium text-neutral-900 tracking-wide uppercase">What's
                            included</h3>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Up to 5 boards</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Up to 5 workspaces</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Basic automation</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="border border-neutral-200 rounded-lg shadow-sm divide-y divide-neutral-200">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-neutral-900">Premium</h2>
                        <p className="mt-4 text-sm h-10 text-neutral-500">
                            Perfect for teams managing multiple projects and advanced workflows.
                        </p>
                        <p className="mt-4 flex flex-col space-y-2">
                        <span className="flex flex-row space-x-2 items-center">
                          <span className="text-5xl font-extrabold text-neutral-900">$10</span>
                          <span className="text-xs font-medium text-neutral-500">
                            per user/month<br/>billed annually
                          </span>
                        </span>
                        </p>
                        <Link
                            to={`${isLoginUser ? '/premium-payment' : '/login'}`}
                            className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Upgrade Now
                        </Link>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h3 className="text-xs font-medium text-neutral-900 tracking-wide uppercase">What's
                            included</h3>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Unlimited workspaces</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Unlimited boards</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Advanced automation</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Dashboard</span>
                            </li>
                            <li className="flex space-x-3">
                                <CheckmarkIcon/>
                                <span className="text-sm text-neutral-500">Priority support</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Pricing;
