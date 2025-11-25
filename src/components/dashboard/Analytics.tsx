
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    salesOverTime: { name: string; value: number }[];
    topProducts: { id: string; title: string; totalSales: number }[];
}

const MetricCard = ({ title, value, change, icon: Icon }: any) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm font-medium">{title}</span>
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon size={18} className="text-primary" />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                {change && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-green-500 font-medium">
                        <TrendingUp size={14} />
                        <span>{change}</span>
                        <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const Analytics = () => {
    const { selectedStore, isLoading: isStoreLoading } = useStore();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!selectedStore) return;

            setIsLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams({
                    startDate: dateRange.start,
                    endDate: dateRange.end
                });
                const response = await fetch(`http://localhost:3000/analytics/${selectedStore.id}?${queryParams}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedStore, dateRange]);

    if (isStoreLoading) {
        return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
    }

    if (!selectedStore) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="p-4 bg-secondary/50 rounded-full">
                    <span className="text-4xl">📊</span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">No Store Selected</h3>
                    <p className="text-muted-foreground">Please select a store to view its analytics.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Analytics: {selectedStore.name}</h1>
                <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg shadow-sm">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="bg-transparent border-none text-sm focus:ring-0 text-foreground p-2 outline-none"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="bg-transparent border-none text-sm focus:ring-0 text-foreground p-2 outline-none"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {error ? (
                <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
            ) : (
                <>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Revenue"
                            value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`}
                            change={null}
                            icon={DollarSign}
                        />
                        <MetricCard
                            title="Total Orders"
                            value={(data?.totalOrders ?? 0).toLocaleString()}
                            change={null}
                            icon={ShoppingCart}
                        />

                        <MetricCard
                            title="Conversion Rate"
                            value="-"
                            change={null}
                            icon={TrendingUp}
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.salesOverTime ?? []}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            padding={{ left: 20, right: 20 }}
                                            minTickGap={30}
                                        />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Secondary Chart */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-6">Top Products</h3>
                            <div className="space-y-4">
                                {(!data?.topProducts || data.topProducts.length === 0) ? (
                                    <p className="text-muted-foreground text-sm">No products found.</p>
                                ) : (
                                    data.topProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-background transition-colors">
                                                    {product.title.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm truncate max-w-[120px]" title={product.title}>{product.title}</p>
                                                    <p className="text-xs text-muted-foreground">Product</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">${product.totalSales.toLocaleString()}</p>
                                                {/* <p className="text-xs text-green-500">+12%</p> */}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
