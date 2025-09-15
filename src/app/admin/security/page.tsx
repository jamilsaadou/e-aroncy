"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Calendar,
  User,
  Globe,
  Activity,
  Database,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  service?: string;
  type?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  severity?: string;
  details?: any;
  stack?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  security: number;
  sessions: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface LogResponse {
  success: boolean;
  logs: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: LogStats;
}

export default function SecurityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  
  // Filtres
  const [filters, setFilters] = useState({
    type: 'all',
    severity: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        type: filters.type,
        limit: pagination.limit.toString(),
        page: pagination.page.toString(),
      });
      
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des logs');
      }
      
      const data: LogResponse = await response.json();
      setLogs(data.logs);
      setStats(data.stats);
      setPagination(data.pagination);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const clearOldLogs = async (days: number) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/logs?days=${days}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des logs');
      }
      
      await fetchLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Type', 'Message', 'User ID', 'IP Address', 'Success'].join(','),
      ...logs.map(log => [
        log.timestamp,
        log.level,
        log.type || '',
        `"${log.message.replace(/"/g, '""')}"`,
        log.userId || '',
        log.ipAddress || '',
        log.success?.toString() || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleLogExpansion = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const getLogIcon = (log: LogEntry) => {
    if (log.level === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    if (log.level === 'warn') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (log.type === 'security') return <Shield className="h-4 w-4 text-purple-500" />;
    if (log.type === 'session') return <User className="h-4 w-4 text-blue-500" />;
    return <Info className="h-4 w-4 text-gray-500" />;
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page]);

  const filteredLogs = logs.filter(log => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.message.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.userId?.toLowerCase().includes(searchLower) ||
        log.ipAddress?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Sécurité & Logs Système
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Surveillance et analyse des logs de sécurité
                </p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <button
                  onClick={() => fetchLogs()}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>
                
                <button
                  onClick={exportLogs}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Erreurs</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.errors}</p>
                  </div>
                  <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Alertes</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.warnings}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Sécurité</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-600">{stats.security}</p>
                  </div>
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Sessions</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.sessions}</p>
                  </div>
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Critique</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.critical}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Élevé</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">{stats.high}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Moyen</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.medium}</p>
                  </div>
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="error">Erreurs</option>
                  <option value="security">Sécurité</option>
                  <option value="session">Sessions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sévérité</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Toutes</option>
                  <option value="critical">Critique</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => clearOldLogs(7)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer logs &gt; 7j</span>
              </button>
              
              <button
                onClick={() => clearOldLogs(30)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer logs &gt; 30j</span>
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Logs Système ({filteredLogs.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Chargement des logs...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <XCircle className="h-8 w-8 mx-auto text-red-600 mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Database className="h-8 w-8 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Aucun log trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="space-y-1">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <div 
                        className="px-4 sm:px-6 py-3 cursor-pointer"
                        onClick={() => toggleLogExpansion(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {getLogIcon(log)}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs text-gray-500 font-mono">
                                  {formatTimestamp(log.timestamp)}
                                </span>
                                
                                {log.severity && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                                    {log.severity.toUpperCase()}
                                  </span>
                                )}
                                
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  log.level === 'error' ? 'text-red-600 bg-red-50' :
                                  log.level === 'warn' ? 'text-yellow-600 bg-yellow-50' :
                                  'text-blue-600 bg-blue-50'
                                }`}>
                                  {log.level.toUpperCase()}
                                </span>
                                
                                {log.type && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full text-purple-600 bg-purple-50">
                                    {log.type.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-900 truncate">
                                {log.message}
                              </p>
                              
                              {(log.userId || log.ipAddress || log.user) && (
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                  {log.user ? (
                                    <span className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{log.user.firstName} {log.user.lastName} ({log.user.email})</span>
                                    </span>
                                  ) : log.userId && (
                                    <span className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{log.userId}</span>
                                    </span>
                                  )}
                                  {log.ipAddress && (
                                    <span className="flex items-center space-x-1">
                                      <Globe className="h-3 w-3" />
                                      <span>{log.ipAddress}</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {log.success !== undefined && (
                              log.success ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> :
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            
                            {expandedLogs.has(index) ? 
                              <ChevronUp className="h-4 w-4 text-gray-400" /> :
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                          </div>
                        </div>
                      </div>
                      
                      {expandedLogs.has(index) && (
                        <div className="px-4 sm:px-6 pb-4 bg-gray-50">
                          <div className="space-y-2 text-sm">
                            {log.action && (
                              <div>
                                <span className="font-medium text-gray-700">Action:</span>
                                <span className="ml-2 text-gray-900">{log.action}</span>
                              </div>
                            )}
                            
                            {log.user && (
                              <div>
                                <span className="font-medium text-gray-700">Utilisateur:</span>
                                <span className="ml-2 text-gray-900">
                                  {log.user.firstName} {log.user.lastName} ({log.user.email})
                                </span>
                              </div>
                            )}
                            
                            {log.sessionId && (
                              <div>
                                <span className="font-medium text-gray-700">Session ID:</span>
                                <span className="ml-2 font-mono text-gray-900">{log.sessionId}</span>
                              </div>
                            )}
                            
                            {log.userAgent && (
                              <div>
                                <span className="font-medium text-gray-700">User Agent:</span>
                                <span className="ml-2 text-gray-900 break-all">{log.userAgent}</span>
                              </div>
                            )}
                            
                            {log.details && (
                              <div>
                                <span className="font-medium text-gray-700">Détails:</span>
                                <pre className="ml-2 mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                                  {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {log.stack && (
                              <div>
                                <span className="font-medium text-gray-700">Stack Trace:</span>
                                <pre className="ml-2 mt-1 p-2 bg-white rounded border text-xs overflow-x-auto text-red-600">
                                  {log.stack}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.page} sur {pagination.totalPages} ({pagination.total} logs)
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
