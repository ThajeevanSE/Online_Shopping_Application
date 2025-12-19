import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, categoryStats: [] });
  
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'products'
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  // Fetch All Data (Users, Products, Stats)
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Parallel requests for efficiency
      const [usersRes, productsRes, statsRes] = await Promise.all([
        api.get("/admin/users", { headers }),
        api.get("/admin/products", { headers }),
        api.get("/admin/stats", { headers })
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setStats(statsRes.data);

    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      if (err.response?.status === 403) alert("Access Denied: Admin only.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Handle Product Deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product? It will be removed from the marketplace.")) return;
    try {
      await api.delete(`/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.filter(p => p.id !== productId));
      alert("Product deleted");
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Prepare data for charts
  const chartData = stats.categoryStats?.map(item => ({
    name: item[0],
    value: item[1]
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-800"} min-h-screen p-6`}>
      
      <div className="max-w-7xl mx-auto">
        

        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          {/* Total Products Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Products</h3>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </div>
          {/* Revenue/Other Card (Placeholder) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">Active Admins</h3>
            <p className="text-3xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4">Products by Category (Bar)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke={darkMode ? "#ccc" : "#333"} />
                  <YAxis allowDecimals={false} stroke={darkMode ? "#ccc" : "#333"} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff' }} />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4">Category Distribution (Pie)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- TABS & TABLE SECTION --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
              className={`flex-1 py-4 text-center font-bold ${activeTab === 'users' ? 'bg-blue-50 dark:bg-gray-700 text-blue-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              Manage Users
            </button>
            <button 
              className={`flex-1 py-4 text-center font-bold ${activeTab === 'products' ? 'bg-blue-50 dark:bg-gray-700 text-blue-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('products')}
            >
              Manage Products
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-x-auto">
            
            {/* USERS TABLE */}
            {activeTab === 'users' && (
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-500 text-sm">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="py-3">#{u.id}</td>
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                           {u.role}
                         </span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* PRODUCTS TABLE */}
            {activeTab === 'products' && (
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-500 text-sm">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Image</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="py-3">#{p.id}</td>
                      <td className="py-3">
                        <img src={`http://localhost:8080${p.imageUrl}`} alt="img" className="w-10 h-10 object-cover rounded" onError={(e) => e.target.src="/default.png"} />
                      </td>
                      <td className="py-3 font-medium">{p.title}</td>
                      <td className="py-3">${p.price}</td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${p.saleStatus === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {p.saleStatus}
                         </span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;