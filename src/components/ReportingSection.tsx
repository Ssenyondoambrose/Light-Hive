import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Award, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UgandaSeason } from '../types';

export const ReportingSection: React.FC = () => {
  const { harvests, hives } = useApp();

  // 1. Honey Production by Uganda Season
  const seasonalData = useMemo(() => {
    const seasons: UgandaSeason[] = [
      'Long Rains (Mar–May)',
      'Dry Season (Jun–Aug)',
      'Short Rains (Sep–Nov)',
      'Dry Season (Dec–Feb)',
    ];

    const map: Record<string, { totalKg: number; count: number; avgMoisture: number }> = {
      'Long Rains (Mar–May)': { totalKg: 0, count: 0, avgMoisture: 0 },
      'Dry Season (Jun–Aug)': { totalKg: 0, count: 0, avgMoisture: 0 },
      'Short Rains (Sep–Nov)': { totalKg: 0, count: 0, avgMoisture: 0 },
      'Dry Season (Dec–Feb)': { totalKg: 0, count: 0, avgMoisture: 0 },
    };

    harvests.forEach((h) => {
      if (map[h.season]) {
        map[h.season].totalKg += h.quantityKg;
        map[h.season].avgMoisture += h.moisturePercent;
        map[h.season].count += 1;
      }
    });

    return seasons.map((seasonName) => {
      const item = map[seasonName];
      const shortName = seasonName.replace(' (', '\n(');
      return {
        season: seasonName,
        shortName: seasonName.split(' ')[0] + ' ' + (seasonName.split(' ')[1] || ''),
        totalKg: Number(item.totalKg.toFixed(1)),
        avgMoisture: item.count > 0 ? Number((item.avgMoisture / item.count).toFixed(1)) : 0,
        harvestCount: item.count,
      };
    });
  }, [harvests]);

  // 2. Cumulative Honey Yield Over Time
  const cumulativeData = useMemo(() => {
    const sorted = [...harvests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulative = 0;
    return sorted.map((h) => {
      cumulative += h.quantityKg;
      return {
        date: h.date,
        label: new Date(h.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        harvestKg: h.quantityKg,
        cumulativeKg: Number(cumulative.toFixed(1)),
        hive: h.hiveName,
      };
    });
  }, [harvests]);

  // 3. Hive Performance Summary
  const hivePerformance = useMemo(() => {
    const map: Record<string, { hiveName: string; totalKg: number; harvestCount: number }> = {};
    harvests.forEach((h) => {
      if (!map[h.hiveId]) {
        map[h.hiveId] = { hiveName: h.hiveName, totalKg: 0, harvestCount: 0 };
      }
      map[h.hiveId].totalKg += h.quantityKg;
      map[h.hiveId].harvestCount += 1;
    });

    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [harvests]);

  const totalHarvestKg = useMemo(() => {
    return harvests.reduce((sum, h) => sum + h.quantityKg, 0).toFixed(1);
  }, [harvests]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DEC8] dark:border-[#2F2922] pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D97706] font-semibold">
            Apiculture Analytics
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            Harvest & Hive Performance
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8C7A65] dark:text-[#A89C8C] bg-[#FAF7F2] dark:bg-[#1C1814] px-3 py-1.5 rounded-lg border border-[#E6DEC8] dark:border-[#383127]">
          <span>Total Recorded Yield:</span>
          <strong className="text-[#D97706] text-sm font-semibold">{totalHarvestKg} kg</strong>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Honey Production by Uganda Season */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                  Yield by Uganda Season
                </h3>
                <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                  Comparison across bimodal wet & dry cycles
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {harvests.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#8C7A65]">
                No seasonal harvest records yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: '#8C7A65' }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#8C7A65' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-white dark:bg-[#1F1A15] border border-[#DDD3C1] dark:border-[#383127] shadow-lg text-xs space-y-1">
                            <p className="font-serif-title font-semibold text-[#2B2118] dark:text-white">
                              {d.season}
                            </p>
                            <p className="text-amber-600 font-bold">{d.totalKg} kg harvested</p>
                            <p className="text-[#8C7A65] dark:text-[#A89C8C]">
                              {d.harvestCount} collection{d.harvestCount === 1 ? '' : 's'} recorded
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="totalKg"
                    fill="#D97706"
                    radius={[6, 6, 0, 0]}
                    name="Yield (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Cumulative Production Over Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                  Cumulative Honey Production
                </h3>
                <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                  Historical output growth trajectory
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {cumulativeData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#8C7A65]">
                No cumulative timeline data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="honeyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8C7A65' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8C7A65' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-white dark:bg-[#1F1A15] border border-[#DDD3C1] dark:border-[#383127] shadow-lg text-xs space-y-1">
                            <p className="font-mono text-[#8C7A65]">{d.date}</p>
                            <p className="font-semibold text-amber-600">{d.cumulativeKg} kg Total</p>
                            <p className="text-[#2B2118] dark:text-[#EFEBE4]">
                              +{d.harvestKg} kg from {d.hive}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeKg"
                    stroke="#B45309"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#honeyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Hive Top Performers & Apiary Health Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#2F2922] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">Top Producing Hive</div>
            <div className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
              {hivePerformance[0] ? hivePerformance[0].hiveName : 'No data'}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              {hivePerformance[0] ? `${hivePerformance[0].totalKg} kg recorded` : '—'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#2F2922] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">Colony Strength Ratio</div>
            <div className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
              {hives.filter((h) => h.colonyStrength === 'Strong').length} Strong / {hives.length} Hives
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {Math.round((hives.filter((h) => h.colonyStrength === 'Strong').length / Math.max(1, hives.length)) * 100)}% High Vigor
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#2F2922] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">Avg. Moisture Content</div>
            <div className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
              {(harvests.reduce((acc, h) => acc + h.moisturePercent, 0) / Math.max(1, harvests.length)).toFixed(1)}%
            </div>
            <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">
              Grade A Export Standard (&lt;19%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
