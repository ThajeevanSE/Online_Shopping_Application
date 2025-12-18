import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading details...</div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 hover:underline font-medium">
        ← Back to Shopping
      </button>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Image Section */}
        <div className="h-96 md:h-auto bg-gray-100">
          <img 
             src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder-product.png"}
             alt={product.title}
             className="w-full h-full object-cover"
             onError={(e) => { e.target.src = "/placeholder-product.png"; }}
          />
        </div>

        {/* Details Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {product.category}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.condition === 'NEW' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {product.condition}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-3xl font-bold text-indigo-600 mb-6">${product.price}</p>
          
          <div className="prose text-gray-600 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02]">
            Buy Now / Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;