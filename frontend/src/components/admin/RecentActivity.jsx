import React from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import * as LucideIcons from "lucide-react";

export default function RecentActivity({ activities = [] }) {
    return (
        <Card className="shadow-md border-gray-100 rounded-2xl bg-white">
            <CardHeader title="Recent Activity" subtitle="Latest platform actions" />
            <CardContent className="p-0 divide-y divide-gray-50">
                {activities.length === 0 ? (
                    <div className="p-5 text-center text-gray-500 text-sm">No recent activity</div>
                ) : (
                    activities.map((item, idx) => {
                        const Icon = LucideIcons[item.icon] || LucideIcons.FileText;
                        
                        return (
                            <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm">{item.action}</h4>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <span className="text-xs font-medium text-gray-400">
                                    {new Date(item.time).toLocaleDateString()}
                                </span>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
