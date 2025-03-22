
import { FaRegClipboard, FaHome,} from "react-icons/fa";
import VerticalWorkspace from "../Workspace/VerticalWorkspace.jsx";
import {BsGrid1X2Fill} from "react-icons/bs";

const Sidebar = () => {
    return (
        <div className="bg-gray-100 w-64 min-h-screen p-4 hidden md:block">
            <div className="space-y-2">
                <button className="flex items-center w-full p-2 text-blue-600 bg-blue-100 rounded-lg">
                    <FaRegClipboard className="mr-2" /> Boards
                </button>
                <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                    <BsGrid1X2Fill className="mr-2"/> Templates
                </button>
                <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                    <FaHome className="mr-2" /> Home
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-semibold">Workspaces</h3>
                <VerticalWorkspace/>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-gray-800 font-semibold">Try GCom Premium</h3>
                <p className="text-gray-600 text-sm mt-2">
                    Get unlimited boards, card mirroring, unlimited automation, and more.
                </p>
                <button className="mt-3 text-blue-500 hover:underline">Start free trial</button>
            </div>
        </div>
    );
};

export default Sidebar;
