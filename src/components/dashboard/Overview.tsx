import { useStore } from '../../context/StoreContext';
import { Store, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, id }: any) => (
    <div id={id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
    </div>
);

export const Overview = () => {
    const { stores, isLoading } = useStore();

    if (isLoading) {
        return <div id="overview-loading" className="flex items-center justify-center h-64">Loading...</div>;
    }

    const totalStores = stores.length;
    const activeStores = stores.filter(s => s.syncStatus === 'COMPLETED').length;
    const failedStores = stores.filter(s => s.syncStatus === 'FAILED').length;
    const syncingStores = stores.filter(s => s.syncStatus === 'SYNCING').length;

    return (
        <div id="overview-container" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 id="overview-title" className="text-3xl font-bold tracking-tight">Global Overview</h1>
            </div>

            <div id="overview-stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    id="stat-total-stores"
                    title="Total Stores"
                    value={totalStores}
                    icon={Store}
                    colorClass="text-primary"
                />
                <StatCard
                    id="stat-active-stores"
                    title="Active Synced Stores"
                    value={activeStores}
                    icon={CheckCircle2}
                    colorClass="text-green-500"
                />
                <StatCard
                    id="stat-syncing-stores"
                    title="Syncing Now"
                    value={syncingStores}
                    icon={ShoppingBag}
                    colorClass="text-blue-500"
                />
                <StatCard
                    id="stat-failed-stores"
                    title="Failed Syncs"
                    value={failedStores}
                    icon={AlertCircle}
                    colorClass="text-red-500"
                />
            </div>

            <div id="overview-welcome-card" className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                <h3 id="welcome-title" className="text-lg font-semibold">Bienvenido a Haciéndola Analytics</h3>
                <p id="welcome-description" className="text-muted-foreground max-w-2xl mx-auto">
                    Selecciona una tienda desde el menu superior o ve a la pestaña <strong>Analytics</strong> para ver los detalles de las métricas de una tienda en particular.
                </p>
            </div>
        </div>
    );
};
