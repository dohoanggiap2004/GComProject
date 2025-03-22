import Board from "../Board/Board.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import {MdAccessTime,} from "react-icons/md";
import HorizontalWorkspace from "../Workspace/HorizontalWorkspace.jsx";
import {GoPlus} from "react-icons/go";
import {useDispatch, useSelector} from "react-redux";
import WorkspaceCreateModel from "../Model/WorkspaceCreateModel.jsx";
import {useEffect, useState} from "react";
import {getBoardByWorkspaceId} from "../../store/actions/boardAction.js";
import BoardCreateModel from "../Model/BoardCreateModel.jsx";


// const boards = [
//     {title: "DoHoangGiap", image: "", type: "workspace"},
//     {title: "NCKH", image: "", type: "workspace"},
//     {title: "test", image: "", type: "workspace"},
// ];

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
    const dispatch = useDispatch();
    const [isWorkspaceOpen, setisWorkspaceOpen] = useState(false);
    const [isBoardOpen, setIsBoardOpen] = useState(false);
    useEffect(() => {
        console.log('check workspace', workspaces);
        if (workspaces && workspaces.length > 0) {
            // Tạo danh sách các promise từ dispatch
            const fetchBoards = workspaces.map(workspace =>
                dispatch(getBoardByWorkspaceId(workspace._id))
            );

            // Thực hiện tất cả request cùng một lúc
            Promise.all(fetchBoards)
                .then(() => console.log("All boards fetched successfully"))
                .catch(error => console.error("Error fetching boards:", error));
        }
    }, [workspaces]);

    useEffect(() => {
        console.log('check board', boards);
    }, [boards])

    return (
        <div className="flex justify-center">
            <Sidebar/>
            <div className="w-full lg:max-w-4xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                    <MdAccessTime className="mr-2"/> Recently viewed
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-6 mb-6">
                    {recentBoards.map((board, index) => (
                        <Board key={index} title={board.title} image={board.image}/>
                    ))}
                </div>

                <h2 className="text-lg font-semibold mb-4">YOUR WORKSPACES</h2>
                {
                    Array.isArray(workspaces) && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <div className={'mb-6'} key={workspace._id}>
                                <HorizontalWorkspace name={workspace.name} memberQuantity={workspace.memberQuantity}/>

                                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {Array.isArray(boards) && boards.length > 0 ? boards.map((board, index) => (
                                        <Board key={index} title={board.title} background={board.background}/>
                                    )) : null}
                                    <button
                                        className="w-40 h-32 md:w-48 md:h-32 bg-gray-200 rounded-lg overflow-hidden shadow-md relative"
                                        onClick={() => setIsBoardOpen(true)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-gray-700 font-semibold">Create new board</p>
                                        </div>
                                    </button>
                                    <BoardCreateModel isOpen={isBoardOpen}
                                                      onClose={() => setIsBoardOpen(false)}
                                                      workspaceId={workspace._id}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <button
                                className="flex items-center justify-between w-full p-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg border-2 border-gray-900"
                                onClick={() => setisWorkspaceOpen(true)}
                            >
                            <span className="flex items-center">
                                <GoPlus className={'mr-2'}/> Create a Workspace
                            </span>
                            </button>
                            <WorkspaceCreateModel isOpen={isWorkspaceOpen} onClose={() => setisWorkspaceOpen(false)}/>
                        </>
                    )
                }


            </div>
        </div>
    )
        ;
};


export default Dashboard;


