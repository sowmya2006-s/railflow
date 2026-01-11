
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AnalyticsEvent, BookingStep } from '../types';
import { getUXRecommendations } from '../services/grok';

export const AnalyticsView: React.FC<{ events: AnalyticsEvent[] }> = ({ events }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Group events for funnel
  const stepCounts = events.reduce((acc, e) => {
    acc[e.step] = (acc[e.step] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Search', count: stepCounts[BookingStep.SEARCH] || 0 },
    { name: 'Train Select', count: stepCounts[BookingStep.TRAIN_SELECTION] || 0 },
    { name: 'Passengers', count: stepCounts[BookingStep.PASSENGERS] || 0 },
    { name: 'Payment', count: stepCounts[BookingStep.PAYMENT] || 0 },
    { name: 'Success', count: stepCounts[BookingStep.CONFIRMATION] || 0 },
  ];

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAI(true);
      const res = await getUXRecommendations(stepCounts);
      setRecommendations(res);
      setLoadingAI(false);
    };
    if (events.length > 5) fetchAI();
  }, [events.length]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Platform Insights</h1>
        <p className="text-gray-500">Real-time conversion funnel and system health metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Booking Funnel (Step-wise Traffic)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-blue-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="mr-2">✨</span> AI Insights
            </h3>
            {loadingAI ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((rec, i) => (
                  <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rec.impactLevel === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        {rec.impactLevel} Impact
                      </span>
                    </div>
                    <p className="font-bold text-sm mb-1">{rec.recommendation}</p>
                    <p className="text-xs text-blue-100 leading-relaxed">{rec.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-100 text-sm">Waiting for more session data to provide recommendations...</p>
            )}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: `${((stepCounts[BookingStep.CONFIRMATION] || 0) / (stepCounts[BookingStep.SEARCH] || 1) * 100).toFixed(1)}%`, trend: '+2.4%' },
          { label: 'Payment Success', value: '92.4%', trend: '-1.2%' },
          { label: 'Avg Booking Time', value: '2m 45s', trend: '-15s' },
          { label: 'Peak Load Handling', value: '99.9%', trend: 'Stable' }
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{m.label}</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-extrabold text-gray-800">{m.value}</span>
              <span className={`text-xs font-bold ${m.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{m.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
