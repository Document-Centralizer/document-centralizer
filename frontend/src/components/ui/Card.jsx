
export const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
        {children}
    </div>
);
export const CardHeader = ({ title, subtitle, action }) => (
    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);
export const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);
