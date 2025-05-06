
import { FaRegClipboard,} from "react-icons/fa";
import VerticalWorkspace from "./VerticalWorkspace.jsx";
import {BsGrid1X2Fill} from "react-icons/bs";
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-72 p-4 hidden md:block">
            <div className="space-y-2">
                <button className="flex items-center w-full p-2 text-blue-600 bg-blue-100 rounded-lg text-sm font-semibold">
                    <FaRegClipboard className="mr-2" /> Boards
                </button>
                <Link to={'/coming-soon'} className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-semibold">
                    <BsGrid1X2Fill className="mr-2"/> Templates
                </Link>
            </div>

            <hr className={'text-gray-600'} />

            <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-semibold">Workspaces</h3>
                <VerticalWorkspace/>
            </div>

            <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded-lg text-sm shadow-md">
                <Link to={'/pricing'} className="text-gray-800 font-semibold underline">Try GCom Premium</Link>
                <p className="text-gray-600 text-sm mt-2">
                    Get unlimited boards, card mirroring, unlimited automation, and more.
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
