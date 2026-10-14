import DashboardCards from "../../Components/DashboardCards/DashboardCards";



const Dashboard = () => {

  


  return (
    <div className="">
      {/* ১. সামারি কার্ড সেকশন */}
      <DashboardCards></DashboardCards>

      {/* ২. নিচের এনালিটিক্স/চার্ট সেকশন (পরবর্তীতে আলাদা কম্পোনেন্ট হিসেবে বসানো হবে) */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400 font-medium">Dashboard Analytics Section Coming Soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;