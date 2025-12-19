import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Favorites() {
  // Initialize as an empty array
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/wishlist/my-wishlist");
      // Safety check: Ensure data is actually an array before setting it
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]); // Fallback to empty if response is weird
      }
    } catch (err) {
      console.error("Error fetching favorites", err);
      setError("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, productId) => {
    e.preventDefault();
    if (!window.confirm("Remove from favorites?")) return;

    try {
      await api.post(`/wishlist/toggle/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist ❤️</h1>

      {/* Check length safely with ?. just in case */}
      {products?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500 mb-4">You haven't saved any items yet.</p>
          <Link to="/shopping" className="text-indigo-600 font-bold hover:underline">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group relative block bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img
                  src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder-product.png"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = "/placeholder-product.png"; }}
                />
                <button
                  onClick={(e) => removeFavorite(e, product.id)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full text-gray-500 hover:text-red-500 shadow z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-indigo-500 uppercase mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-800 truncate mb-1">{product.title}</h3>
                <p className="text-xl font-black text-gray-900">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;