import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Activity, Target } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useDateRange } from '../../context/DateRangeContext';
import { clsx } from 'clsx';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalSessions: number;
    conversionRate: number;
    comparison: {
        totalRevenueChange: number | null;
        totalOrdersChange: number | null;
        averageOrderValueChange: number | null;
        totalSessionsChange: number | null;
        conversionRateChange: number | null;
    } | null;
}

const MetricCard = ({ title, value, change, icon: Icon }: any) => {
    const isNeutral = change == null || Math.abs(change) < 0.1;
    const isPositive = change != null && change > 0;
    const colorClass = isNeutral ? 'text-foreground/70' : (isPositive ? 'text-green-500' : 'text-red-500');

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm font-medium">{title}</span>
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon size={18} className="text-primary" />
                </div>
            </div>
            <div className="flex items-baseline justify-between w-full">
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            </div>
            {change != null && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${colorClass} font-medium`}>
                    {change > 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                    <span>{change > 0 ? '+' : ''}{parseFloat(change.toString()).toFixed(1)}%</span>
                </div>
            )}
        </div>
    );
};

export const QuickView = () => {
    const { selectedStore, stores, selectStore } = useStore();
    const { dateRange, comparisonPeriod } = useDateRange();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!selectedStore) return;

            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                    comparisonPeriod: comparisonPeriod,
                });

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/analytics/${selectedStore.id}?${queryParams}`);
                if (!response.ok) throw new Error('Failed to fetch analytics');
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedStore, dateRange, comparisonPeriod]);

    if (!selectedStore) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="p-4 bg-secondary/50 rounded-full">
                    <span className="text-4xl">⚡</span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">No Store Selected</h3>
                    <p className="text-muted-foreground">Select a store to see the quick view.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quick View: {selectedStore.name}</h1>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    title="Total Revenue"
                    value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`}
                    change={data?.comparison?.totalRevenueChange}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Total Orders"
                    value={(data?.totalOrders ?? 0).toLocaleString()}
                    change={data?.comparison?.totalOrdersChange}
                    icon={ShoppingCart}
                />
                <MetricCard
                    title="Average Order Value"
                    value={`$${(data?.averageOrderValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change={data?.comparison?.averageOrderValueChange}
                    icon={Target}
                />
                <MetricCard
                    title="Total Sessions"
                    value={(data?.totalSessions ?? 0).toLocaleString()}
                    change={data?.comparison?.totalSessionsChange}
                    icon={Activity}
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${(data?.conversionRate ?? 0).toFixed(1)}%`}
                    change={data?.comparison?.conversionRateChange}
                    icon={TrendingUp}
                />
            </div>

            {/* Stores List Section */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/30">
                    <h2 className="font-semibold text-lg">Stores Overview</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Store Name</th>
                                <th className="px-6 py-4">URL</th>
                                <th className="px-6 py-4">Tags</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stores.map((store) => (
                                <tr 
                                    key={store.id} 
                                    onClick={() => selectStore(store.id)}
                                    className={clsx(
                                        "hover:bg-secondary/50 transition-colors cursor-pointer group",
                                        selectedStore.id === store.id ? "bg-primary/10" : "hover:bg-secondary/30"
                                    )}
                                >
                                    <td className="px-6 py-4 font-medium text-foreground group-hover:text-primary transition-colors">{store.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{store.url}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {store.tags?.map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground italic">
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
