const ProgressBar = ({progress}) => {
    return (
        <div className={'flex items-center'}>
            <div className={'text-xs w-12'}>
                {progress} %
            </div>
            <div className="bg-gray-200 rounded-full h-2 flex items-center w-full">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200 ease-in-out"
                    style={{width: `${progress}%`}}
                >
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
