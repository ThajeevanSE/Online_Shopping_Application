import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { DarkModeContext } from "../context/DarkModeContext";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    productsListed: 0,
    itemsSold: 0,
    pendingOrders: 0,
    itemsBought: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch User
      const userRes = await api.get("/user/me");
      setUser(userRes.data);

      // 2. Fetch Stats (The new endpoint we made)
      const statsRes = await api.get("/user/dashboard-stats");
      setStats(statsRes.data);

      // 3. Fetch Recent Incoming Orders (Reuse existing endpoint)
      const ordersRes = await api.get("/orders/incoming-orders");
      // Slice to take only the last 3 for the preview
      setRecentOrders(ordersRes.data.slice(0, 3)); 

    } catch (error) {
      console.error("Dashboard Load Error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Welcome back, {user?.name}! Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
             <Link to="/my-products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-500/30">
               + Add Product
             </Link>
             <Link to="/shopping" className={`px-5 py-2.5 rounded-xl font-medium border transition ${isDarkMode ? "border-gray-600 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
               Browse Market
             </Link>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Revenue */}
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`} 
            icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="green"
            isDarkMode={isDarkMode}
          />

          {/* Card 2: Pending Orders */}
          <StatCard 
            title="Pending Orders" 
            value={stats.pendingOrders} 
            icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="orange"
            isDarkMode={isDarkMode}
            onClick={() => navigate("/incoming-orders")} // Clickable!
          />

          {/* Card 3: Active Listings */}
          <StatCard 
            title="Active Listings" 
            value={stats.productsListed} 
            icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            color="blue"
            isDarkMode={isDarkMode}
            onClick={() => navigate("/my-products")}
          />

           {/* Card 4: Items Bought */}
           <StatCard 
            title="Items Purchased" 
            value={stats.itemsBought} 
            icon={<svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            color="purple"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* --- MAIN CONTENT SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Sales */}
          <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Incoming Orders</h3>
              <Link to="/incoming-orders" className="text-indigo-500 hover:text-indigo-600 text-sm font-semibold">View All</Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-sm border-b ${isDarkMode ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-100"}`}>
                      <th className="py-3">Product</th>
                      <th className="py-3">Buyer</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className={`border-b group ${isDarkMode ? "border-gray-700 hover:bg-gray-750" : "border-gray-50 hover:bg-gray-50"}`}>
                        <td className="py-4 font-medium">{order.product.title}</td>
                        <td className={`py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{order.buyer.name}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-indigo-500">${order.product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                 <p className="text-gray-500">No recent orders found.</p>
              </div>
            )}
          </div>

          {/* Right Column: Profile Summary */}
          <div className="flex flex-col gap-6">
            <div className={`rounded-2xl p-6 shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
               <div className="flex items-center space-x-4 mb-4">
                 <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h2 className="text-lg font-bold">{user?.name}</h2>
                   <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
                 </div>
               </div>
               <div className="space-y-3">
                 <button onClick={() => navigate("/profile")} className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                   Edit Profile
                 </button>
               </div>
            </div>

            {/* Quick Tips Box */}
            <div className={`rounded-2xl p-6 shadow-sm border-l-4 border-indigo-500 ${isDarkMode ? "bg-indigo-900/20" : "bg-indigo-50"}`}>
               <h4 className="font-bold text-indigo-600 mb-2">💡 Selling Tip</h4>
               <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                 Responding to messages within 1 hour increases your chance of selling by 40%. Check your inbox!
               </p>
               <Link to="/inbox" className="block mt-3 text-sm font-bold text-indigo-600 hover:underline">Go to Inbox →</Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Helper Component for Stats Cards
function StatCard({ title, value, icon, color, isDarkMode, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-2xl shadow-sm transition transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100 bg-opacity-10`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}

export default Dashboard;