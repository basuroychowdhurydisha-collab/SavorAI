import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Flame, TrendingUp, Calendar, Activity, Zap, Utensils } from 'lucide-react';
import { MealPlan } from '../types/recipe';

interface CalorieTrendChartProps {
  mealPlan: MealPlan;
  targetDailyCalories?: number;
}

export const CalorieTrendChart: React.FC<CalorieTrendChartProps> = ({
  mealPlan,
  targetDailyCalories = 2000,
}) => {
  const [viewType, setViewType] = useState<'trend' | 'breakdown'>('trend');

  // Compute daily chart points from mealPlan.days
  const chartData = useMemo(() => {
    if (!mealPlan?.days || mealPlan.days.length === 0) return [];

    return mealPlan.days.map((dayObj) => {
      const bCal = dayObj.meals.breakfast?.calories || 0;
      const lCal = dayObj.meals.lunch?.calories || 0;
      const dCal = dayObj.meals.dinner?.calories || 0;
      const total = bCal + lCal + dCal;

      return {
        day: dayObj.day,
        shortDay: dayObj.day.slice(0, 3),
        totalCalories: total,
        breakfast: bCal,
        lunch: lCal,
        dinner: dCal,
        breakfastTitle: dayObj.meals.breakfast?.title || 'Breakfast',
        lunchTitle: dayObj.meals.lunch?.title || 'Lunch',
        dinnerTitle: dayObj.meals.dinner?.title || 'Dinner',
        target: targetDailyCalories,
      };
    });
  }, [mealPlan, targetDailyCalories]);

  // Summary statistics
  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const totalWeekly = chartData.reduce((sum, d) => sum + d.totalCalories, 0);
    const avgDaily = Math.round(totalWeekly / chartData.length);
    const sorted = [...chartData].sort((a, b) => b.totalCalories - a.totalCalories);
    const maxDay = sorted[0];
    const minDay = sorted[sorted.length - 1];

    return {
      totalWeekly,
      avgDaily,
      maxDay,
      minDay,
      targetDiff: avgDaily - targetDailyCalories,
    };
  }, [chartData, targetDailyCalories]);

  if (!chartData.length) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
        <TrendingUp className="w-8 h-8 text-stone-400 mx-auto mb-2" />
        <p className="text-sm text-stone-500">Generate a meal plan to visualize weekly calorie intake trends.</p>
      </div>
    );
  }

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-stone-700 text-xs min-w-56 space-y-2">
          <div className="flex items-center justify-between border-b border-stone-700/80 pb-1.5">
            <span className="font-bold text-amber-400 text-sm">{data.day}</span>
            <span className="font-extrabold text-white text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              {data.totalCalories} kcal
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between items-center text-amber-200">
              <span className="truncate max-w-[150px]">• {data.breakfastTitle}</span>
              <span className="font-mono font-bold shrink-0">{data.breakfast} kcal</span>
            </div>
            <div className="flex justify-between items-center text-orange-200">
              <span className="truncate max-w-[150px]">• {data.lunchTitle}</span>
              <span className="font-mono font-bold shrink-0">{data.lunch} kcal</span>
            </div>
            <div className="flex justify-between items-center text-emerald-200">
              <span className="truncate max-w-[150px]">• {data.dinnerTitle}</span>
              <span className="font-mono font-bold shrink-0">{data.dinner} kcal</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
            <span>Target: {data.target} kcal</span>
            <span
              className={`font-semibold ${
                Math.abs(data.totalCalories - data.target) <= 150
                  ? 'text-emerald-400'
                  : data.totalCalories > data.target
                  ? 'text-amber-400'
                  : 'text-sky-400'
              }`}
            >
              {data.totalCalories > data.target
                ? `+${data.totalCalories - data.target} over`
                : `${data.totalCalories - data.target} under`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Badges Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Daily Avg
            </span>
            <div className="text-2xl font-bold font-display text-stone-900 mt-1">
              {stats.avgDaily} <span className="text-xs font-normal text-stone-500">kcal</span>
            </div>
            <span className="text-[11px] text-stone-500">
              Target: {targetDailyCalories} kcal ({stats.targetDiff >= 0 ? `+${stats.targetDiff}` : stats.targetDiff})
            </span>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-200 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-800 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-orange-600" /> Weekly Total
            </span>
            <div className="text-2xl font-bold font-display text-stone-900 mt-1">
              {stats.totalWeekly.toLocaleString()} <span className="text-xs font-normal text-stone-500">kcal</span>
            </div>
            <span className="text-[11px] text-stone-500">Across 7 planned days</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> Peak Day
            </span>
            <div className="text-2xl font-bold font-display text-stone-900 mt-1">
              {stats.maxDay.day}
            </div>
            <span className="text-[11px] text-stone-500">{stats.maxDay.totalCalories} kcal</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Lightest Day
            </span>
            <div className="text-2xl font-bold font-display text-stone-900 mt-1">
              {stats.minDay.day}
            </div>
            <span className="text-[11px] text-stone-500">{stats.minDay.totalCalories} kcal</span>
          </div>
        </div>
      )}

      {/* Main Chart Container */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xs space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 font-display text-lg">
                Weekly Calorie Intake Trend
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Visualizing calculated energy intake from breakfast, lunch, and dinner against your daily goal.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex rounded-xl bg-stone-100 p-1 self-start sm:self-auto border border-stone-200">
            <button
              onClick={() => setViewType('trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewType === 'trend'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Trend Line
            </button>
            <button
              onClick={() => setViewType('breakdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewType === 'breakdown'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Meal Breakdown
            </button>
          </div>
        </div>

        {/* Recharts Responsive Chart */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="calorieAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              <XAxis
                dataKey="shortDay"
                tick={{ fontSize: 12, fill: '#78716c', fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              
              <YAxis
                domain={['dataMin - 300', 'dataMax + 200']}
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
                unit=" kcal"
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={targetDailyCalories}
                stroke="#059669"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Target: ${targetDailyCalories} kcal`,
                  fill: '#059669',
                  fontSize: 11,
                  position: 'insideTopRight',
                  fontWeight: 600,
                }}
              />

              {viewType === 'trend' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="totalCalories"
                    fill="url(#calorieAreaGrad)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalCalories"
                    name="Daily Intake"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#ffffff', stroke: '#d97706', strokeWidth: 2.5 }}
                    activeDot={{ r: 7, fill: '#d97706', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </>
              ) : (
                <>
                  <Bar dataKey="breakfast" stackId="a" fill="#f59e0b" name="Breakfast" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="lunch" stackId="a" fill="#ea580c" name="Lunch" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="dinner" stackId="a" fill="#059669" name="Dinner" radius={[6, 6, 0, 0]} />
                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                    iconType="circle"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Day-by-Day Quick Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-3 border-t border-stone-100">
          {chartData.map((d) => (
            <div
              key={d.day}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center space-y-0.5"
            >
              <div className="text-[11px] font-bold text-stone-600">{d.shortDay}</div>
              <div className="text-sm font-extrabold text-stone-900 font-mono">
                {d.totalCalories}
              </div>
              <div className="text-[9px] text-stone-400">kcal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
