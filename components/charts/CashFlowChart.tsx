'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function CashFlowChart({ data }: { data: { month: string; inflow: number; outflow: number }[] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-white/35">
        No cash activity yet — record a transaction to see the trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={12} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            background: 'rgba(20,22,27,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 12,
            color: '#e7e9ee',
          }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="inflow" name="Inflow" fill="#38bdf8" radius={[6, 6, 0, 0]} />
        <Bar dataKey="outflow" name="Outflow" fill="#f472b6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
