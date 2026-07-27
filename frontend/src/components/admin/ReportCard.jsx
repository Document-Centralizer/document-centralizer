import React from "react";

export default function ReportCard({ report, isActive, onSelect }) {
    return (
        <div 
            onClick={() => onSelect(report.id)}
            className={`p-8 border border-gray-200 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center justify-center h-64 ${isActive ? 'ring-2 ring-blue-500 transform scale-[1.02]' : ''}`}
        >
            <report.icon size={40} className={`${report.color} mb-4`} />
            <h3 className="font-bold text-lg text-gray-800">{report.title}</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">{report.desc}</p>
            <button className={`px-6 py-2.5 ${report.bg} ${report.textBtn} font-bold rounded-xl ${report.hoverBtn} transition pointer-events-none`}>
                {isActive ? "Currently Viewing" : "View Report"}
            </button>
        </div>
    );
}
