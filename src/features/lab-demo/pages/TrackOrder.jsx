import React, { useState } from 'react';
import { ArrowLeft, Search, Package, Clock, CheckCircle, Truck, AlertCircle, Phone, Mail } from 'lucide-react';
import { StatusPipeline, ShadeDisplay } from '../components';
import { useLabDemo } from '../context/LabDemoContext';
import { orderStatuses } from '../data/orders';

/**
 * Order Tracking Page
 * Allows dentists to track their orders without logging in
 */

export default function TrackOrder({ onNavigate }) {
  const { getOrderByRef } = useLabDemo();
  const [searchRef, setSearchRef] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setIsSearching(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const found = getOrderByRef(searchRef.trim());
    if (found) {
      setOrder(found);
    } else {
      setError('Order not found. Please check the reference number and try again.');
    }
    setIsSearching(false);
  };

  // Get status info
  const getStatusInfo = (statusId) => {
    const status = orderStatuses.find(s => s.id === statusId);
    const index = orderStatuses.findIndex(s => s.id === statusId);
    return { status, progress: ((index + 1) / orderStatuses.length) * 100 };
  };

  const statusInfo = order ? getStatusInfo(order.status) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-slate-800 hidden sm:inline">Picto Dent</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Track Your Order
          </h1>
          <p className="text-slate-500">
            Enter your order reference number to see the current status
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value.toUpperCase())}
                placeholder="e.g. PD-2026-1234"
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-lg font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!searchRef.trim() || isSearching}
              className={`
                px-6 py-3.5 rounded-xl font-semibold transition-all
                ${!searchRef.trim() || isSearching
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
                }
              `}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Track'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </form>

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Order Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-mono">{order.ref}</h2>
                  <p className="text-slate-500">{order.practiceName}</p>
                </div>
                {order.priority && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    PRIORITY
                  </span>
                )}
              </div>

              {/* Current Status */}
              <div className={`
                p-4 rounded-xl mb-4
                ${statusInfo.status.bgLight}
              `}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${statusInfo.status.color} flex items-center justify-center`}>
                    {order.status === 'dispatched' ? (
                      <Truck className="w-5 h-5 text-white" />
                    ) : order.status === 'ready' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${statusInfo.status.textColor}`}>
                      {statusInfo.status.label}
                    </p>
                    <p className="text-sm text-slate-500">
                      Last updated: {new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Pipeline */}
              <StatusPipeline currentStatus={order.status} compact />
            </div>

            {/* Order Details */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Order Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Service</p>
                  <p className="font-medium text-slate-800">{order.serviceName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Units</p>
                  <p className="font-medium text-slate-800">{order.units}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Shade</p>
                  <div className="flex items-center gap-2">
                    <ShadeDisplay shadeId={order.shade} size="normal" />
                    <span className="font-medium text-slate-800">{order.shade}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Estimated Completion</p>
                  <p className="font-medium text-slate-800">
                    {new Date(order.dueDate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* Teeth */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">Teeth</p>
                <div className="flex flex-wrap gap-2">
                  {order.teeth.map(t => (
                    <span
                      key={t.number}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium
                        ${t.type === 'pontic'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }
                      `}
                    >
                      {t.number}
                      {t.type === 'pontic' && ' (pontic)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Progress Timeline</h3>
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                  {order.statusHistory.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-sky-500 border-2 border-white"></div>
                      <p className="text-sm text-slate-800">{entry.note}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(entry.timestamp).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3">
                Questions about your order? Contact us:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:02088123978"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  020 8812 3978
                </a>
                <a
                  href="mailto:info@pictodent.co.uk"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  info@pictodent.co.uk
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Sample Reference Hint */}
        {!order && !error && (
          <div className="text-center text-sm text-slate-400">
            <p>Try searching for: <span className="font-mono">PD-2026-1247</span></p>
          </div>
        )}
      </main>
    </div>
  );
}
