import Navbar from "../components/Home/Navbar/Navbar.jsx";
import {instanceAxios8000} from "../config/axiosConfig.jsx";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {createTransaction, deleteTransaction} from "../store/actions/transactionAction.jsx";

const PremiumPayment = () => {
    const dispatch = useDispatch();
    const {userInfo} = useSelector(state => state.auth)
    const plan = {
        name: 'Premium',
        price: 250000,
    };

    const handleConfirmPayment = async () => {
        try {
            const response = await dispatch(createTransaction({
                userId: userInfo._id,
                amount: plan.price,
            })).unwrap()

            try {
                const reqData = {
                    orderCode: response.orderCode,
                    amount: plan.price,
                }

                const res = await instanceAxios8000.post('/api/payos/create-payment-link', reqData);

                const checkoutUrl = res.data.checkoutUrl || res.data.data?.checkoutUrl;
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                } else {
                    toast.error("Not found checkoutUrl");
                }
            } catch (error) {
                dispatch(deleteTransaction(response._id));
                toast.error(error.message)
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const formatDateEN = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit"
        });
    };


    return (
        <>
            <Navbar/>
            <div className="min-h-screen p-4 mt-16">
                <div
                    className="flex flex-col md:flex-row gap-6 p-8 max-w-5xl mx-auto rounded-xl shadow-md mt-14">

                    {/* Plan Info (Left) */}
                    <div className="w-full md:w-1/3 border-r pr-6 ">
                        <h2 className="text-lg font-semibold mb-4">Plan</h2>
                        <p className="text-blue-600 font-medium mb-1">{plan.name}</p>
                        <ul className="text-gray-700 text-sm space-y-1">
                            <li>✔️ Unlimited collaborators</li>
                            <li>✔️ Unlimited boards</li>
                            <li>✔️ Advanced checklists</li>
                            <li>✔️ Unlimited boards</li>
                            <li>✔️ 250MB file attachments</li>
                            <li>✔️ Custom backgrounds & stickers</li>
                        </ul>
                    </div>

                    {/* Payment Info (Right) */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-lg font-semibold mb-4">Payment information</h2>

                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-500">Fullname</label>
                                <div className="font-medium text-gray-800">{userInfo.fullname}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <div className="font-medium text-gray-800">{userInfo.email}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Current Service</label>
                                <div className="font-medium text-gray-800">{userInfo.service.toUpperCase()}</div>
                            </div>

                            {userInfo.service === "premium" && (
                                <div>
                                    <label className="text-sm text-gray-500">Service Expiry</label>
                                    <div className="font-medium text-gray-800">{formatDateEN(userInfo.serviceExpiry)}</div>
                                </div>
                            )}

                            <div>
                                <label className="text-sm text-gray-500">Country</label>
                                <div className="font-medium text-gray-800">Việt Nam</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Service Type</label>
                                <div className="font-medium text-gray-800">{plan.name.toUpperCase()}</div>
                            </div>

                            <div>

                            </div>
                        </div>

                        {/* Billing Summary */}
                        <h3 className="text-md font-semibold mb-2">Billing summary</h3>
                        <div className="text-sm text-gray-700 mb-1">
                            1 {plan.name} license / month
                        </div>
                        <div className="text-gray-800 font-medium mb-1">
                            {plan.price.toLocaleString()} VND
                        </div>

                        <div>
                            <span className="font-medium text-gray-800">New expiry date:</span>{" "}
                            <span className="text-black">
                            {formatDateEN(
                                new Date(userInfo.serviceExpiry) > new Date()
                                    ? new Date(new Date(userInfo.serviceExpiry).getTime() + 30 * 24 * 60 * 60 * 1000)
                                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4 mt-4">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-xl font-bold text-blue-600">
                             {plan.price.toLocaleString()} VND
                             </span>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmPayment}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PremiumPayment;
