import {useEffect, useRef} from "react";
import {FaTimes} from "react-icons/fa";
import {useSelector} from "react-redux";

export default function MemberCardModal({onClose}) {
    const modalRef = useRef(null);
    const {card} = useSelector((state) => state.card);
    useEffect(() => {
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[320px] p-4 border border-gray-300"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Members</h2>
                <button onClick={onClose}>
                    <FaTimes/>
                </button>
            </div>
            <input
                type="text"
                placeholder="Search members"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-4 mb-2">Card members</p>
            <div className="">
                {card.memberIds.length > 0 && card.memberIds.map(member => (
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <div
                            className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {member?.fullname.slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium">{member?.fullname}</span>
                    </div>

                ))
                }

            </div>
        </div>
    );
}
