import React from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { recentActivities } from "../../data/adminDashboardData";

export default function RecentActivity() {
    return (
        <Card className="shadow-md border-gray-100 rounded-2xl bg-white">
            <CardHeader title="Recent Activity" subtitle="Latest platform actions" />
            <CardContent className="p-0 divide-y divide-gray-50">
                {recentActivities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition">
                        <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                            <item.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{item.action}</h4>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-400">{item.time}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
