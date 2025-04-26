import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import Content from "../components/Messenger/Content.jsx";


const Messenger = () => {
    return (
        <div className={'bg-gray-100'}>
            <NavbarWorkspace/>
            <Content/>
        </div>
    )
}

export default Messenger;
