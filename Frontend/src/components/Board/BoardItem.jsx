const BoardItem = ({ title, background }) => (
    <div className="w-40 h-24 lg:w-48 rounded-lg overflow-hidden shadow-md relative">
        <img src={background} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-opacity-30 flex ">
            <p className="text-white font-semibold mx-2 mt-2">{title}</p>
        </div>
    </div>
);

export default BoardItem;
