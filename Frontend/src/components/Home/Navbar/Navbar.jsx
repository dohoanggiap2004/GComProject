import {IoIosSettings, IoMdClose, IoMdMenu} from "react-icons/io";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../store/actions/authAction.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {FaChevronDown, FaChevronRight, FaChevronLeft, FaPlug, FaPencilAlt, FaLightbulb, FaStar} from "react-icons/fa";
import {MdOutlineEngineering, MdOutlineForwardToInbox} from "react-icons/md"
import {SlCalender} from "react-icons/sl";
import {AiTwotoneThunderbolt} from "react-icons/ai";
import {GrTemplate} from "react-icons/gr";
import {HiSpeakerphone} from "react-icons/hi";
import {HiClipboardDocumentList} from "react-icons/hi2";
import {PiBagSimpleFill} from "react-icons/pi";
import {LuBuilding2, LuEarth} from "react-icons/lu";
import toast from "react-hot-toast";


const NavbarMenu = [
    {
        id: 1,
        title: "Features",
        text: "Explore the features that help your team succeed",
        path: "/",
        dropdown: [
            {
                title: "Inbox",
                description:
                    "Capture every vital detail from emails, Slack, and more directly into your Trello inbox.",
                icon: MdOutlineForwardToInbox,
            },
            {
                title: "Planner",
                description:
                    "Sync your calendar and allocate focused time slots to boost productivity.",
                icon: SlCalender,
            },
            {
                title: "Automation",
                description: "Automate tasks and workflows with Butler automation.",
                icon: AiTwotoneThunderbolt,
            },
            {
                title: "Power-Ups",
                description:
                    "Power up your teams by linking their favorite tools with Trello plugins.",
                icon: FaPlug,
            },
            {
                title: "Templates",
                description:
                    "Give your team a blueprint for success with easy-to-use templates from industry leaders and the Trello community.",
                icon: GrTemplate,
            },
            {
                title: "Integrations",
                description:
                    "Find the apps your team is already using or discover new ways to get work done in Trello.",
                icon: IoIosSettings,
            },
        ],
    },
    {
        id: 2,
        title: "Solutions",
        text: "Take a page out of these pre-built Trello playbooks designed for all teams",
        link: "#",
        dropdown: [
            {
                title: "Marketing teams",
                description:
                    "Whether launching a new product, campaign, or creating content, Trello helps marketing teams succeed.",
                icon: HiSpeakerphone,
            },
            {
                title: "Product management",
                description:
                    "Use Trello’s management boards and roadmap features to simplify complex projects and processes.",
                icon: HiClipboardDocumentList,
            },
            {
                title: "Engineering teams",
                description:
                    "Ship more code, faster, and give your developers the freedom to be more agile with Trello.",
                icon: MdOutlineEngineering,
            },
            {
                title: "Design teams",
                description:
                    "Empower your design teams by using Trello to streamline creative requests and promote more fluid cross-team collaboration.",
                icon: FaPencilAlt,
            },
            {
                title: "Startups",
                description:
                    "From hitting revenue goals to managing workflows, small businesses thrive with Trello.",
                icon: PiBagSimpleFill,
            },
            {
                title: "Remote teams",
                description:
                    "Keep your remote team connected and motivated, no matter where they’re located around the world.",
                icon: LuEarth,
            },
        ],
    },
    {
        id: 3,
        title: "Plans",
        text: "",
        link: "#",
        dropdown: [
            {
                title: "Standard",
                description:
                    "For teams that need to manage more work and scale collaboration.",
                icon: FaLightbulb,
            },
            {
                title: "Premium",
                description:
                    "Best for teams up to 100 that need to track multiple projects and visualize work in a variety of ways.",
                icon: FaStar,
            },
            {
                title: "Enterprise",
                description:
                    "Everything your enterprise teams and admins need to manage projects.",
                icon: LuBuilding2,
            },
            {
                title: "Free plan",
                description:
                    "For individuals or small teams looking to keep work organized.",
                icon: AiTwotoneThunderbolt,
            },
        ],
    },
    {
        id: 4,
        title: "Pricing",
        link: "#",
        dropdown: [],
    },
    {
        id: 5,
        title: "Resources",
        text: "Learn & connect",
        link: "#",
        dropdown: [
            {
                title: "Trello guide",
                description:
                    "Our easy to follow workflow guide will take you from project set-up to Trello expert in no time.",
                icon: "",
            },
            {
                title: "Remote work guide",
                description:
                    "The complete guide to setting up your team for remote work success.",
                icon: "",
            },
            {
                title: "Webinars",
                description:
                    "Enjoy our free Trello webinars and become a productivity professional.",
                icon: "",
            },
            {
                title: "Customer stories",
                description:
                    "See how businesses have adopted Trello as a vital part of their workflow.",
                icon: "",
            },
            {
                title: "Developers",
                description:
                    "The sky’s the limit in what you can deliver to Trello users in your Power-Up!",
                icon: "",
            },
            {
                title: "Help resources",
                description: "Need help? Articles and FAQs to get you unstuck.",
                icon: "",
            },
        ],
    },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
    const [activeMenuItem, setActiveMenuItem] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {isLoginUser} = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success('Logout successfully', {
                duration: 3000,
            });
            navigate('/');
        } catch (err) {
            toast.error(err || "Error while logout!");
        }
    };

    const toggleDropdown = (menuId) => {
        setDropdownOpen(dropdownOpen === menuId ? null : menuId); // Toggle dropdown for the clicked menu item
    };

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [menuOpen]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md md:rounnd-md max-h-16 flex items-center">
            <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                className="container py-10 flex justify-between items-center"
            >
                {/* Logo section */}
                <div>
                    <Link to={"/"} className="font-bold text-2xl">
                        GCOM
                    </Link>
                </div>

                {/* Menu section */}
                <div className="hidden lg:block">
                    <ul className="flex items-center gap-3">
                        {NavbarMenu.map((menu) => (
                            <li key={menu.id}>
                                {menu.title === 'Pricing' ? (
                                    <Link
                                        to={'/pricing'}
                                        className={`flex items-center gap-1 py-2 px-3 hover:text-secondary group cursor-pointer
                                    ${
                                            dropdownOpen === menu.id
                                                ? "text-blue-400 border-b-2 border-blue-400"
                                                : ""
                                        }`}
                                    >
                                        {menu.title} <FaChevronDown className="h-3"/>
                                    </Link>
                                ) : (
                                    <div
                                        onClick={() => toggleDropdown(menu.id)}
                                        className={`flex items-center gap-1 py-2 px-3 hover:text-secondary group cursor-pointer
                                    ${
                                            dropdownOpen === menu.id
                                                ? "text-blue-400 border-b-2 border-blue-400"
                                                : ""
                                        }`}
                                    >
                                        {menu.title} <FaChevronDown className="h-3"/>
                                    </div>
                                )}

                                {/* Dropdown Menu */}
                                {dropdownOpen === menu.id && menu.dropdown.length > 0 && (
                                    <div
                                        className="absolute top-full left-0 bg-white rounded-md px-50 py-6 w-full z-50 mx-auto shadow-dark2 shadow-2xl">
                                        <h3 className="text-lg font-semibold mb-6">{menu.text}</h3>
                                        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                                            {menu.dropdown.map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    {item.icon !== "" && <item.icon className="text-xl"/>}
                                                    <div>
                                                        <h4 className="font-medium text-sm">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                        {!isLoginUser ? (
                            <Link to={"/login"} className="primary-btn">
                                Sign In
                            </Link>
                        ) : (
                            <button onClick={handleLogout} className="primary-btn py-1 text-sm">
                                Log out
                            </button>
                        )}
                    </ul>
                </div>

                {/* Mobile Hamburger menu section */}
                <button onClick={() => setMenuOpen(true)} className="lg:hidden">
                    <IoMdMenu className="text-4xl"/>
                </button>

                {menuOpen && (
                    <div
                        className={`fixed top-0 right-0 w-full h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${
                            menuOpen ? "translate-y-0" : "-translate-y-full"
                        }`}
                    >
                        <div className="p-5 flex justify-between items-center border-b">
                            {activeMenuItem !== null ? (
                                <>
                                    <button
                                        onClick={() => setActiveMenuItem(null)}
                                        className="text-xl flex items-center"
                                    >
                                        <FaChevronLeft className="h-3"/> Back
                                    </button>

                                    <button onClick={() => setMenuOpen(false)}>
                                        <IoMdClose className="text-3xl"/>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold">GCom</h2>
                                    <button onClick={() => setMenuOpen(false)}>
                                        <IoMdClose className="text-3xl"/>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="p-5">
                            {activeMenuItem === null ? (
                                <ul className="space-y-4">
                                    {NavbarMenu.map((item) => (
                                        <li key={item.id}>
                                            <div
                                                onClick={() => setActiveMenuItem(item.id)}
                                                className="flex items-center justify-between gap-1 py-2 hover:text-blue-600 cursor-pointer border-b-2"
                                            >
                                                {item.title} <FaChevronRight className="h-3"/>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
                                        {isLoginUser ? (
                                            <button
                                                onClick={handleLogout}
                                                className="block py-2 text-lg hover:text-blue-600 font-semibold text-primary"
                                            >
                                                Log out
                                            </button>
                                        ) : (
                                            <Link
                                                to={"/login"}
                                                className="block py-2 text-lg hover:text-blue-600 font-semibold text-primary"
                                            >
                                                Sign in
                                            </Link>
                                        )}
                                    </li>
                                </ul>
                            ) : (
                                // Hiển thị submenu tương ứng
                                <div className="space-y-3">
                                    {NavbarMenu.find(
                                        (item) => item.id === activeMenuItem
                                    )?.dropdown.map((subItem, index) => (
                                        <div key={index} className="py-2 border-b">
                                            <div className={'flex items-center gap-2'}>
                                                {subItem.icon !== '' &&
                                                    <subItem.icon className="text-xl"/>
                                                }
                                                <h4 className="font-medium">
                                                    {subItem.title}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {subItem.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </nav>
    );
};

export default Navbar;
