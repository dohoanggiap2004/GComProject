import React, {useState, useEffect} from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import ConfirmModal from "../../../components/Admin/Modal/ConfirmModal";
import EditUserModal from "../../../components/Admin/Modal/EditUserModal";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getUsers} from "../../../store/actions/userAction";


export default function Users() {
    const dispatch = useDispatch();
    const [isDelete, setIsDelete] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');

    const {users} = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleSelected = (value) => {
        setIsDelete(value);
    };

    // delete user by Id
    useEffect(() => {
        if (isDelete) {
            const payload = {
                _id: userId
            }
            dispatch(deleteUser(payload))
            setIsDelete(false)
        }
    }, [isDelete])


    return (
        <>
            <Sidebar/>
            <div className="px-8 lg:ml-72 mt-16 md:mt-0">
                <div className={'bg-white rounded-2xl shadow-md pb-6'}>
                    <div className="flex py-6 ms-6">
                        <p className="font-semibold text-2xl">Quản lý Người Dùng</p>
                    </div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Họ tên
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Dịch vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày hết hạn
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Vai trò
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hành động
                                </th>
                            </tr>
                            </thead>

                            {!Array.isArray(users) || users.length === 0 ? (
                                    <div className={'flex items-center justify-center mt-4 '}>
                                        <h1>Không tìm thấy</h1>
                                    </div>
                                ) :
                                <tbody>
                                {users.map((user) => (
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 font-bold"
                                        style={{color: '#242E52'}}
                                        key={user._id}>
                                        <td className="px-6 py-4">{user?.email}</td>
                                        <td className="px-6 py-4">{user?.fullname}</td>
                                        <td className="px-6 py-4">{user?.service}</td>
                                        <td className="px-6 py-4">{typeof user?.serviceExpiry === 'string' ? user.serviceExpiry.slice(0, 10) : ''}</td>
                                        <td className="px-6 py-4">{user?.address}</td>
                                        <td className="px-6 py-4">{`${user?.role}`}</td>
                                        <td className="px-6 py-4 flex">
                                            <div className='flex items-center gap-4'>
                                                <EditUserModal user={user}/>
                                                <button
                                                    onClick={() => {
                                                        toggleModal();
                                                        setUserId(user._id)
                                                    }}
                                                    className="font-medium text-red-600 dark:text-blue-500 hover:bg-red-300 border border-red-600 rounded-md p-1 "
                                                >
                                                    Xóa
                                                </button>
                                                <ConfirmModal
                                                    isOpen={isModalOpen}
                                                    toggleModal={toggleModal}
                                                    handleSelected={handleSelected}
                                                    confirmText="Bạn có chắc chắn muốn xóa?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
