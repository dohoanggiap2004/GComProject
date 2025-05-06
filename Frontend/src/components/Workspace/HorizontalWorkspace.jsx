import {MdPeople, MdRocketLaunch, MdSettings, MdViewList} from "react-icons/md";
import {Link} from "react-router-dom";

const HorizontalWorkspace = ({name, memberQuantity, workspaceId}) => {

    return (
        <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0 ">
            <div className={'flex items-center'}>
                <button className="flex items-center px-3 py-1 bg-green-500 text-white rounded-sm w-fit">
                    G
                </button>
                <p className={'ms-3 text-sm font-bold'}>
                    {name.length > 15 ? `${name.slice(0, 15)}...` : name}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 md:gap-2">
                <Link to={'/coming-soon'} className="flex items-center justify-center px-1 bg-gray-200 rounded-sm md:w-28 h-8 text-sm">
                    <MdViewList className="mr-1 shrink-0"/> Boards
                </Link>
                <Link to={`/user-workspace/member/${workspaceId}`} className="flex items-center justify-center px-1 bg-gray-200 rounded-sm md:w-28 h-8 text-sm">
                    <MdPeople className="mr-1 shrink-0"/> Members ({memberQuantity})
                </Link>
                <Link to={'/user-workspace/workspace-setting'}
                      state={{workspaceId: workspaceId}} className="flex items-center justify-center px-1 bg-gray-200 rounded-sm md:w-28 h-8 text-sm">
                    <MdSettings className="mr-1 shrink-0"/> Settings
                </Link>
                <Link to={'/pricing'}
                    className="flex items-center justify-center px-1 bg-purple-500 text-white rounded-sm md:w-28 h-8 text-sm">
                        <MdRocketLaunch className="mr-1 shrink-0"/> Upgrade
                </Link>
            </div>
        </div>
    )
}

export default HorizontalWorkspace;
