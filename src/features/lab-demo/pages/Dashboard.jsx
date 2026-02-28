import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Filter, Clock, Package, CheckCircle, Truck, AlertTriangle,
  ChevronRight, X, BarChart3, TrendingUp, Users, DollarSign, Calendar, Zap,
  LogOut, Eye, ChevronDown
} from 'lucide-react';
import { StatusBadge, StatusPipeline, ShadeDisplay, ToothChart } from '../components';
import { useLabDemo } from '../context/LabDemoContext';
import { orderStatuses } from '../data/orders';

/**
 * Lab Dashboard
 * - Login screen
 * - Overview stats
 * - Orders table with filtering
 * - Order detail modal
 * - Analytics charts
 */

// Login Screen
function LoginScreen({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Picto Dent</h1>
          <p className="text-slate-400">Lab Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            Sign In
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo credentials: admin / pictodent2025
          </p>
        </form>
      </div>
    </div>
  );
}

// Stats Card
function StatCard({ icon: Icon, label, value, trend, color = 'sky' }) {
  const colorClasses = {
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// Simple Bar Chart
function SimpleBarChart({ data, height = 120 }) {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-sky-500 rounded-t transition-all duration-500 hover:bg-sky-600"
            style={{ height: `${(item.count / maxValue) * 100}%`, minHeight: item.count > 0 ? 8 : 0 }}
          />
          <span className="text-[10px] text-slate-500 mt-1 truncate max-w-full">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

// Simple Donut Chart
function SimpleDonutChart({ data, size = 120 }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  let currentAngle = 0;

  const paths = data.map((item, idx) => {
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (currentAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    // Color mapping
    const colors = ['#0ea5e9', '#8b5cf6', '#f97316', '#f59e0b', '#eab308', '#10b981', '#64748b'];

    return (
      <path
        key={idx}
        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={colors[idx % colors.length]}
        className="transition-all duration-300 hover:opacity-80"
      />
    );
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {paths}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-700">{total}</span>
      </div>
    </div>
  );
}

// Order Detail Modal
function OrderDetailModal({ order, onClose, onAdvanceStatus, onTogglePriority }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{order.ref}</h3>
            <p className="text-sm text-slate-500">{order.practiceName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status Pipeline */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Order Progress</h4>
            <StatusPipeline currentStatus={order.status} compact />
          </div>

          {/* Quick Info */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Service</p>
              <p className="font-medium text-slate-800">{order.serviceName}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="font-medium text-slate-800">
                {new Date(order.dueDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Shade</p>
              <div className="flex items-center gap-2">
                <ShadeDisplay shadeId={order.shade} size="normal" />
                <span className="font-medium text-slate-800">{order.shade}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Units</p>
              <p className="font-medium text-slate-800">{order.units}</p>
            </div>
          </div>

          {/* Tooth Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Teeth</h4>
            <div className="bg-slate-50 rounded-xl p-4">
              <ToothChart
                selectedTeeth={order.teeth}
                onTeethChange={() => {}}
                mode="bridge"
                disabled
                size="small"
              />
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Notes</h4>
              <p className="text-slate-600 bg-slate-50 rounded-xl p-4">{order.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Status History</h4>
            <div className="space-y-3">
              {order.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-2"></div>
                  <div>
                    <p className="text-sm text-slate-800">{entry.note}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(entry.timestamp).toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => onTogglePriority(order.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition
              ${order.priority
                ? 'bg-amber-100 text-amber-700'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            {order.priority ? 'Urgent' : 'Mark Urgent'}
          </button>

          {order.status !== 'dispatched' && (
            <button
              onClick={() => onAdvanceStatus(order.id)}
              className="flex items-center gap-2 px-5 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              Advance Status
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard({ onNavigate }) {
  const {
    orders,
    isAuthenticated,
    dashboardUser,
    login,
    logout,
    getStats,
    getOrdersByServiceType,
    getOrdersByStatusChart,
    getTopPractices,
    advanceOrderStatus,
    togglePriority
  } = useLabDemo();

  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  // Handle login
  const handleLogin = (username, password) => {
    const result = login(username, password);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  const stats = getStats();
  const serviceChartData = getOrdersByServiceType();
  const statusChartData = getOrdersByStatusChart();
  const topPractices = getTopPractices();

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === '' ||
        order.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.practiceName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-slate-800 hidden sm:inline">Lab Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{dashboardUser?.name}</p>
              <p className="text-xs text-slate-400">{dashboardUser?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            {getGreeting()}, {dashboardUser?.name}
          </h1>
          <p className="text-slate-500">Here's what's happening today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Package}
            label="New Today"
            value={stats.newToday}
            color="sky"
          />
          <StatCard
            icon={Zap}
            label="In Production"
            value={stats.inProduction}
            color="purple"
          />
          <StatCard
            icon={Eye}
            label="Quality Check"
            value={stats.qualityCheck}
            color="amber"
          />
          <StatCard
            icon={CheckCircle}
            label="Ready"
            value={stats.ready}
            color="emerald"
          />
          <StatCard
            icon={DollarSign}
            label="This Week"
            value={`£${stats.weekRevenue.toLocaleString()}`}
            trend="+12%"
            color="emerald"
          />
        </div>

        {/* Urgent Orders Alert */}
        {stats.urgentOrders > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-amber-700">
              <strong>{stats.urgentOrders}</strong> urgent order{stats.urgentOrders > 1 ? 's' : ''} requiring attention
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order ref or practice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Statuses</option>
                  {orderStatuses.map(status => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order Ref</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Practice</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Service</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Shade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.priority && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          <span className="font-mono font-medium text-slate-800">{order.ref}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800">{order.practiceName}</p>
                        <p className="text-xs text-slate-400">{order.dentist}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-slate-600 text-sm">{order.serviceName}</p>
                        <p className="text-xs text-slate-400">{order.units} unit{order.units > 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <ShadeDisplay shadeId={order.shade} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-600 text-sm">
                          {new Date(order.dueDate).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short'
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No orders found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Orders by Service */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                Orders by Service
              </h3>
              <SimpleBarChart data={serviceChartData.slice(0, 6)} height={150} />
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-400" />
                Orders by Status
              </h3>
              <div className="flex items-center justify-center">
                <SimpleDonutChart data={statusChartData} size={150} />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {statusChartData.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="text-xs text-slate-500">
                    {item.name}: {item.count}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Practices */}
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Top Practices
              </h3>
              <div className="space-y-3">
                {topPractices.map((practice, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 truncate flex-1">{practice.name}</span>
                    <span className="text-sm font-semibold text-slate-800">{practice.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAdvanceStatus={(id) => {
            advanceOrderStatus(id);
            setSelectedOrder(orders.find(o => o.id === id));
          }}
          onTogglePriority={(id) => {
            togglePriority(id);
            setSelectedOrder(orders.find(o => o.id === id));
          }}
        />
      )}
    </div>
  );
}
