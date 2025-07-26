import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import EditTransactionModal from "../../../components/Admin/Modal/EditTransactionModal";
import ConfirmModal from "../../../components/Admin/Modal/ConfirmModal";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteTransaction, getTransactions} from "../../../store/actions/transactionAction";


export default function Transaction() {
    const dispatch = useDispatch();
    const [_id, setId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const {transactions} = useSelector((state) => state.transaction);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    }
    const handleSelected = (value) => {
        setIsDelete(value);
    }

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch])

    // delete transactions by Id
    useEffect(() => {
        if (isDelete) {
            const payload = {
                _id: _id
            }
            dispatch(deleteTransaction(payload))
            setIsDelete(false)
        }
    }, [isDelete])

    return (
        <>
            <Sidebar handleSearch={() => console.log(1)}/>
            <div className="px-8 lg:ml-72 mt-16 md:mt-0">
                <div className={'bg-white rounded-2xl shadow-md pb-6'}>
                    <div className="flex py-6 ms-6">
                        <p className="font-semibold text-2xl">Quản lý giao dịch</p>

                    </div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Người thanh toán
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gói
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số tiền
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mã
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Thời gian
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hành động
                                </th>
                            </tr>
                            </thead>
                            {!Array.isArray(transactions) || transactions.length === 0 ? (
                                    <div className={'flex items-center justify-center mt-4 '}>
                                        <h1>Không tìm thấy</h1>
                                    </div>
                                ) :
                                <tbody>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 font-bold"
                                        style={{color: '#242E52'}}
                                    >
                                        <th
                                            className="px-6 py-4 whitespace-nowrap dark:text-white"
                                        >
                                            {transaction?.userId}
                                        </th>
                                        <td className="px-6 py-4">{transaction?.status}</td>
                                        <td className="px-6 py-4">
                                            {transaction?.planType}
                                        </td>
                                        <td className="px-6 py-4">{transaction?.amount.toLocaleString('vi-VN')}</td>
                                        <td className="px-6 py-4">{transaction?.orderCode}</td>
                                        <td className="px-6 py-4">{transaction?.createdAt.slice(0, 10)}</td>
                                        <td className="px-6 py-4">
                                            <div className='flex items-center gap-4'>
                                                <EditTransactionModal transaction={transaction}/>
                                                <button
                                                    onClick={() => {
                                                        toggleModal();
                                                        setId(transaction?._id)
                                                    }}
                                                    className="font-medium text-red-600 dark:text-blue-500 hover:bg-red-300 border border-red-600 rounded-md p-1 "
                                                >
                                                    Xóa
                                                </button>
                                                <ConfirmModal
                                                    isOpen={isModalOpen}
                                                    toggleModal={() => {
                                                        toggleModal();
                                                    }}
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
