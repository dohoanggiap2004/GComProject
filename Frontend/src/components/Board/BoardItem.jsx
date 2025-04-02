const BoardItem = ({ title, background }) => (
    <div className="w-40 h-32 lg:w-48 md:h-32 bg-gray-200 rounded-lg overflow-hidden shadow-md relative">
        <img src={background} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex ">
            <p className="text-white font-semibold mx-2">{title}</p>
        </div>
    </div>
);

export default BoardItem;
