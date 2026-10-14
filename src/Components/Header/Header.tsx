import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

// Logged-in User Profile Fetcher
const fetchUserProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data.data;
};

const Header = () => {

  // tanstack query
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  // Helper to set the border color based on the role
  const getRoleBorderColor = (role?: string) => {
    if (role === "ADMIN") return "border-red-500 hover:border-red-600";
    if (role === "MODERATOR") return "border-amber-500 hover:border-amber-600";
    return "border-gray-300 hover:border-gray-400";
  };

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
        {isLoading ? (
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
        ) : (
          <Link to="/dashboard/userProfile" className={`flex items-center justify-center p-0.5 rounded-full border-2 transition overflow-hidden ${getRoleBorderColor(user?.role)}`} title={`${user?.name || "Profile"} (${user?.role || "USER"})`}><img src={user?.profileImage || "/empty-person.png"} alt={user?.name || "User Profile"} className="w-8 h-8 rounded-full object-cover"/></Link>
        )}
      </div>
    </header>
  );
};

export default Header;