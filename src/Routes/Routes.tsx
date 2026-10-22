import { createBrowserRouter } from "react-router";
import ClientLayout from "../Layouts/ClientLayout";
// import Home from "../Pages/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Login/Login";
import CreateUser from "../Pages/CreateUser/CreateUser";
import { ProtectedRoute } from "./ProtectedRoute";
import { PrivateRoute } from "./PrivateRoute";
import UsersTable from "../Pages/UsersTable/UsersTable";
import SingleUser from "../Pages/SingleUser/SingleUser";
import UserProfile from "../Pages/UserProfile/UserProfile";
import UpdateUserProfile from "../Pages/UpdateUserProfile/UpdateUserProfile";
import CreateCategory from "../Pages/CreateCategory/CreateCategory";
import CategoryTable from "../Pages/CategoryTable/CategoryTable";
import SingleCategory from "../Pages/SingleCategory/SingleCategory";
import UpdateCategory from "../Pages/UpdateCategory/UpdateCategory";
import CreateTransaction from "../Pages/CreateTransaction/CreateTransaction";
import TransactionTable from "../Pages/TransactionTable/TransactionTable";
import SingleTransaction from "../Pages/SingleTransaction/SingleTransaction";
import UpdateTransaction from "../Pages/UpdateTransaction/UpdateTransaction";
import CreateProduct from "../Pages/CreateProduct/CreateProduct";
import ProductTable from "../Pages/ProductTable/ProductTable";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import UpdateProduct from "../Pages/UpdateProduct/UpdateProduct";
import Home from "../Pages/Home/Home";
import CustomerTable from "../Pages/CustomerTable/CustomerTable";
import OrderTable from "../Pages/OrderTable/OrderTable";
import OrderDetails from "../Pages/OrderDetails/OrderDetails";

// all router here
const router = createBrowserRouter([
  // Client Section (User Area)
  {
    path: '/',
    element: <ClientLayout/>,
    children: [
    { 
      index: true, 
      element: <Home></Home>
    }
    ]
  },
  // Dashboard Section (Protected Area)
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout/></ProtectedRoute>,
    children: [
    { 
      index: true, 
      element: <Dashboard></Dashboard>
    },
    {
    path: '/dashboard/createUser',
    element: <PrivateRoute allowedRoles={['ADMIN']}><CreateUser></CreateUser></PrivateRoute>
    },
    {
    path: '/dashboard/usersTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><UsersTable></UsersTable></PrivateRoute>
    },
    {
    path: '/dashboard/singleUser/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><SingleUser></SingleUser></PrivateRoute>
    },
    {
    path: '/dashboard/userProfile',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR', 'STAFF']}><UserProfile></UserProfile></PrivateRoute>
    },
    {
    path: '/dashboard/updateUserProfile',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR', 'STAFF']}><UpdateUserProfile></UpdateUserProfile></PrivateRoute>
    },
    {
    path: '/dashboard/createCategory',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><CreateCategory></CreateCategory></PrivateRoute>
    },
    {
    path: '/dashboard/categoryTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><CategoryTable></CategoryTable></PrivateRoute>
    },
    {
    path: '/dashboard/singleCategory/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><SingleCategory></SingleCategory></PrivateRoute>
    },
    {
    path: '/dashboard/updateCategory/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><UpdateCategory></UpdateCategory></PrivateRoute>
    },
    {
    path: '/dashboard/createTransaction',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><CreateTransaction></CreateTransaction></PrivateRoute>
    },
    {
    path: '/dashboard/transactionTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><TransactionTable></TransactionTable></PrivateRoute>
    },
    {
    path: '/dashboard/singleTransaction/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><SingleTransaction></SingleTransaction></PrivateRoute>
    },
    {
    path: '/dashboard/updateTransaction/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><UpdateTransaction></UpdateTransaction></PrivateRoute>
    },
    {
    path: '/dashboard/createProduct',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><CreateProduct></CreateProduct></PrivateRoute>
    },
    {
    path: '/dashboard/productTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR', 'STAFF']}><ProductTable></ProductTable></PrivateRoute>
    },
    {
    path: '/dashboard/productDetails/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR', 'STAFF']}><ProductDetails></ProductDetails></PrivateRoute>
    },
    {
    path: '/dashboard/updateProduct/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR']}><UpdateProduct></UpdateProduct></PrivateRoute>
    },
    {
    path: '/dashboard/customerTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><CustomerTable></CustomerTable></PrivateRoute>
    },
    {
    path: '/dashboard/orderTable',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><OrderTable></OrderTable></PrivateRoute>
    },
    {
    path: '/dashboard/orders/:id',
    element: <PrivateRoute allowedRoles={['ADMIN', 'MODERATOR','STAFF']}><OrderDetails></OrderDetails></PrivateRoute>
    },
    ]
  },
  // Dashboard Login Form
  {
    path: '/login',
    element: <Login></Login>
  }
]);


export default router;