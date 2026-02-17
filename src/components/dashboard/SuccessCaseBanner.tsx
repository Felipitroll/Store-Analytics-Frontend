import { Target } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SuccessBadge } from './SuccessBadge';

export interface SuccessStatus {
    storeName: string;
    durationInDays: number;
    periods: {
        reference: { start: string; end: string; revenue: number };
        previous: { start: string; end: string; revenue: number };
    };
    metrics: {
        fixedIncrease: number;
        percentageIncrease: number;
    };
    successLevels: {
        fixed: string;
        percentage: string;
    };
    thresholdsUsed: {
        fixed: { low: number; medium: number; high: number } | null;
        percentage: { low: number; medium: number; high: number } | null;
    };
}

interface SuccessCaseBannerProps {
    successStatus: SuccessStatus;
}

export const SuccessCaseBanner = ({ successStatus }: SuccessCaseBannerProps) => {
    const { formatCurrency, t } = useSettings();

    if (!successStatus || !successStatus.successLevels) return null;

    const fixedLevel = successStatus.successLevels.fixed || 'ninguno';
    const percentageLevel = successStatus.successLevels.percentage || 'ninguno';
    const fixedThresholds = successStatus.thresholdsUsed?.fixed || null;
    const percentageThresholds = successStatus.thresholdsUsed?.percentage || null;
    const metrics = successStatus.metrics || { fixedIncrease: 0, percentageIncrease: 0 };
    const periods = successStatus.periods || {
        reference: { start: '', end: '', revenue: 0 },
        previous: { start: '', end: '', revenue: 0 }
    };
    const durationInDays = successStatus.durationInDays || 0;

    return (
        <div id="success-case-banner" className="bg-[#FF0057]/5 border border-[#FF0057]/20 rounded-xl p-6 relative group">
            {/* Background Icon with its own clipping container */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={120} className="text-[#FF0057]" />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">{t('banner.performanceAnalysis')}</h2>
                        <div className="flex gap-2">
                            <SuccessBadge 
                                level={fixedLevel} 
                                label={t('status.fixed')} 
                                thresholds={fixedThresholds}
                                type="fixed"
                                metrics={metrics}
                                showThresholds={true}
                            />
                            <SuccessBadge 
                                level={percentageLevel} 
                                label={t('status.growth')} 
                                thresholds={percentageThresholds}
                                type="percentage"
                                metrics={metrics}
                                showThresholds={true}
                            />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {t('banner.comparing')} <span className="text-foreground font-semibold">{durationInDays}</span> {t('banner.daysOfAccompaniment')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF0057]">{t('banner.revenueIncrease')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-foreground">
                                {formatCurrency(metrics.fixedIncrease)}
                            </span>
                            <span className={`text-sm font-bold ${metrics.percentageIncrease >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ({metrics.percentageIncrease > 0 ? '+' : ''}{metrics.percentageIncrease.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-border/50 hidden md:block"></div>

                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('banner.refRevenue')}</span>
                        <div className="text-sm font-medium text-foreground">
                            {formatCurrency(periods.reference.revenue)}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('banner.prevRevenue')}</span>
                        <div className="text-sm font-medium text-foreground">
                            {formatCurrency(periods.previous.revenue)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
