import {useState} from "react";
import { FiStar, FiUsers, FiFilter } from "react-icons/fi";
import { IoRocketOutline } from "react-icons/io5";
import { BsLightning } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import {GoPeople} from "react-icons/go";
import {useSelector} from "react-redux";

export default function HeaderBoard() {
    const [selectedOption, setSelectedOption] = useState("Bảng");
    const { board } = useSelector((state) => state.board);
    return (
        <div className="bg-[#9B4D69] text-white flex items-center justify-between px-4 py-2">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <span className="font-bold">{board ? board.title : 'Board'}</span>
                <FiStar className="text-sm" />
                <FiUsers className="text-sm" />
                <select
                    className="bg-gray-200 text-black px-3 py-1 rounded"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="Board">Board</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Dashboard">Dashboard</option>
                </select>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <IoRocketOutline className="text-sm" />
                <BsLightning className="text-sm" />
                <FiFilter className="text-sm" />
                <div className="flex items-center gap-1">
                    <span className="bg-red-600 text-white rounded-full p-1 text-xs">GH</span>
                    <span className="bg-blue-600 text-white rounded-full p-1 text-xs"><GoPeople /></span>
                </div>
                <button className="bg-gray-200 text-black px-3 py-1 rounded flex items-center">
                    <GoPeople className={'mr-2'}/> Share
                </button>
                <HiDotsHorizontal className="text-sm" />
            </div>
        </div>
    );
}
