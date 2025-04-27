import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Board/SidebarBoard.jsx";
import {Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import AddMemberModal from "../components/Member/AddMemberModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getWorkspaceByWorkspaceId } from "../store/actions/workspaceAction.jsx";
import { useUserFromToken } from "../Utils/User.jsx";
import { GoX } from "react-icons/go";

const MemberManagement = () => {
  const { workspaceId } = useParams();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selected, setSelected] = useState("admin");
  const { user } = useUserFromToken();
  const { member, workspace } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWorkspaceByWorkspaceId(workspaceId));
  }, [workspaceId]);

  const renderContent = () => {
    switch (selected) {
      case "admin":
        return (
          <>
            <div className="mb-6">
              <div className="md:flex flex-col space-x-8">
                <div className="w-3/4 md:w-1/4">
                  <div className="bg-indigo-500 pt-2 pb-4 px-4 rounded">
                    <div>
                      <p className=" text-white font-semibold py-2 rounded text-sm">
                        Upgrade for more permissions controls
                      </p>
                      <p className="text-white text-sm py-2">
                        Decide who can send invitations, edit Workspace
                        settings, and more with Premium.
                      </p>
                      <Link to={'/pricing'} className="text-white py-2 rounded text-sm mt-2 hover:bg-purple-200 underline">
                        Try Premium free for 14 days
                      </Link>
                    </div>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />

                <div className="w-full md:w-3/4 mt-4 md:mt-0">
                  <h4 className="text-lg font-medium text-gray-700">
                    Invite members to join you
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Anyone with an invite link can join this free Workspace. You
                    can also disable and create a new invite link for this
                    Workspace at any time. Pending invitations count toward the
                    10 collaborator limit.
                  </p>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm mt-2 hover:bg-gray-300">
                    Invite with link
                  </button>
                </div>
              </div>
            </div>

            {/* Member List */}
            <div className="border-t pt-4">
              {Array.isArray(member) &&
                member.length > 0 &&
                member.map((member) => (
                  <div
                    key={member._id}
                    className="md:flex items-center justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                        {member?.fullname?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900">{member?.fullname}</p>
                        <p className="text-gray-500 text-sm">
                          @{member?.email?.split("@")[0]}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Last active April 2025
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        View boards (2)
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        Admin
                      </button>
                      <button
                        className={`bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 
                                             ${
                                               user._id !== member._id
                                                 ? "opacity-50 cursor-not-allowed"
                                                 : ""
                                             }`}
                        disabled={user._id !== member._id}
                      >
                        Leave...
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        );
      case "member":
        return (
          <>
            <div className="mb-6">
              <div className="md:flex flex-col space-x-8">
                <div className="w-3/4 md:w-1/4">
                  <div className="bg-indigo-500 pt-2 pb-4 px-4 rounded">
                    <div>
                      <p className=" text-white font-semibold py-2 rounded text-sm">
                        Upgrade for more permissions controls
                      </p>
                      <p className="text-white text-sm py-2">
                        Decide who can send invitations, edit Workspace
                        settings, and more with Premium.
                      </p>
                      <Link to={'/pricing'} className="text-white py-2 rounded text-sm mt-2 hover:bg-purple-200 underline">
                        Try Premium free for 14 days
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="w-3/4"></div>
              </div>
            </div>

            {/* Member List */}
            <div className="border-t pt-4">
              {Array.isArray(member) &&
                member.length > 0 &&
                member.map((member) => (
                  <div
                    key={member._id}
                    className="md:flex items-center justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                        {member?.fullname?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900">{member?.fullname}</p>
                        <p className="text-gray-500 text-sm">
                          @{member?.email?.split("@")[0]}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Last active April 2025
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        View boards (2)
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        Add to workspace
                      </button>
                      <button
                        className={`flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300`}
                      >
                        <GoX className={"h-5 w-5"} />
                        Remove...
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar cố định trên cùng */}
      <div className="shrink-0 bg-gray-200">
        <NavbarWorkspace />
      </div>

      {/* Phần dưới: chia 2 cột (Sidebar trái - Nội dung phải) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 shrink-0 border-r-2 border-gray-200 hidden md:flex">
          <SidebarBoard />
        </div>

        {/* Nội dung bên phải */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-cover bg-center mt-6">
          <div className="max-w-4xl mx-auto p-6 bg-white">
            {/* Header */}
            <div className="block md:flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-700 font-bold">
                    {workspace?.name?.slice(0, 1)}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{workspace?.name}</h2>
                  <span className="text-gray-500 text-sm">Private</span>
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 mt-4 md:mt-0 rounded hover:bg-blue-700"
                onClick={() => setIsMemberModalOpen(true)}
              >
                Invite Workspace members
              </button>
            </div>

            {/* Collaborators Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Collaborators: {member?.length} / 10
              </h3>
              <div className="md:flex space-x-8 mt-6">
                <div className="w-full md:w-1/4">
                  <div className="rounded flex flex-col">
                    <button
                      className={`text-sm font-medium px-3 py-2 w-52 md:w-full text-start
                                             ${
                                               selected === "admin" &&
                                               "text-blue-800 bg-blue-50 hover:none"
                                             }  hover:bg-blue-50`}
                      onClick={() => setSelected("admin")}
                    >
                      Workspace members ({member?.length})
                    </button>
                    <button
                      className={`font-medium text-sm px-3 py-2 w-52 md:w-full text-start hover:bg-blue-50 
                                            ${
                                              selected === "member" &&
                                              "text-blue-800 bg-blue-50 hover:none"
                                            } hover:bg-blue-50`}
                      onClick={() => setSelected("member")}
                    >
                      Guests (0)
                    </button>
                  </div>
                  <hr className="mt-2 border-gray-200" />
                </div>
                {selected === "admin" && (
                  <div className="w-full md:w-3/4">
                    <button className="text-lg font-medium text-gray-800 py-2 w-52 text-start hover:bg-blue-50">
                      Workspace members ({member?.length})
                    </button>
                    <p className="text-gray-700 text-sm">
                      Workspace members can view and join all Workspace visible
                      boards and create new boards in the Workspace.
                    </p>
                  </div>
                )}
                {selected === "member" && (
                  <div className="w-full md:w-3/4">
                    <button className="text-lg font-medium text-gray-800 py-2 w-48 text-start hover:bg-blue-50">
                      Guests ({member?.length})
                    </button>
                    <p className="text-gray-700 text-sm">
                      Guests can only view and edit the boards to which they've
                      been added. Guests can only view and edit the boards to
                      which they've been added.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {renderContent()}
            <AddMemberModal
              isOpen={isMemberModalOpen}
              onClose={() => setIsMemberModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
