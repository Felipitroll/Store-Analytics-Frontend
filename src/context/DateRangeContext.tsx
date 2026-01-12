import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateRange {
    start: string;
    end: string;
}

export type BenchmarkPeriod = 'ref' | 'ref_1' | 'ref_2' | 'ref_3';

interface DateRangeContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    comparisonPeriod: ComparisonPeriod;
    setComparisonPeriod: (period: ComparisonPeriod) => void;
    benchmarkPeriod: BenchmarkPeriod;
    setBenchmarkPeriod: (period: BenchmarkPeriod) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
            start: firstDayOfMonth.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0]
        };
    });
    const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('none');
    const [benchmarkPeriod, setBenchmarkPeriod] = useState<BenchmarkPeriod>('ref');

    return (
        <DateRangeContext.Provider value={{
            dateRange,
            setDateRange,
            comparisonPeriod,
            setComparisonPeriod,
            benchmarkPeriod,
            setBenchmarkPeriod
        }}>
            {children}
        </DateRangeContext.Provider>
    );
};

export const useDateRange = () => {
    const context = useContext(DateRangeContext);
    if (context === undefined) {
        throw new Error('useDateRange must be used within a DateRangeProvider');
    }
    return context;
};
