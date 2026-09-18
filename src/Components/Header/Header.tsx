import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 w-full shadow-sm">
      {/* বাম পাশে বিজনেসের নাম */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800 tracking-wide">
          Store<span className="text-red-500">Panel</span>
        </h1>
      </div>

      {/* ডান পাশে ইউজার প্রোফাইল */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-700 hover:text-red-500">
          <FaUserCircle className="text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;