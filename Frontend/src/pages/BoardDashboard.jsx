import { useEffect } from 'react';
import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Board/SidebarBoard.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getWorkspaceByWorkspaceId} from "../store/actions/workspaceAction.jsx";
import NavbarBoardDashboard from "../components/BoardDashboard/Navbar/NavbarBoardDashboard.jsx";
import PieChart from "../components/BoardDashboard/Chart/PieChart.jsx";
import LineChart from "../components/BoardDashboard/Chart/LineChart.jsx";
import {FaCheck} from "react-icons/fa";
import {GoTasklist} from "react-icons/go";
import {FaUserGroup} from "react-icons/fa6";
import {
    getCardQuantityInBoard,
    getMemberQuantityInBoard, getMonthlyProgress, getProductiveMembers,
    getTaskQuantityInBoard, getTaskQuantityInList
} from "../store/actions/statisticAction.jsx";
import {getBoardByBoardId} from "../store/actions/boardAction.jsx";

function BoardDashboard() {
    const { boardId } = useParams();
    const dispatch = useDispatch();
    const { board } = useSelector((state) => state.board);
    const { taskQuantity, cardQuantity, memberQuantity, productiveMember } = useSelector((state) => state.statistic);

    useEffect(() => {
        if(boardId !== null){
            dispatch(getBoardByBoardId(boardId));
            dispatch(getCardQuantityInBoard(boardId));
            dispatch(getTaskQuantityInBoard(boardId));
            dispatch(getMemberQuantityInBoard(boardId));
            dispatch(getProductiveMembers(boardId));
            dispatch(getMonthlyProgress(boardId));
            dispatch(getTaskQuantityInList(boardId));
        }
    }, [boardId]);

    useEffect(() => {
        if(board?.workspaceId !== null){
            dispatch(getWorkspaceByWorkspaceId(board?.workspaceId));
        }
    }, [board]);

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar cố định trên cùng */}
            <div className="shrink-0 bg-gray-200">
                <NavbarWorkspace />
            </div>

            {/* Phần dưới: chia 2 cột (Sidebar trái - Nội dung phải) */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 shrink-0 border-r-2 border-gray-200 hidden md:flex">
                    <SidebarBoard/>
                </div>

                {/* Nội dung bên phải */}
                <div
                    className="flex-1 flex flex-col overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${board?.background})` }}
                >
                    <div className="shrink-0">
                        <NavbarBoardDashboard/>
                    </div>

                    {/* Vùng board (màu hồng) chiếm toàn bộ không gian còn lại, cuộn ngang */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto p-4">

                        <div className="md:mt-0">
                            <div className="p-8 border-2 border-gray-200 border-dashed rounded-2xl dark:border-gray-700">
                                <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">

                                    {/*total user*/}
                                    <div
                                        className="flex items-center justify-center h-24 rounded-2xl shadow-md dark:bg-gray-800 bg-white">
                                        <div className="p-3 rounded-full bg-opacity-75" style={{backgroundColor: '#422AFB'}}>
                                            <FaUserGroup className={'text-white'}/>
                                        </div>

                                        <div className="mx-5">
                                            <h4 className="text-2xl font-semibold text-gray-500">{memberQuantity ? memberQuantity : 0}</h4>
                                            <div className="text-gray-500 font-semibold">Members</div>
                                        </div>

                                    </div>

                                    {/*total order*/}
                                    <div
                                        className="flex items-center justify-center h-24 rounded-2xl shadow-md bg-white dark:bg-gray-800">
                                        <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75"
                                             style={{backgroundColor: '#422AFB'}}>
                                           <FaCheck className={'text-white'}/>
                                        </div>

                                        <div className="mx-5">
                                            <h4 className="text-2xl font-semibold  text-gray-700">{cardQuantity?.totalCompletedCards}/{cardQuantity?.totalCards}</h4>
                                            <div className="text-gray-500 font-semibold">Card Completed</div>
                                        </div>

                                    </div>

                                    {/*available product*/}
                                    <div
                                        className="flex items-center justify-center h-24 rounded-2xl shadow-md bg-white dark:bg-gray-800">
                                        <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75"
                                             style={{backgroundColor: '#422AFB'}}>
                                            <GoTasklist className={'text-white'}/>
                                        </div>

                                        <div className="mx-5">
                                            <h4 className="text-2xl font-semibold text-gray-700">{taskQuantity?.totalCompletedTasks}/{taskQuantity.totalTasks}</h4>
                                            <div className="text-gray-500 font-semibold">Task Completed</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={'grid grid-rows-3 grid-cols-3 gap-4 place-items-center mb-4 '}>
                                    {/*chart revenue*/}
                                    <div
                                        className="flex items-center justify-center h-[330px] w-full rounded-2xl shadow-md bg-white dark:bg-gray-800 col-span-3 md:col-span-2 row-span-3 place-items-center">
                                        <LineChart/>
                                    </div>

                                    {/*pie chart brand quantity sold*/}
                                    <div className={'flex items-center justify-center rounded-2xl shadow-md bg-white row-span-3' +
                                        ' col-span-3 md:col-span-1' +
                                        ' place-items-center w-full'}>
                                        <PieChart/>
                                    </div>
                                </div>

                                {/*each total quantity sold product*/}

                                <div className="gap-4 mb-4 !h-full bg-white rounded-2xl shadow-md pb-6">
                                    <h2 className="text-2xl font-semibold py-6 ms-5">Most Productive Members</h2>
                                    {/* Thêm lớp overflow-x-auto để khi màn hình nhỏ thì có thể cuộn ngang */}
                                    <div className="relative overflow-x-auto">
                                        <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead
                                                className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Fullname</th>
                                                <th scope="col" className="px-6 py-3">Email</th>
                                                <th scope="col" className="px-6 py-3">Joined tasks</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Array.isArray(productiveMember) && productiveMember.length > 0 && productiveMember.map((member) => (
                                                <tr key={member._id}
                                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 font-bold"
                                                    style={{color: '#242E52'}}>
                                                    <th scope="row"
                                                        className="px-6 py-4 whitespace-nowrap dark:text-white">
                                                        {member?.fullname}
                                                    </th>
                                                    <td className="px-6 py-4">{member?.email}</td>
                                                    <td className="px-6 py-4">{member?.taskCount.toLocaleString('vi-VN')}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default BoardDashboard;
