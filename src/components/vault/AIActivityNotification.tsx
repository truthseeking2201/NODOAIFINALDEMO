import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Info, AlertCircle, CheckCircle } from "lucide-react";

interface AIActivityNotificationProps {
  vaultType: 'nova' | 'orion' | 'emerald';
}

export function AIActivityNotification({ vaultType }: AIActivityNotificationProps) {
  const [notifications, setNotifications] = useState<{ message: string; id: number }[]>([]);
  const [nextId, setNextId] = useState(0);

  // Get colors based on vault type
  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: '#f97316',
        bg: 'bg-nova/10',
        border: 'border-nova/30',
      };
      case 'orion': return {
        primary: '#f59e0b',
        bg: 'bg-orion/10',
        border: 'border-orion/30',
      };
      case 'emerald': return {
        primary: '#10b981',
        bg: 'bg-emerald/10',
        border: 'border-emerald/30',
      };
    }
  };

  const colors = getTypeColor();

  // Listen for ai-insight events
  useEffect(() => {
    const handleInsight = (e: CustomEvent) => {
      if (e.detail && e.detail.message) {
        // Add notification
        const id = nextId;
        setNotifications(prev => [...prev, { message: e.detail.message, id }]);
        setNextId(id + 1);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
      }
    };

    // Add event listener
    window.addEventListener('ai-insight', handleInsight as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('ai-insight', handleInsight as EventListener);
    };
  }, [nextId]);

  // If no notifications, don't render
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            className="p-4 rounded-xl shadow-lg backdrop-blur-md border"
            style={{ backgroundColor: `rgba(0, 0, 0, 0.7)` }}
            className={`p-4 rounded-xl shadow-lg backdrop-blur-md border ${colors.border}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Brain size={18} style={{ color: colors.primary }} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">AI Insight</h4>
                <p className="text-xs text-white/80 mt-0.5">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
