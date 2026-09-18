import DashboardCards from "../../Components/DashboardCards/DashboardCards";
import SalesAnalyticsChart from "../../Components/SalesAnalyticsChart/SalesAnalyticsChart";


const Dashboard = () => {
  return (
    <div>
      {/* DashboardCards start */}
      <DashboardCards></DashboardCards>
      {/* DashboardCards end */}
      {/* SalesAnalyticsChart start */}
      <SalesAnalyticsChart></SalesAnalyticsChart>
      {/* SalesAnalyticsChart end */}
    </div>
  );
};

export default Dashboard;