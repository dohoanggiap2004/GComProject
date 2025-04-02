import BoardItem from "../Board/BoardItem.jsx";
import Sidebar from "./Sidebar.jsx";
import {MdAccessTime,} from "react-icons/md";
import HorizontalWorkspace from "./HorizontalWorkspace.jsx";
import {GoPlus} from "react-icons/go";
import {useDispatch, useSelector} from "react-redux";
import WorkspaceCreateModel from "./WorkspaceCreateModal.jsx";
import {useEffect, useState} from "react";
import { getBoardByWorkspaceIds} from "../../store/actions/boardAction.js";
import BoardCreateModel from "./BoardCreateModal.jsx";
import {Link} from "react-router-dom";


const recentBoards = [
    {title: "test", image: ""},
    {title: "DoHoangGiap", image: ""},
    {title: "A Lead Management Pipeline by Crmble", image: ""},
    {title: "Mise-En-Place Personal Productivity System", image: ""},
    {title: "Mise-En-Place Personal Productivity System", image: ""},
];

const Dashboard = () => {
    const {workspaces} = useSelector((state) => state.workspace);
    const {boards} = useSelector((state) => state.board);
    const [workspaceId, setWorkspaceId] = useState("");
    const dispatch = useDispatch();
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isBoardOpen, setIsBoardOpen] = useState(false);

    useEffect(() => {
        if (workspaces && workspaces.length > 0) {
            // Tạo danh sách các promise từ dispatch
            const fetchBoards = workspaces.map(workspace =>
                dispatch(getBoardByWorkspaceIds(workspace._id))
            );

            // Thực hiện tất cả request cùng một lúc
            Promise.all(fetchBoards)
                .then(() => console.log("All boards fetched successfully"))
                .catch(error => console.error("Error fetching boards:", error));
        }
    }, [workspaces]);

    return (
        <div className="flex justify-center mt-10">
            <Sidebar/>
            <div className="w-full lg:max-w-4xl p-6 -mt-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                    <MdAccessTime className="mr-2"/> Recently viewed
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-6 mb-6">
                    {recentBoards.map((board, index) => (
                        <BoardItem key={index} title={board.title} image={board.image}/>
                    ))}
                </div>

                <h2 className="text-lg font-semibold mb-4">YOUR WORKSPACES</h2>
                {
                    Array.isArray(workspaces) && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <div className={'mb-6'} key={workspace._id}>
                                <HorizontalWorkspace name={workspace.name} memberQuantity={workspace.memberQuantity}/>

                                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {Array.isArray(boards[workspace._id]) && boards[workspace._id].length > 0 ? boards[workspace._id].map((board, index) => (
                                        <Link
                                            to={`/user-workspace/board/${board._id}`}
                                            state={{ workspaceName: workspace.name, workspaceId: workspace._id }}
                                            key={index}
                                        >
                                            <BoardItem title={board.title} background={board.background}/>
                                        </Link>
                                    )) : null}
                                    <button
                                        className="w-40 h-32 md:w-48 md:h-32 bg-gray-200 rounded-lg overflow-hidden shadow-md relative"
                                        onClick={() => {setWorkspaceId(workspace._id); setIsBoardOpen(true); }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-gray-700 font-semibold">Create new board</p>
                                        </div>
                                    </button>
                                    <BoardCreateModel isOpen={isBoardOpen}
                                                      onClose={() => setIsBoardOpen(false)}
                                                      workspaceId={workspaceId}
                                    />
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


            </div>
        </div>
    )
        ;
};


export default Dashboard;


