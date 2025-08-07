"use client";

import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

interface StatisticsWidgetProps {
  title?: string;
  stats?: StatCard[];
  className?: string;
  showHeader?: boolean;
}

export default function StatisticsWidget({ 
  title = "Statistiques", 
  stats,
  className = "",
  showHeader = true 
}: StatisticsWidgetProps) {
  
  const defaultStats: StatCard[] = [
    {
      title: "Utilisateurs Actifs",
      value: "2,847",
      change: "+12.5%",
      changeType: 'positive',
      icon: <Users className="h-5 w-5" />,
      description: "Ce mois"
    },
    {
      title: "Formations Complétées",
      value: "15,632",
      change: "+8.2%",
      changeType: 'positive',
      icon: <BookOpen className="h-5 w-5" />,
      description: "Total"
    },
    {
      title: "Taux de Réussite",
      value: "87.3%",
      change: "+2.1%",
      changeType: 'positive',
      icon: <Award className="h-5 w-5" />,
      description: "Moyenne"
    },
    {
      title: "Incidents Sécurité",
      value: "23",
      change: "-15.3%",
      changeType: 'positive',
      icon: <Shield className="h-5 w-5" />,
      description: "Ce mois"
    }
  ];

  const displayStats = stats || defaultStats;

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'negative':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {stat.icon}
                </div>
                {getChangeIcon(stat.changeType)}
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                )}
              </div>
              
              <div className="mt-3 flex items-center">
                <span className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs précédent</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour une statistique simple en ligne
export function InlineStatistic({ 
  label, 
  value, 
  change, 
  changeType = 'neutral',
  icon 
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}) {
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center space-x-1">
          {getChangeIcon(changeType)}
          <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}

// Composant pour un graphique de progression simple
export function ProgressStatistic({
  label,
  value,
  maxValue = 100,
  color = "blue",
  showPercentage = true
}: {
  label: string;
  value: number;
  maxValue?: number;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  showPercentage?: boolean;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {showPercentage && (
          <span className="text-sm font-bold text-gray-900">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>0</span>
        <span>{value} / {maxValue}</span>
      </div>
    </div>
  );
}
