import { createBrowserRouter } from "react-router";
import ClientLayout from "../Layouts/ClientLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Login/Login";
import CustomersTable from "../Pages/CustomersTable/CustomersTable";
import CustomerProfile from "../Pages/CustomerProfile/CustomerProfile";
import UsersTable from "../Pages/UsersTable/UsersTable";
import UserProfile from "../Pages/UserProfile/UserProfile";
import UpdateProfile from "../Pages/UpdateProfile/UpdateProfile";
import CategoriesTable from "../Pages/CategoriesTable/CategoriesTable";
import CategoryDetails from "../Pages/CategoryDetails/CategoryDetails";
import UpdateCategory from "../Pages/UpdateCategory/UpdateCategory";
import CreateCategory from "../Pages/CreateCategory/CreateCategory";
import TransactionsTable from "../Pages/TransactionsTable/TransactionsTable";
import TransactionDetails from "../Pages/TransactionDetails/TransactionDetails";
import CreateTransaction from "../Pages/CreateTransaction/CreateTransaction";
import UpdateTransaction from "../Pages/UpdateTransaction/UpdateTransaction";
import CreateUser from "../Pages/CreateUser/CreateUser";
import ProductsTable from "../Pages/ProductsTable/ProductsTable";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import CreateProduct from "../Pages/CreateProduct/CreateProduct";
import UpdateProduct from "../Pages/UpdateProduct/UpdateProduct";


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
    element: <DashboardLayout/>,
    children: [
    { 
      index: true, 
      element: <Dashboard></Dashboard>
    },
    { 
      path: '/dashboard/users', 
      element: <UsersTable></UsersTable>
    },
    { 
      path: '/dashboard/users/create', 
      element: <CreateUser></CreateUser>
    },
    { 
      path: '/dashboard/users/:id',
      element: <UserProfile></UserProfile>
    },
    { 
      path: '/dashboard/users/edit/:id',
      element: <UpdateProfile></UpdateProfile>
    },
    { 
      path: '/dashboard/categories/create',
      element: <CreateCategory></CreateCategory>
    },
    { 
      path: '/dashboard/categories',
      element: <CategoriesTable></CategoriesTable>
    },
    { 
      path: '/dashboard/categories/:id',
      element: <CategoryDetails></CategoryDetails>
    },
    { 
      path: '/dashboard/categories/edit/:id',
      element: <UpdateCategory></UpdateCategory>
    },
    { 
      path: '/dashboard/customers', 
      element: <CustomersTable></CustomersTable>
    },
    { 
      path: '/dashboard/customers/:id', 
      element: <CustomerProfile></CustomerProfile>
    },
    { 
      path: '/dashboard/transactions', 
      element: <TransactionsTable></TransactionsTable>
    },
    { 
      path: '/dashboard/transactions/:id', 
      element: <TransactionDetails></TransactionDetails>
    },
    { 
      path: '/dashboard/transactions/create', 
      element: <CreateTransaction></CreateTransaction>
    },
    { 
      path: '/dashboard/transactions/edit/:id', 
      element: <UpdateTransaction></UpdateTransaction>
    },
    { 
      path: '/dashboard/products', 
      element: <ProductsTable></ProductsTable>
    },
    { 
      path: '/dashboard/products/:id', 
      element: <ProductDetails></ProductDetails>
    },
    { 
      path: '/dashboard/products/create', 
      element: <CreateProduct></CreateProduct>
    },
    { 
      path: '/dashboard/products/edit/:id', 
      element: <UpdateProduct></UpdateProduct>
    }
    ]
  },
  // Dashboard Login Form
  {
    path: '/login',
    element: <Login></Login>
  }
]);


export default router;