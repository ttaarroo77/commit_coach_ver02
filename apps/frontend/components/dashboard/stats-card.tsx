'use client';

import { ReactNode } from 'react';
import { ScaleIn } from '../ui/animations';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  delay = 0
}: StatsCardProps) {
  return (
    <ScaleIn delay={delay} duration={0.4} className="h-full">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>

            {trend && (
              <div className="flex items-center mt-1">
                <span className={`text-xs font-medium ${trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                  }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                {description && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {description}
                  </span>
                )}
              </div>
            )}

            {!trend && description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>

          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        </div>
      </div>
    </ScaleIn>
  );
}
