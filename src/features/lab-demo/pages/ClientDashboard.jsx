import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, Clock, Package, CheckCircle, Truck, AlertCircle,
  ChevronRight, X, Search, Filter, CalendarDays, Building2, User
} from 'lucide-react';
import { StatusBadge, ShadeDisplay } from '../components';
import { useLabDemo } from '../context/LabDemoContext';
import { orderStatuses } from '../data/orders';

/**
 * Client Dashboard - For Dentists
 * - View all orders from their practice
 * - See delivery dates and status
 * - Request date changes (postpone delivery)
 */

// Mock client data
const CLIENT_USER = {
  id: 'client-1',
  name: 'Dr. Sarah Mitchell',
  practice: 'Smile Dental Clinic',
  email: 'sarah@smiledental.co.uk'
};

// Date change modal
function DateChangeModal({ order, onClose, onConfirm }) {
  const currentDate = new Date(order.dueDate);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  // Calculate min date (must be after current due date)
  const minDate = new Date(currentDate);
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  // Calculate max date (up to 14 days later)
  const maxDate = new Date(currentDate);
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDate) {
      onConfirm(order.id, newDate, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Change Delivery Date</h3>
            <p className="text-sm text-slate-500">{order.ref}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Current delivery date:</p>
                <p className="text-amber-700">
                  {currentDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Delivery Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={minDateStr}
              max={maxDateStr}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-slate-500">
              You can postpone up to 14 days from the original date
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Patient appointment rescheduled"
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newDate}
              className="flex-1 py-3 px-4 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Order card component
function OrderCard({ order, onRequestDateChange }) {
  const statusInfo = orderStatuses.find(s => s.id === order.status);
  const dueDate = new Date(order.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const isUrgent = daysUntilDue <= 2 && order.status !== 'dispatched';
  const canChangeDueDate = ['received', 'in_production'].includes(order.status);

  return (
    <div className={`bg-white rounded-xl border ${isUrgent ? 'border-amber-200' : 'border-slate-100'} overflow-hidden hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-mono font-bold text-slate-800">{order.ref}</h4>
            <p className="text-sm text-slate-500">{order.serviceName}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Shade & Units */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <ShadeDisplay shadeId={order.shade} size="small" />
            <span>{order.shade}</span>
          </div>
          <span>•</span>
          <span>{order.units} unit{order.units > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="p-4 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              order.status === 'dispatched'
                ? 'bg-emerald-100 text-emerald-600'
                : isUrgent
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-slate-100 text-slate-600'
            }`}>
              {order.status === 'dispatched' ? (
                <Truck className="w-5 h-5" />
              ) : (
                <Calendar className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">
                {order.status === 'dispatched' ? 'Dispatched' : 'Expected Delivery'}
              </p>
              <p className={`font-semibold ${isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                {dueDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>

          {canChangeDueDate && (
            <button
              onClick={() => onRequestDateChange(order)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Change Date</span>
            </button>
          )}
        </div>

        {isUrgent && order.status !== 'dispatched' && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4" />
            <span>Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Client Dashboard
export default function ClientDashboard({ onNavigate }) {
  const { orders } = useLabDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateChanges, setDateChanges] = useState({}); // Track requested date changes

  // Filter orders for this client (in real app, would filter by practice)
  const clientOrders = orders.filter(order =>
    order.practiceName === 'Smile Dental Clinic' ||
    order.practiceName === 'Central Dental Practice'
  );

  // Apply search and status filters
  const filteredOrders = clientOrders.filter(order => {
    const matchesSearch = searchQuery === '' ||
      order.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Group by status for summary
  const statusCounts = {
    active: clientOrders.filter(o => !['dispatched'].includes(o.status)).length,
    dispatched: clientOrders.filter(o => o.status === 'dispatched').length,
    total: clientOrders.length
  };

  const handleDateChange = (orderId, newDate, reason) => {
    setDateChanges(prev => ({
      ...prev,
      [orderId]: { newDate, reason, requestedAt: new Date() }
    }));
    // In real app, would send to backend
    console.log('Date change requested:', { orderId, newDate, reason });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('landing')}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-slate-800">My Orders</h1>
                <p className="text-xs text-slate-500">{CLIENT_USER.practice}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{CLIENT_USER.name}</p>
                <p className="text-xs text-slate-400">{CLIENT_USER.email}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statusCounts.active}</p>
                <p className="text-xs text-slate-500">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statusCounts.dispatched}</p>
                <p className="text-xs text-slate-500">Dispatched</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{statusCounts.total}</p>
                <p className="text-xs text-slate-500">Total Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'received', 'in_production', 'quality_check', 'dispatched'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="relative">
                <OrderCard
                  order={order}
                  onRequestDateChange={setSelectedOrder}
                />
                {dateChanges[order.id] && (
                  <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    Date change requested
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* New Order CTA */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Need to place a new order?</h3>
          <p className="text-emerald-100 mb-4">Submit your case online in just a few minutes</p>
          <button
            onClick={() => onNavigate('order')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition"
          >
            Place New Order
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Date Change Modal */}
      {selectedOrder && (
        <DateChangeModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={handleDateChange}
        />
      )}
    </div>
  );
}
