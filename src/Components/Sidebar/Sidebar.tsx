import { Link, useLocation } from "react-router";
import { FaChartLine, FaShoppingCart, FaBoxes, FaUsers,FaChevronLeft,FaChevronRight,FaSignOutAlt} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: <FaChartLine /> },
    { title: "Users", path: "/dashboard/users", icon: <FaUserGroup/> },
    { title: "Categories", path: "/dashboard/categories", icon: <BiCategory /> },
    { title: "Transactions", path: "/dashboard/transactions", icon: <GrTransaction /> },
    { title: "Orders", path: "/dashboard/orders", icon: <FaShoppingCart /> },
    { title: "Products", path: "/dashboard/products", icon: <FaBoxes /> },
    { title: "Customers", path: "/dashboard/customers", icon: <FaUsers /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* মোবাইল ব্যাকড্রপ (সাইডবার খোলা থাকলে স্ক্রিনের বাকি অংশ হালকা কালো হবে) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
        />
      )}

      {/* ভাসমান টগল বাটন (মোবাইলে স্ক্রিনের বাম পাশে সবসময় স্থির থাকবে) */}
      <button
  onClick={() => setIsSidebarOpen((prev) => !prev)}
  className={`fixed top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-r-full md:rounded-full shadow-lg border-2 border-l-0 md:border-l-2 border-white transition-all duration-300 z-50 flex items-center justify-center cursor-pointer ${
    isSidebarOpen 
      ? "left-56 md:left-[208px]" 
      : "-left-2 md:left-[50px]"
  }`}
  title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
>
  {isSidebarOpen ? (
    <FaChevronLeft className="text-xs" />
  ) : (
    <FaChevronRight className="text-xs" />
  )}
</button>

      {/* সাইডবার কন্টেইনার */}
      <aside
        className={`bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-40 fixed md:static inset-y-0 left-0 top-16 md:top-0
          ${isSidebarOpen ? "translate-x-0 w-56" : "-translate-x-full md:translate-x-0 md:w-16"}
        `}
      >
        {/* নেভিগেশন লিংকসমূহ */}
        <nav className="p-2.5 space-y-1.5 flex-1 overflow-y-auto mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                title={item.title}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                } ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>

                {isSidebarOpen && (
                  <span className="truncate transition-opacity duration-200 text-sm font-medium">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* সাইডবারের নিচের অংশ - লগআউট বাটন */}
        <div className="p-2.5 border-t border-slate-800">
          <button
            onClick={() => alert("Logout Action")}
            title="Logout"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;