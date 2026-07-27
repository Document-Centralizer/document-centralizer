import React, { useState } from "react";
import CategoryCard from "../../../components/admin/CategoryCard";
import { categoriesData as initialCategories } from "../../../data/adminDashboardData";
import { X, Check } from "lucide-react";

export default function CategoriesSection() {
    const [categories, setCategories] = useState(initialCategories);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory("");
            setIsAdding(false);
        }
    };

    const handleRemoveCategory = (catToRemove) => {
        setCategories(categories.filter(cat => cat !== catToRemove));
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Document Categories</h2>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
                    >
                        + Add Category
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-2xl flex items-center gap-4">
                    <input 
                        type="text" 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name..."
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button 
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                    >
                        <Check size={16} /> Save
                    </button>
                    <button 
                        onClick={() => { setIsAdding(false); setNewCategory(""); }}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition"
                    >
                        <X size={16} /> Cancel
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <CategoryCard key={cat} category={cat} onRemove={handleRemoveCategory} />
                ))}
            </div>
        </div>
    );
}
