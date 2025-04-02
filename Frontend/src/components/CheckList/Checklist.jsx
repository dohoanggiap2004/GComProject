import {useEffect, useState} from "react";
import {IoMdCheckboxOutline} from "react-icons/io";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createTask, deleteTask,} from "../../store/actions/taskAction.js";
import Task from "./Task.jsx";
import toast from "react-hot-toast";


export default function Checklist() {
    const { card, error } = useSelector(state => state.card)
    const { board } = useSelector(state => state.board)
    const [isAdding, setIsAdding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        boardId: '',
        listId: '',
        cardId: '',
        title: '',
    });

    useEffect(() => {
        setFormData({
            ...formData,
            boardId: board?._id || '',
            cardId: card?._id || '',
            listId: card?.listId || '',
        })
    }, [board, card])

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const dispatch = useDispatch();

    const handleAddItem = () => {
        if (formData.title.trim()) {
            dispatch(createTask(formData))
            setIsAdding(false);
        }
    };

    const handleOnChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask({
            ...formData,
            taskId: taskId,
        }));
        if (!error) {
            toast.success("Task already deleted successfully!");
        }
    }

    return (
        <div className="p-4 border rounded-lg w-full bg-white">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <IoMdCheckboxOutline/>
                    <span className="font-semibold">Checklist</span>
                </div>
            </div>

            <ProgressBar progress={progress}/>

            {Array.isArray(card?.tasks) && card?.tasks.length > 0 && card?.tasks.map((task, index) => (
                <div key={index}>
                    {/* Checkbox and Title */}
                    <Task task={task} handleDeleteTask={() => handleDeleteTask(task._id)}/>
                </div>
            ))}

            {isAdding ? (
                <div className="mt-4">
                    <textarea
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Add an item"
                        value={formData.title}
                        name={'title'}
                        onChange={handleOnChange}
                    ></textarea>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleAddItem}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-md"
                >
                    Add an item
                </button>
            )}
        </div>
    );
}
