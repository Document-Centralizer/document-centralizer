import React from "react";
import { FileSearch, Trash2 } from "lucide-react";

export default function CategoryCard({ category, onRemove }) {
    return (
        <div className="p-5 border border-gray-200 rounded-2xl hover:shadow-md transition bg-white flex flex-col items-center justify-center text-center gap-3 relative group">
            {onRemove && (
                <button 
                    onClick={() => onRemove(category)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Category"
                >
                    <Trash2 size={16} />
                </button>
            )}
            <div className="p-3 bg-slate-50 text-slate-600 rounded-full"><FileSearch size={24} /></div>
            <h4 className="font-bold text-gray-800">{category}</h4>
        </div>
    );
}
