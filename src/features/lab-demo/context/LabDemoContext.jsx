import React, { createContext, useContext, useState, useCallback } from 'react';
import { initialOrders, generateOrderRef, orderStatuses, getNextStatus } from '../data/orders';
import { practices } from '../data/practices';
import { services } from '../data/services';

const LabDemoContext = createContext(null);

export function LabDemoProvider({ children }) {
  // Orders state
  const [orders, setOrders] = useState(initialOrders);

  // Dashboard auth state (simple demo auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardUser, setDashboardUser] = useState(null);

  // Demo credentials
  const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'pictodent2025'
  };

  // Login function
  const login = useCallback((username, password) => {
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setDashboardUser({ name: 'Kathrin', role: 'Lab Manager' });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setDashboardUser(null);
  }, []);

  // Add new order
  const addOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      ref: generateOrderRef(),
      status: 'received',
      priority: false,
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'Order received via online portal'
        }
      ],
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId, newStatus, note = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const historyEntry = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${newStatus}`
        };
        return {
          ...order,
          status: newStatus,
          statusHistory: [...order.statusHistory, historyEntry]
        };
      }
      return order;
    }));
  }, []);

  // Advance order to next status
  const advanceOrderStatus = useCallback((orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      updateOrderStatus(orderId, nextStatus.id);
    }
  }, [orders, updateOrderStatus]);

  // Toggle order priority
  const togglePriority = useCallback((orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, priority: !order.priority };
      }
      return order;
    }));
  }, []);

  // Add internal note to order
  const addOrderNote = useCallback((orderId, note) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const historyEntry = {
          status: order.status,
          timestamp: new Date().toISOString(),
          note: `[Internal Note] ${note}`
        };
        return {
          ...order,
          statusHistory: [...order.statusHistory, historyEntry]
        };
      }
      return order;
    }));
  }, []);

  // Get order by reference
  const getOrderByRef = useCallback((ref) => {
    return orders.find(o => o.ref.toLowerCase() === ref.toLowerCase());
  }, [orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((statusId) => {
    return orders.filter(o => o.status === statusId);
  }, [orders]);

  // Get today's orders
  const getTodaysOrders = useCallback(() => {
    const today = new Date().toDateString();
    return orders.filter(o => new Date(o.createdAt).toDateString() === today);
  }, [orders]);

  // Get orders stats
  const getStats = useCallback(() => {
    const today = new Date().toDateString();
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const weekOrders = orders.filter(o => new Date(o.createdAt) > thisWeek);

    // Calculate revenue (approximate based on service prices)
    const weekRevenue = weekOrders.reduce((sum, order) => {
      const service = services.find(s => s.id === order.serviceId);
      if (service && service.price_range_high) {
        const avgPrice = (service.price_range_low + service.price_range_high) / 2;
        return sum + (avgPrice * order.units);
      }
      return sum + 100; // Default for custom orders
    }, 0);

    return {
      newToday: todayOrders.length,
      inProduction: orders.filter(o => ['design', 'milling', 'finishing'].includes(o.status)).length,
      qualityCheck: orders.filter(o => o.status === 'quality').length,
      ready: orders.filter(o => o.status === 'ready').length,
      weekRevenue: Math.round(weekRevenue),
      totalOrders: orders.length,
      urgentOrders: orders.filter(o => o.priority && o.status !== 'dispatched').length
    };
  }, [orders]);

  // Get orders by service type for charts
  const getOrdersByServiceType = useCallback(() => {
    const counts = {};
    orders.forEach(order => {
      const serviceName = order.serviceName?.split(' (')[0] || 'Other';
      counts[serviceName] = (counts[serviceName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [orders]);

  // Get orders by status for charts
  const getOrdersByStatusChart = useCallback(() => {
    return orderStatuses.map(status => ({
      name: status.label,
      count: orders.filter(o => o.status === status.id).length,
      color: status.color
    }));
  }, [orders]);

  // Get weekly order trend
  const getWeeklyTrend = useCallback(() => {
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const count = orders.filter(o => {
        const created = new Date(o.createdAt);
        return created >= weekStart && created < weekEnd;
      }).length;

      weeks.push({
        week: `W${8 - i}`,
        orders: count
      });
    }
    return weeks;
  }, [orders]);

  // Get top practices
  const getTopPractices = useCallback(() => {
    const counts = {};
    orders.forEach(order => {
      counts[order.practiceName] = (counts[order.practiceName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const value = {
    // State
    orders,
    isAuthenticated,
    dashboardUser,
    practices,
    services,
    orderStatuses,

    // Auth
    login,
    logout,

    // Order actions
    addOrder,
    updateOrderStatus,
    advanceOrderStatus,
    togglePriority,
    addOrderNote,

    // Queries
    getOrderByRef,
    getOrdersByStatus,
    getTodaysOrders,
    getStats,
    getOrdersByServiceType,
    getOrdersByStatusChart,
    getWeeklyTrend,
    getTopPractices
  };

  return (
    <LabDemoContext.Provider value={value}>
      {children}
    </LabDemoContext.Provider>
  );
}

export function useLabDemo() {
  const context = useContext(LabDemoContext);
  if (!context) {
    throw new Error('useLabDemo must be used within LabDemoProvider');
  }
  return context;
}

export default LabDemoContext;
