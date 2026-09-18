import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* সাইডবারের উইডথ অনুযায়ী মেইন কন্টেন্ট স্বয়ংক্রিয়ভাবে বাকি পুরো জায়গা (flex-1) নিয়ে নিবে */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;