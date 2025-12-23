import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import { DarkModeProvider } from "./context/DarkModeContext";
import MyProducts from "./pages/MyProducts";
import ProductForm from "./pages/ProductForm";
import Shopping from "./pages/Shopping";
import ProductDetails from "./pages/ProductDetails";
import Favorites from "./pages/Favorites";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import Messenger from "./pages/Messenger";
import ForgotPassword from "./pages/ForgotPassword";
import OrderPage from "./pages/OrderPage";
import IncomingOrders from "./pages/IncomingOrders";


function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <MyProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopping"
            element={
              <ProtectedRoute>
                <Shopping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />

          <Route path="/messages"
            element={
              <ProtectedRoute>
                <Messenger />
              </ProtectedRoute>} />

          {/* PLACE ORDER PAGE */}
          <Route
            path="/order/:productId"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incoming-orders"
            element={
              <ProtectedRoute>
                <IncomingOrders />
              </ProtectedRoute>
            }
          />


        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
