import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PaymentModal from "../components/PaymentModal"; // Import the modal

function OrderPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Payment Modal State 
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    api.get(`/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error", err))
      .finally(() => setLoading(false));
  }, [productId]);

  //Handle "Place Order" Button Click
  const handlePlaceOrderClick = (e) => {
    e.preventDefault();
    if (!address || !phone) {
        alert("Please fill in address and phone number.");
        return;
    }

    if (paymentMethod === "ONLINE") {
        
        setShowPaymentModal(true);
    } else {
        
        finalizeOrder();
    }
  };

  // Finalize Order (Call Backend)
  const finalizeOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        productId: productId,
        shippingAddress: address,
        phoneNumber: phone,
        paymentMethod: paymentMethod 
      };

      await api.post("/orders/create", orderData);
      
      alert("Order Placed Successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to create order record.");
    } finally {
      setIsSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* --- NEW: Payment Modal Overlay --- */}
      {showPaymentModal && (
          <PaymentModal 
              amount={product.price} 
              onSuccess={finalizeOrder} // Call this when payment succeeds
              onClose={() => setShowPaymentModal(false)}
          />
      )}

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Product Summary) - SAME AS BEFORE */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            <img 
               src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder.png"} 
               className="w-full h-48 object-cover rounded-lg mb-4"
               onError={(e) => { e.target.src = "/placeholder.png"; }}
            />
            <h4 className="font-semibold text-gray-900">{product.title}</h4>
            <div className="flex justify-between items-center border-t pt-4 mt-2">
              <span className="text-gray-600">Total Price</span>
              <span className="text-xl font-bold text-indigo-600">${product.price}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Form) */}
        <div className="md:col-span-2">
          <form onSubmit={handlePlaceOrderClick} className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Details</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              
              {/* COD Option */}
              <div 
                onClick={() => setPaymentMethod("COD")}
                className={`cursor-pointer p-4 border-2 rounded-xl flex items-center space-x-3 transition ${paymentMethod === "COD" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-indigo-600" : "border-gray-400"}`}>
                  {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-700">Cash on Delivery</span>
              </div>

              {/* Online Payment Option */}
              <div 
                onClick={() => setPaymentMethod("ONLINE")}
                className={`cursor-pointer p-4 border-2 rounded-xl flex items-center space-x-3 transition ${paymentMethod === "ONLINE" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ONLINE" ? "border-indigo-600" : "border-gray-400"}`}>
                  {paymentMethod === "ONLINE" && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-700">Online Payment</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition"
            >
              {paymentMethod === "ONLINE" ? "Proceed to Payment" : "Place Order Now"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;