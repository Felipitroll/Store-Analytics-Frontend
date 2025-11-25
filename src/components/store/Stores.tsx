import { useStore } from '../../context/StoreContext';
import { Trash2, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const Stores = () => {
    const { stores, deleteStore, retrySync, isLoading } = useStore();

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this store?')) {
            await deleteStore(id);
        }
    };

    const handleRetry = async (id: string) => {
        await retrySync(id);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 size={18} className="text-green-500" />;
            case 'SYNCING': return <RefreshCw size={18} className="text-blue-500 animate-spin" />;
            case 'FAILED': return <AlertCircle size={18} className="text-red-500" />;
            default: return <Clock size={18} className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Store Name</th>
                                <th className="px-6 py-4">URL</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Sync</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stores.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No stores connected yet.
                                    </td>
                                </tr>
                            ) : (
                                stores.map((store) => (
                                    <tr key={store.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">{store.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{store.url}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(store.syncStatus)}
                                                <span className={clsx(
                                                    "capitalize",
                                                    store.syncStatus === 'COMPLETED' && "text-green-600",
                                                    store.syncStatus === 'FAILED' && "text-red-600",
                                                    store.syncStatus === 'SYNCING' && "text-blue-600",
                                                )}>{store.syncStatus.toLowerCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRetry(store.id)}
                                                    className="p-2 hover:bg-blue-500/10 text-blue-600 rounded-md transition-colors"
                                                    title="Retry Sync"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(store.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-600 rounded-md transition-colors"
                                                    title="Delete Store"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
