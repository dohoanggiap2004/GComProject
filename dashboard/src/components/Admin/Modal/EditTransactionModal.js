import React, {useState} from "react";
import {useDispatch} from "react-redux";
import { updateTransaction } from "../../../store/actions/transactionAction";

const EditTransactionModal = ( { transaction } ) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: transaction._id,
    userId: transaction.userId,
    status: transaction.status,
    amount: transaction.amount,
    planType: transaction.planType,
    orderCode: transaction.orderCode,
    createdAt: transaction.createdAt,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const rawValue = name === "amount" ? value.replace(/\./g, "") : value;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(rawValue || 0, 10) : rawValue,
    });
  };

  const handleSubmit = () => {
    // console.log(formData);
    dispatch(updateTransaction(formData))
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };


  return (
      <div className="w-full relative">
        {/* Button to open the modal */}
        <a
            onClick={toggleModal}
            className="font-medium text-indigo-600 dark:text-blue-500 hover:bg-indigo-300-300 border border-indigo-500 rounded-md px-3 py-1"
        >
          Sửa
        </a>
        {/* Conditionally render the modal based on isOpen state */}
        {isOpen && (
            <div
                className="pd-overlay w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden  overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="opacity-100 transition-all sm:max-w-lg sm:w-full m-3  sm:mx-auto">
                <div className="flex flex-col bg-white rounded-2xl py-4 px-5 min-w-[700px] overflow-y-auto">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h4 className="text-xl text-gray-900 font-medium">
                      Chỉnh sửa thông tin sản phẩm
                    </h4>
                    {/* Button to close the modal */}
                    <button onClick={toggleModal} className="block cursor-pointer">
                      <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            d="M7.75732 7.75739L16.2426 16.2427M16.2426 7.75739L7.75732 16.2427"
                            stroke="black"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <form
                      className="w-full flex flex-col gap-4"
                  >
                    <div className=" gap-4 mt-1">
                      <div className="flex items-start flex-col justify-start">
                        <label
                            htmlFor="userId"
                            className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                        >
                          Mã người giao dịch
                        </label>
                        <input
                            type="text"
                            id="userId"
                            readOnly={true}
                            name="userId"
                            value={formData?.userId}
                            onChange={handleChange}
                            className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-start flex-col justify-start">
                      <label
                          htmlFor="status"
                          className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                      >
                        Trạng thái
                      </label>
                      <input
                          type="text"
                          id="status"
                          required
                          name="status"
                          value={formData?.status}
                          onChange={handleChange}
                          className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <div className="flex items-start flex-col justify-start">
                        <label
                            htmlFor="amount"
                            className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                        >
                          Số tiền
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            required
                            value={formData?.amount.toLocaleString('vi-VN')}
                            onChange={handleChange}
                            className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-start flex-col justify-start">
                        <label
                            htmlFor="planType"
                            className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                        >
                          Gói
                        </label>
                        <input
                            type="text"
                            id="planType"
                            required
                            name="planType"
                            value={formData?.planType}
                            onChange={handleChange}
                            className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <div className="flex items-start flex-col justify-start">
                        <label
                            htmlFor="orderCode"
                            className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                        >
                          Mã giao dịch
                        </label>
                        <input
                            type="text"
                            id="orderCode"
                            required
                            name="orderCode"
                            value={formData?.orderCode}
                            onChange={handleChange}
                            className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-start flex-col justify-start">
                        <label
                            htmlFor="createdAt"
                            className="text-sm text-gray-700 dark:text-gray-200 mr-2"
                        >
                          Thời gian giao dịch
                        </label>
                        <input
                            type="text"
                            id="createdAt"
                            readOnly={true}
                            name="createdAt"
                            value={formData?.createdAt.slice(0, 10)}
                            onChange={handleChange}
                            className="w-full text-sm px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {" "}
                  </form>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                          toggleModal();
                        }}
                        className="py-2.5 px-5 text-sm bg-indigo-50 text-indigo-500 rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
                    >
                      Hủy bỏ
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          toggleModal();
                          handleSubmit();
                        }}
                        className="py-2.5 px-8 text-sm bg-rose-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default EditTransactionModal;
