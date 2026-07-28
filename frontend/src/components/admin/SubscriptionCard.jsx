import React from "react";

export default function SubscriptionCard({ plan, onManage, isSelected }) {
    return (
        <div className={`p-8 rounded-3xl border ${plan.border} bg-white shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col items-center text-center ${isSelected ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
            <div className={`absolute top-0 w-full h-2 ${plan.bg}`}></div>
            <h3 className="font-bold text-xl text-gray-800 mt-2">{plan.name}</h3>
            <div className={`text-4xl font-extrabold mt-4 mb-2 ${plan.color}`}>{plan.price}</div>
            <p className="text-sm text-gray-500 font-medium mb-8">{plan.users}</p>
            <button 
                onClick={() => onManage(plan.name)}
                className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition mt-auto"
            >
                {isSelected ? "View All Users" : "Manage Plan"}
            </button>
        </div>
    );
}
