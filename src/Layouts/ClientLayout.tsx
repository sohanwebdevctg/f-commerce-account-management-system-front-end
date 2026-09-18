import { Outlet } from "react-router";


const ClientLayout = () => {
  return (
    <div>
      {/* client layout section start */}
      <Outlet></Outlet>
      {/* client layout section end */}
    </div>
  );
};

export default ClientLayout;