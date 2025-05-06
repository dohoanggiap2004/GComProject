import BoardItem from "../Board/BoardItem.jsx";
import Sidebar from "./Sidebar.jsx";
import {MdAccessTime,} from "react-icons/md";
import HorizontalWorkspace from "./HorizontalWorkspace.jsx";
import {GoPlus} from "react-icons/go";
import {useDispatch, useSelector} from "react-redux";
import WorkspaceCreateModel from "./WorkspaceCreateModal.jsx";
import {useEffect, useState} from "react";
import {getBoardByMemberId, getBoardByWorkspaceIds} from "../../store/actions/boardAction.jsx";
import BoardCreateModel from "./BoardCreateModal.jsx";
import {Link} from "react-router-dom";
import {getQuantityUserWorkspace} from "../../store/actions/userAction.jsx";
import toast from "react-hot-toast";

const recentBoards = [
    {title: "test", image: `${import.meta.env.VITE_API_URL}/img/bg-purple.jpg`},
    {title: "DoHoangGiap", image: `${import.meta.env.VITE_API_URL}/img/bg-purple.jpg`},
    {title: "A Lead Management Pipeline by Crmble", image: `${import.meta.env.VITE_API_URL}/img/bg-purple.jpg`},
    {title: "Mise-En-Place Personal Productivity System", image: `${import.meta.env.VITE_API_URL}/img/bg-purple.jpg`},
    {title: "Mise-En-Place Personal Productivity System", image: `${import.meta.env.VITE_API_URL}/img/bg-purple.jpg`},
];

const Dashboard = () => {
    const {workspaces} = useSelector((state) => state.workspace);
    const {boards, boardGuest} = useSelector((state) => state.board);
    const {boardViewed} = useSelector((state) => state.history);
    const {quantityWorkspace} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isBoardOpen, setIsBoardOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(getQuantityUserWorkspace())
    }, [])

    useEffect(() => {
        dispatch(getBoardByMemberId())
    }, [])

    useEffect(() => {
        if (workspaces && workspaces.length > 0) {
            const uniqueWorkspaceIds = [...new Set(workspaces.map(ws => ws._id))];

            Promise.all(uniqueWorkspaceIds.map(id => dispatch(getBoardByWorkspaceIds(id))))
                .then()
                .catch(() => toast.error("Error fetching boards:"));
        }
    }, [workspaces]);

    return (
        <div className="flex justify-center mt-10">
            <Sidebar/>
            <div className="w-full lg:max-w-4xl p-6 -mt-2">
                {Array.isArray(boardViewed) && boardViewed.length > 0 && (
                    <>
                        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                            <MdAccessTime className="mr-2"/> Recently viewed
                        </h2>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-6 mb-6">
                            {boardViewed.map((board) => (
                                <Link to={`/user-workspace/board/${board._id}`} key={board._id} >
                                    <BoardItem title={board.title} background={board.background}/>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
                <h2 className="text-lg font-bold text-gray-700 mb-4">YOUR WORKSPACES</h2>
                {
                    Array.isArray(workspaces) && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <div className={'mb-6'} key={workspace._id}>
                                <HorizontalWorkspace workspaceId={workspace._id} name={workspace.name}
                                                     memberQuantity={workspace.memberQuantity}/>

                                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {Array.isArray(boards[workspace._id]) && boards[workspace._id].length > 0 ? boards[workspace._id].map((board, index) => (
                                        <Link
                                            to={`/user-workspace/board/${board._id}`}
                                            key={index}
                                        >
                                            <BoardItem title={board.title} background={board.background}/>
                                        </Link>
                                    )) : null}
                                    <button
                                        className="w-40 h-24 md:w-48 bg-gray-200 rounded-lg overflow-hidden shadow-md relative"
                                        onClick={() => {
                                            setIsBoardOpen(true);
                                            setSelectedId(workspace._id)
                                        }}
                                    >
                                        <div className="absolute inset-0 flex-col flex items-center justify-center">
                                            <p className="text-gray-700 font-semibold">Create new board</p>
                                            {quantityWorkspace !== 'unlimited' && (
                                                <p className="text-gray-600 i text-xs font-semibold">Limited 5
                                                    boards</p>
                                            )}
                                        </div>
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <>
                            <button
                                className="flex items-center justify-between w-full p-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg border-2 border-gray-900"
                                onClick={() => setIsWorkspaceOpen(true)}
                            >
                            <span className="flex items-center">
                                <GoPlus className={'mr-2'}/> Create a Workspace
                            </span>
                            </button>
                            <WorkspaceCreateModel isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)}/>
                        </>
                    )
                }

                {(
                    Array.isArray(boardGuest) && boardGuest.length > 0
                ) && (
                    <h2 className="text-lg font-bold text-gray-700 my-4">GUEST WORKSPACES</h2>
                )}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(boardGuest) && boardGuest.length > 0 ? boardGuest.map((board) => (
                        <Link
                            to={`/user-workspace/board/${board._id}`}
                            key={board._id}
                        >
                            <BoardItem title={board.title} background={board.background}/>
                        </Link>
                    )) : null}
                </div>
                <BoardCreateModel isOpen={isBoardOpen}
                                  onClose={() => setIsBoardOpen(false)}
                                  selectedWorkspaceId={selectedId}
                />
            </div>
        </div>
    )
        ;
};


export default Dashboard;


