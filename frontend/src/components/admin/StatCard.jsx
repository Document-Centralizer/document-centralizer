import React from "react";
import { Card, CardContent } from "../ui/Card";

export default function StatCard({ stat }) {
    return (
        <Card className="hover:shadow-lg transition-shadow border-gray-100 shadow-md rounded-2xl bg-white h-full">
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={28} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-semibold">{stat.title}</p>
                    <h3 className="text-2xl font-extrabold text-gray-800">{stat.value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
