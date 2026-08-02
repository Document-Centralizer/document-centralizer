
export const Badge = ({ status }) => {
    // Normalize status for matching (handles backend enums like 'VERIFIED', 'PENDING')
    const normalizedStatus = (status || "").toUpperCase();

    const variants = {
        // Pending / Verification statuses
        "PENDING": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "PENDING_ADMIN": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "PENDING_VERIFICATION": "bg-yellow-100 text-yellow-700 border-yellow-200",
        // Approved statuses
        "VERIFIED": "bg-green-100 text-green-700 border-green-200",
        "APPROVED": "bg-green-100 text-green-700 border-green-200",
        "UPLOADED_SUCCESSFULLY": "bg-green-100 text-green-700 border-green-200",
        // Rejected statuses
        "REJECTED": "bg-red-100 text-red-700 border-red-200",
        "UPLOAD_FAILED": "bg-red-100 text-red-700 border-red-200",
        // Re-upload / active statuses
        "NEEDS_RE-UPLOAD": "bg-orange-100 text-orange-700 border-orange-200",
        "READY_TO_UPLOAD": "bg-blue-100 text-blue-700 border-blue-200",
        // Other
        "ACTIVE": "bg-blue-100 text-blue-700 border-blue-200",
        "UPLOADING": "bg-blue-100 text-blue-700 border-blue-200",
    };
    const style = variants[normalizedStatus] || "bg-slate-100 text-slate-700 border-slate-200";
    
    // Format display text neatly (e.g., "FORWARDED_TO_SUPERADMIN" -> "Forwarded To Superadmin")
    const displayText = (status || "").replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style} whitespace-nowrap`}>
            {displayText}
        </span>
    );
};
