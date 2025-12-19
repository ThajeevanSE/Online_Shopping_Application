import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Shopping() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  
  // New State for Wishlist (stores IDs of liked products)
  const [wishlist, setWishlist] = useState([]);

  const IMAGE_BASE_URL = "http://localhost:8080";
  const token = localStorage.getItem("token");

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
    if (token) {
      fetchWishlist();
    }
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const response = await api.get(`/products/browse?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching marketplace", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the user's current wishlist to color the hearts correctly
  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist/my-wishlist");
      // Extract just the IDs for easier checking
      const ids = response.data.map(product => product.id);
      setWishlist(ids);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const toggleWishlist = async (e, productId) => {
    e.preventDefault(); // Stop navigation to details page
    
    if (!token) {
        alert("Please log in to save items to your wishlist!");
        return;
    }

    try {
        await api.post(`/wishlist/toggle/${productId}`);

        // Optimistically update the UI (toggle the ID in the array)
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
        } else {
            setWishlist([...wishlist, productId]);
        }
    } catch (error) {
        console.error("Failed to toggle wishlist", error);
        alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-64">
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="TRAVEL">Travel</option>
              <option value="FASHION">Fashion</option>
              <option value="HOME">Home</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
                
                {/* Image Container */}
                <div className="h-56 overflow-hidden bg-gray-200 relative">
                  <img
                    src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder-product.png"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = "/placeholder-product.png"; }}
                  />
                  
                  {/* NEW Badge */}
                  {product.condition === 'NEW' && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">NEW</span>
                  )}

                  {/* HEART BUTTON (Wishlist Toggle) */}
                  <button 
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                    title="Add to Wishlist"
                  >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={wishlist.includes(product.id) ? "red" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke={wishlist.includes(product.id) ? "red" : "currentColor"} 
                        className="w-5 h-5 transition-colors duration-200"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.title}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">${product.price}</span>
                    <span className="text-sm text-indigo-600 font-medium group-hover:underline">View Details</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shopping;