import { FaFire, FaChild, FaPlus } from "react-icons/fa";


const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-gray-800 m-0 flex flex-col text-white shadow-lg">
       <SidebarIcon icon={<FaFire size="28" />} text="Orange / Private Messages" />
       <Divider />
       <SidebarIcon icon={<FaChild size="28" />} text="Everyone :)" />
       <Divider />  
       <SidebarIcon icon={<FaPlus size="24" />} text="Create a new channel" />  
    </div>
  );    
};

const SidebarIcon = ({ icon, text }) => {
    return (
        <div className="sidebar-icon group">
            {icon}

            <span className="tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    );
}

const Divider = () => <hr className="sidebar-hr" />;


export default Sidebar;