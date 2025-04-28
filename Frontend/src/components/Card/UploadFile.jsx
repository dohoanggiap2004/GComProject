import {useState} from 'react';
import toast from "react-hot-toast";
import {uploadAttachment} from "../../store/actions/attachmentAction.jsx";
import {useDispatch} from "react-redux";

const UploadFile = ({cardId}) => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('cardId', cardId);

        try {
            await dispatch(uploadAttachment(formData)).unwrap();
            toast.success('Attachment successfully uploaded');
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <form>
            <div className="flex items-center space-x-6 justify-between">
                <label className="block">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-violet-50 file:text-blue-700
                                  hover:file:bg-violet-100
                                "
                    />
                </label>

                <button
                    onClick={handleSubmit}
                    className={'rounded-full bg-violet-50 hover:bg-violet-100 py-2 px-4 font-semibold' +
                        ' text-blue-700 text-sm'}
                >
                    Upload
                </button>
            </div>
        </form>

    );
};

export default UploadFile;
