import {useEffect, useState} from "react";
import {IoMdCheckboxOutline} from "react-icons/io";
import ProgressBar from "./ProgressBar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createTask, deleteTask,} from "../../store/actions/taskAction.jsx";
import Task from "./Task.jsx";

export default function Checklist() {
    const { card } = useSelector(state => state.card)
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

    const dispatch = useDispatch();

    const handleAddItem = () => {
        if (formData.title.trim()) {
            dispatch(createTask(formData))
            setFormData({
                ...formData,
                title: '',
            })
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
    }

    useEffect(() => {
        let cnt = 0
        if(Array.isArray(card?.tasks) &&  card?.tasks.length > 0) {
            card.tasks.forEach((task) => {
                if(task.isCompleted){
                    cnt++
                }
            })
            setProgress((cnt/card?.tasks.length * 100).toFixed(2))
        }else setProgress(0);
    }, [card?.tasks])

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
                    <input
                        className="w-full border rounded-md text-sm py-1.5 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        placeholder="Add an item"
                        type={"text"}
                        value={formData.title}
                        name={'title'}
                        onChange={handleOnChange}
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleAddItem}
                            className="bg-blue-600 text-sm text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-gray-500 hover:bg-gray-100 text-sm ms-2 px-3 py-1.5 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 text-gray-500 text-sm bg-gray-100 px-3 py-1.5 rounded-md"
                >
                    Add an item
                </button>
            )}
        </div>
    );
}
