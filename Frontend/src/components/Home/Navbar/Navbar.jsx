import {IoMdClose, IoMdMenu} from "react-icons/io";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../store/actions/authAction.jsx";
import {Link} from "react-router-dom";
import {useState} from "react";
import {FaChevronDown} from "react-icons/fa";

const NavbarMenu = [
    {
        id: 1,
        title: "Features",
        path: "/",
    },
    {
        id: 2,
        title: "Solutions",
        link: "#",
    },
    {
        id: 3,
        title: "Plans",
        link: "#",
    },
    {
        id: 4,
        title: "Pricing",
        link: "#",
    },
    {
        id: 5,
        title: "Resources",
        link: "#",
    },
];
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const {isLoginUser} = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch(logoutUser());
    }
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md md:rounnd-md max-h-16 flex items-center">
            <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                className="container py-10 flex justify-between items-center"
            >
                {/* Logo section */}
                <div>
                    <Link to={'/'} className="font-bold text-2xl">GCOM</Link>
                </div>
                {/* Menu section */}
                <div className="hidden lg:block">
                    <ul className="flex items-center gap-3">
                        {NavbarMenu.map((menu) => (
                            <li key={menu.id}>
                                <a
                                    href={menu.path}
                                    className="flex items-center gap-1 py-2 px-3 hover:text-secondary relative group text-lg font-semibold"
                                >
                                    <div
                                        className="w-e h-2  bg-secondary absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden"></div>
                                    {menu.title} <FaChevronDown/>
                                </a>
                            </li>
                        ))}
                        {!isLoginUser ? <Link to={'/login'} className="primary-btn">Sign In</Link> :
                            <button onClick={handleLogout} className="primary-btn">Log out</button>}
                    </ul>
                </div>
                {/* Mobile Hamburger menu section */}
                <button onClick={() => setMenuOpen(true)} className="lg:hidden">
                    <IoMdMenu className="text-4xl"/>
                </button>
                <div
                    className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="p-5 flex justify-between items-center border-b">
                        <h2 className="text-xl font-semibold">GCom</h2>
                        <button onClick={() => setMenuOpen(false)}>
                            <IoMdClose className="text-3xl"/>
                        </button>
                    </div>

                    <ul className="p-5 space-y-4">
                        {NavbarMenu.map((item) => (
                            <li key={item.id}>
                                <a href={item.path || item.link}
                                   className="block flex items-center gap-1 py-2 text-lg hover:text-blue-600 text-xl font-semibold">
                                    {item.title} <FaChevronDown/>
                                </a>
                            </li>
                        ))}
                        <li>
                            {isLoginUser ? (
                                <button onClick={handleLogout}
                                        className="block py-2 text-lg hover:text-blue-600 text-xl font-semibold text-primary">
                                    Log out
                                </button>
                            ) : (
                                <Link to={'/login'} onClick={handleLogout}
                                        className="block py-2 text-lg hover:text-blue-600 text-xl font-semibold text-primary">
                                    Sign in
                                </Link>
                            )}

                        </li>
                    </ul>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
