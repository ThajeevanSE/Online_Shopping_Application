import React, { useEffect, useState } from "react";
import api from "../api/axios";

function IncomingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    // This endpoint finds orders where "seller == me"
    api.get("/orders/incoming-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching sales", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your sales...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Sales (Incoming Orders)</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl text-gray-500">You haven't sold any items yet.</h2>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row">
              
              {/* Product Image */}
              <div className="w-full md:w-48 h-48 bg-gray-100">
                <img 
                  src={order.product.imageUrl ? `${IMAGE_BASE_URL}${order.product.imageUrl}` : "/placeholder.png"} 
                  alt={order.product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
              </div>

              {/* Order Details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{order.product.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Buyer Details:</p>
                      <p>Name: {order.buyer.name}</p>
                      <p>Email: {order.buyer.email}</p>
                      <p>Phone: {order.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Shipping Address:</p>
                      <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t pt-4">
                   <div>
                      <span className="text-gray-500 text-sm">Payment Method: </span>
                      <span className="font-bold text-gray-800">{order.paymentMethod}</span>
                   </div>
                   <div className="text-2xl font-bold text-indigo-600">
                      ${order.product.price}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IncomingOrders;