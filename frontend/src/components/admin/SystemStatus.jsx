import React from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";

export default function SystemStatus({ storageData = [] }) {
    return (
        <Card className="shadow-md border-gray-100 rounded-2xl bg-white">
            <CardHeader title="Storage Breakdown" subtitle="Storage usage by document type" />
            <CardContent className="p-6 space-y-6">
                {storageData.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">No storage data available</div>
                ) : (
                    storageData.map((status, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-700">{status.label}</span>
                                <span className="text-gray-500">{status.value}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className={`${status.color} h-2.5 rounded-full`} style={{ width: status.percentage }}></div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
