import {FaRegClipboard, FaUserFriends, FaCog, FaCrown,} from "react-icons/fa";
import {CiViewTable} from "react-icons/ci";
import {IoCalendarOutline} from "react-icons/io5";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

const SidebarBoard = () => {
    const {board, workspace} = useSelector((state) => state.workspace);
    return (
        <div className="w-64 min-h-screen p-4 hidden md:block">
            <Link to={'/user-workspace'} className="flex items-center">
                <span className="bg-green-500 text-white px-3 py-2 rounded-md text-xs mr-2">G</span>
                {workspace?.name?.length > 15 ? `${workspace?.name?.slice(0, 15)}...` : workspace?.name}
            </Link>

            <div className={'border-b-2 border-gray-400 m-4'}></div>

            <div className="space-y-2">
                <Link to={'/coming-soon'}
                    className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                    <FaRegClipboard className="mr-2"/> Boards
                </Link>
                <Link to={`/user-workspace/member/${workspace?._id}`}
                    className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                    <FaUserFriends className="mr-2"/> Members
                </Link>
                <Link to={`/user-workspace/workspace-setting`}
                    className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                    <FaCog className="mr-2"/> Settings
                </Link>
            </div>

            <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-semibold">Workspaces</h3>
                <div className="ml-1 space-y-2 mt-2">
                    <Link to={'/coming-soon'}
                        className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                        <CiViewTable className="mr-2"/> Table
                    </Link>
                    <Link to={'/coming-soon'}
                        className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                        <IoCalendarOutline className="mr-2"/> Calendar
                    </Link>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-semibold">Your boards</h3>
                <div className="ml-1 space-y-2 mt-2">
                    {Array.isArray(board) && board.length > 0 ? (
                        board.map((board) => (
                            <button key={board._id}
                                className="flex items-center w-full p-1 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                                <Link to={`/user-workspace/board/${board._id}`} className="flex items-center"
                                      state={{ workspaceName: workspace.name, workspaceId: workspace._id }}>
                                    {board.background ? (
                                        <img src={board.background} alt={board.title} className="w-5 h-5 object-cover mr-2 " />
                                    ) : (<div className="w-5 h-5 bg-white mr-2 border-2 ">
                                    </div>)}

                                    <div>
                                        {board.title}
                                    </div>
                                </Link>
                            </button>
                        ))
                    ) : (
                        <div></div>
                    )}

                </div>
            </div>

            <div className={'border-t-2 border-gray-400 mt-4'}></div>

            <div className="mt-6 p-2 bg-linear-to-r from-indigo-900 to-purple-600 rounded-lg text-sm shadow-md flex items-center">
                <FaCrown className="text-white mr-2" />
                <Link to={'/pricing'} className="text-white font-semibold">Try GCom Premium</Link>
            </div>
        </div>
    );
};

export default SidebarBoard;
