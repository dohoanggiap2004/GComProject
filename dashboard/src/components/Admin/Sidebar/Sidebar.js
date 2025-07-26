import {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {setSelectedItem} from "../../../store/reducers/itemReducer";
import {logoutAdmin} from "../../../store/actions/authAction";
import ConfirmModal from "../Modal/ConfirmModal";

function Sidebar( { handleSearch } ) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {selectedItemAdmin} = useSelector((state) => state.item);

    //open modal logout
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogout, setIsLogout] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleClickOutside = (event) => {
        // Check if the clicked target is outside the sidebar
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarOpen(false); // Close sidebar
        }
    };

    const handleSearchChange = (e) => {
        handleSearch(e.target.value);
    }

    const handleClick = (value) => {
        dispatch(setSelectedItem(value));
    }

    // handle logout
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleSelected = (value) => {
        setIsLogout(value);
    };

    useEffect(() => {
        const logoutAndNavigate = async () => {
            if (isLogout) {
                await dispatch(logoutAdmin());
                navigate('/admin/login');
            }
        };

        logoutAndNavigate();
    }, [isLogout]);

    //close side bar
    useEffect(() => {
        // Attach the event listener when the sidebar is open
        if (isSidebarOpen) {
            document.addEventListener("touchstart", handleClickOutside);
        } else {
            document.removeEventListener("touchstart", handleClickOutside);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                id="default-sidebar"
                className={`fixed bg-white top-0 left-0 z-40 w-72 h-screen transition-transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:block`}
                aria-label="Sidebar"
            >

                <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800 bg-white md:bg-gray-150">
                    <div className={'flex items-center p-8'}>
                        <h1 className={'text-3xl font-bold'} style={{color: '#1B254B'}}>QUẢN LÝ</h1>
                    </div>
                    <hr className="border border-gray-200 mb-4"/>

                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                to={"/admin"}
                                onClick={() => handleClick('dashboard')}
                                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group 
                                ${selectedItemAdmin === 'dashboard' ? 'bg-white' : 'bg-none'}`}
                            >
                                <svg
                                    className="w-5 h-5 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#5640FB"
                                    viewBox="0 0 22 21"
                                >
                                    <path
                                        d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                    <path
                                        d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                                </svg>
                                <span
                                    className={`ms-3 text-gray-400 text-md font-bold p-2  ${selectedItemAdmin === 'dashboard' ? '!text-gray-950' : 'bg-none'}`}>Bảng điều khiển</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to={"/admin/users"}
                                onClick={() => handleClick('users')}
                                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group 
                                ${selectedItemAdmin === 'users' ? 'bg-white' : 'bg-none'}`}
                            >
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#5640FB"
                                    viewBox="0 0 20 18"
                                >
                                    <path
                                        d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                                </svg>
                                <span
                                    className={`flex-1 ms-3 text-gray-400 text-md font-bold p-2 whitespace-nowrap ${selectedItemAdmin === 'users' ? '!text-gray-950' : 'bg-none'}`}>Người dùng</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/admin/transactions"}
                                onClick={() => handleClick('products')}
                                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group 
                                ${selectedItemAdmin === 'products' ? 'bg-white' : 'bg-none'}`}
                            >
                                <svg viewBox="0 0 24 24" className={'h-5 w-5'} fill="#5640FB"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M19.6471 15.5357H4.35294M19.6471 15.5357V8C19.6471 6.11438 19.6471 5.17157 19.0613 4.58579C18.4755 4 17.5327 4 15.6471 4H8.35294C6.46732 4 5.52451 4 4.93873 4.58579C4.35294 5.17157 4.35294 6.11438 4.35294 8V15.5357M19.6471 15.5357L21.3911 17.3358C21.4356 17.3818 21.4579 17.4048 21.4787 17.4276C21.7998 17.7802 21.9843 18.2358 21.999 18.7124C22 18.7433 22 18.7753 22 18.8393C22 18.9885 22 19.0631 21.996 19.1261C21.9325 20.1314 21.1314 20.9325 20.1261 20.996C20.0631 21 19.9885 21 19.8393 21H4.16068C4.01148 21 3.93688 21 3.87388 20.996C2.86865 20.9325 2.06749 20.1314 2.00398 19.1261C2 19.0631 2 18.9885 2 18.8393C2 18.7753 2 18.7433 2.00096 18.7124C2.01569 18.2358 2.20022 17.7802 2.52127 17.4276C2.54208 17.4048 2.56438 17.3818 2.60888 17.3358L4.35294 15.5357"
                                            stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                                        <path d="M9.5 18.5H14.5" stroke="#1C274C" stroke-width="1.5"
                                              stroke-linecap="round"></path>
                                        <path
                                            d="M12.75 6.75C12.75 7.16421 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.16421 11.25 6.75C11.25 6.33579 11.5858 6 12 6C12.4142 6 12.75 6.33579 12.75 6.75Z"
                                            fill="#1C274C"></path>
                                    </g>
                                </svg>
                                <span
                                    className={`flex-1 ms-3 text-gray-400 text-md font-bold p-2 whitespace-nowrap ${selectedItemAdmin === 'products' ? '!text-gray-950' : 'bg-none'}`}>Giao dịch</span>
                            </Link>
                        </li>

                        <li>
                            <a
                                onClick={() => toggleModal()}
                                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                            >
                                <svg viewBox="0 0 24 24" className={'h-5 w-5'} fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M16 16.9998L21 11.9998M21 11.9998L16 6.99982M21 11.9998H9M12 16.9998C12 17.2954 12 17.4432 11.989 17.5712C11.8748 18.9018 10.8949 19.9967 9.58503 20.2571C9.45903 20.2821 9.31202 20.2985 9.01835 20.3311L7.99694 20.4446C6.46248 20.6151 5.69521 20.7003 5.08566 20.5053C4.27293 20.2452 3.60942 19.6513 3.26118 18.8723C3 18.288 3 17.5161 3 15.9721V8.02751C3 6.48358 3 5.71162 3.26118 5.12734C3.60942 4.3483 4.27293 3.75442 5.08566 3.49435C5.69521 3.29929 6.46246 3.38454 7.99694 3.55503L9.01835 3.66852C9.31212 3.70117 9.45901 3.71749 9.58503 3.74254C10.8949 4.00297 11.8748 5.09786 11.989 6.42843C12 6.55645 12 6.70424 12 6.99982"
                                            stroke="#5640FB" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                                <span className="flex-1 ms-3 text-gray-400 text-md font-bold p-1.5 whitespace-nowrap">Đăng xuất</span>
                            </a>

                        </li>
                    </ul>

                </div>
            </aside>
            <ConfirmModal
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                handleSelected={handleSelected}
                confirmText="Bạn có chắc chắn muốn đăng xuất?"
            />


            <div className={'h-28 flex flex-col md:flex-row items-center justify-between me-8'}>

                {/*breadcrumb*/}
                <div className={'md:ms-8 my-4 lg:ms-80 items-center '}>

                    <nav aria-label="breadcrumb" className="w-full text-gray-800">
                        <ol className="flex h-8 space-x-2 text-gray-800">
                            <li className="flex items-center">
                                <a rel="noopener noreferrer" href="#" title="Back to homepage"
                                   className="flex items-center hover:underline">Trang chủ</a>
                            </li>

                            <li className="flex items-center space-x-1">
                                <span className="text-gray-600">/</span>
                                <a rel="noopener noreferrer" href="#"
                                   className="flex items-center px-1 capitalize cursor-default">
                                    {selectedItemAdmin === 'dashboard' && 'Bảng Điều Khiển'}
                                    {selectedItemAdmin === 'users' && 'Người Dùng'}
                                    {selectedItemAdmin === 'products' && 'Giao dịch'}
                                </a>
                            </li>
                        </ol>
                    </nav>

                    {/*title*/}
                    <p className={'text-3xl font-bold'} style={{color: '#1B254B'}}>
                        {selectedItemAdmin === 'dashboard' && 'BẢNG ĐIỀU KHIỂN'}
                        {selectedItemAdmin === 'users' && 'NGƯỜI DÙNG'}
                        {selectedItemAdmin === 'products' && 'GIAO DỊCH'}
                    </p>
                </div>

                {/*utils*/}
                <div className="flex items-center bg-white rounded-3xl p-2 ms-8 md:ms-0 w-80 lg:w-72">
                    {/*search bar*/}
                    <div className="max-w-[180px] w-full me-2">
                        <div className="relative">
                            <input type="text"
                                   name="query"
                                   onChange={handleSearchChange}
                                   className="w-full border h-10 p-4 rounded-full bg-gray-100"
                                   placeholder="Search..."/>
                            <button type="submit">
                            <svg
                                    className="text-teal-400 h-5 w-5 absolute top-3.5 right-3 fill-current dark:text-teal-300"
                                    version="1.1"
                                    x="0px" y="0px" viewBox="0 0 56.966 56.966"
                                >
                                    <path
                                        d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/*open side bar button*/}
                    <button
                        onClick={toggleSidebar}
                        aria-controls="default-sidebar"
                        type="button"
                        className="inline-flex items-center p-2 me-2 text-sm text-gray-400 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg fill="gray" viewBox="0 0 52 52" className={'w-5 h-5'} data-name="Layer 1" id="Layer_1"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M50,12.5H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z"></path>
                                <path d="M50,28H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z"></path>
                                <path d="M50,43.5H2a2,2,0,0,1,0-4H50a2,2,0,0,1,0,4Z"></path>
                            </g>
                        </svg>
                    </button>

                    {/*svg ring*/}
                    <svg version="1.1" id="Uploaded to svgrepo.com" className={'w-6 h-6 me-2'}
                         viewBox="0 0 32 32"
                         fill="gray">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path className="linesandangles_een"
                                  d="M24,20v-5c0-4.079-3.055-7.438-7-7.931V5h-2v2.069C11.055,7.562,8,10.921,8,15v5 c0,1.105-0.895,2-2,2v2h20v-2C24.895,22,24,21.105,24,20z M9.463,22C9.804,21.411,10,20.728,10,20v-5c0-3.308,2.692-6,6-6 s6,2.692,6,6v5c0,0.728,0.196,1.411,0.537,2H9.463z M15,25h2v2h-2V25z"></path>
                        </g>
                    </svg>

                    <div className={'h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600'}>
                        <p className={'text-white'}>G</p>
                    </div>

                </div>
            </div>


            {/* content */}
        </>
    );
}

export default Sidebar;
