import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import Content from "../components/Messenger/Content.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {getBoardWithMessages} from "../store/actions/messageAction.jsx";
import socket, {connectSocket, disconnectSocket} from "../service/socket.io.jsx";


const Messenger = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getBoardWithMessages())

        connectSocket();

        // Cleanup function
        return () => {
            socket.off('initialMessages');
            disconnectSocket();
        };

    }, [])
    return (
        <div className={'bg-gray-100'}>
            <NavbarWorkspace/>
            <Content/>
        </div>
    )
}

export default Messenger;
