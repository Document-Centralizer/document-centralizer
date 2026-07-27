import React from "react";
import { allDocumentsData } from "../../data/adminDashboardData";

export default function DocumentsTable({ filter }) {
    const filteredDocs = filter === "All" 
        ? allDocumentsData 
        : allDocumentsData.filter(doc => doc.state === filter);

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-gray-600 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Document Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Owner</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">State</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold text-gray-800">{doc.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{doc.category}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.owner}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    doc.state === 'Approved' ? 'bg-green-100 text-green-700' : 
                                    doc.state === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {doc.state}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                No {filter !== "All" ? filter.toLowerCase() : ""} documents found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
