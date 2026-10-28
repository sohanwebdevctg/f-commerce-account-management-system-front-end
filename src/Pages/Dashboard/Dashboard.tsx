import DashboardCards from "../../Components/DashboardCards/DashboardCards";
import SalesAnalyticsChart from "../../Components/SalesAnalyticsChart/SalesAnalyticsChart";



const Dashboard = () => {

  


  return (
    <div className="">
      {/* dashboard card section start */}
      <DashboardCards></DashboardCards>
      {/* dashboard card section end */}

      {/* sales analytics chart section start */}
      <SalesAnalyticsChart></SalesAnalyticsChart>
      {/* sales analytics chart section end */}
      
    </div>
  );
};

export default Dashboard;