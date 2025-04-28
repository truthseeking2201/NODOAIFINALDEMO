
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import {
  Bell,
  X,
  Menu,
  Brain,
  Search,
  Zap,
  BarChart3,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Cpu,
  SlidersHorizontal
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'ai';
  read: boolean;
  aiAction?: string;
}

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiActivityMode, setAiActivityMode] = useState<"analyzing" | "optimizing" | "monitoring" | "predicting">("monitoring");
  const [showAiDropdown, setShowAiDropdown] = useState(false);
  const location = useLocation();
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Preload the Dashboard component on header mount to ensure it's ready for navigation
  useEffect(() => {
    // Preload Dashboard component in the background
    import("@/pages/Dashboard").catch(error => {
      console.error("Failed to preload Dashboard:", error);
    });
  }, []);

  // Reset mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Mock notifications for demo - enhanced with AI notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'AI Strategy Optimization',
      message: 'AI has adjusted your portfolio allocation for maximum yield.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'ai',
      read: false,
      aiAction: 'View Details'
    },
    {
      id: '2',
      title: 'Deposit Successful',
      message: 'Your deposit of $500 to DEEP-SUI vault was successful.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'success',
      read: false
    },
    {
      id: '3',
      title: 'Unlock Soon',
      message: 'Your CETUS-SUI position will unlock in 2 days.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'info',
      read: false
    },
    {
      id: '4',
      title: 'Performance Alert',
      message: 'SUI-USDC vault has gained 3.2% in the last 24 hours.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'info',
      read: true
    },
    {
      id: '5',
      title: 'AI Risk Assessment',
      message: 'Market volatility detected. AI has adjusted risk parameters.',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      type: 'ai',
      read: true,
      aiAction: 'Review'
    }
  ]);

  // Fix AI mode to avoid random changes
  useEffect(() => {
    // Set a fixed mode for demo purposes
    setAiActivityMode("monitoring");
  }, []);

  // Focus search input when activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      // Focus immediately
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      setSearchQuery("");
    }
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'ai':
        return (
          <div className="w-8 h-8 rounded-full bg-nova/20 border border-nova/30 flex items-center justify-center text-nova">
            <Brain size={16} />
          </div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 2L21 19H3L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 18L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-orion/20 border border-orion/30 flex items-center justify-center text-orion">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full bg-background/80 backdrop-blur-2xl">
      {/* Neural pulse line animation */}
      <div className="absolute top-0 left-0 right-0 h-px w-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-nova to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Main header content */}
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="/lovable-uploads/5e426b4d-ccda-486b-8980-761ff3c70294.png"
                  alt="NODO AI Logo"
                  className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <div className="h-full w-full rounded-full bg-nova/30 blur-md" />
              </motion.div>
            </div>

            {/* AI Status Indicator removed */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium
                ${location.pathname === '/'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault(); // Prevent redundant navigation if already on this page
                }
              }}
            >
              <div className="flex items-center gap-1.5">
                <Zap size={14} className={location.pathname === '/' ? 'text-nova' : ''} />
                <span>Vaults</span>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium
                ${location.pathname === '/dashboard'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              onClick={(e) => {
                if (location.pathname === '/dashboard') {
                  e.preventDefault(); // Prevent redundant navigation if already on this page
                  return;
                }

                // Preload Dashboard component on click to ensure it's ready
                import("@/pages/Dashboard").catch(err =>
                  console.error("Failed to preload Dashboard:", err)
                );
              }}
            >
              <div className="flex items-center gap-1.5">
                <BarChart3 size={14} className={location.pathname === '/dashboard' ? 'text-nova' : ''} />
                <span>Dashboard</span>
              </div>
            </Link>

            {/* AI Features Dropdown removed */}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <AnimatePresence initial={false}>
            {isSearchActive ? (
              <motion.div
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative hidden md:block"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vaults, assets..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-nova/50 focus:border-nova/50"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search size={14} className="text-white/50" />
                </div>
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  onClick={toggleSearch}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSearch}
                        className="focus-ring h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                      >
                        <Search size={14} className="text-white/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Search vaults & assets</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative focus-ring h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                  aria-label="Notifications"
                >
                  <Bell size={14} className="text-white/70" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-nova text-[10px] font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Notifications {unreadCount > 0 ? `(${unreadCount} unread)` : ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Connect Wallet Button */}
          <ConnectWalletButton />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-ring h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu size={14} className="text-white/70" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden container backdrop-blur-2xl border-b border-white/10"
          >
            <div className="bg-black/20 rounded-lg my-2 overflow-hidden">
              {/* Mobile Search */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vaults, assets..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-nova/50"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search size={14} className="text-white/50" />
                  </div>
                </div>
              </div>

              {/* Mobile AI Status removed */}

              {/* Navigation Links */}
              <nav className="flex flex-col p-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    location.pathname === '/'
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Zap size={16} className={location.pathname === '/' ? 'text-nova' : ''} />
                  <span className="font-medium">Vaults</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    location.pathname === '/dashboard'
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={(e) => {
                    if (location.pathname === '/dashboard') {
                      e.preventDefault();
                    } else {
                      // Preload Dashboard component on mobile click
                      import("@/pages/Dashboard").catch(err =>
                        console.error("Failed to preload Dashboard on mobile:", err)
                      );
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <BarChart3 size={16} className={location.pathname === '/dashboard' ? 'text-nova' : ''} />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </nav>

              {/* AI Features section removed */}

              {/* Close button */}
              <div className="p-3 border-t border-white/5">
                <Button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Close Menu
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent className="w-full sm:max-w-md bg-[#121620]/95 backdrop-blur-xl border-l border-white/10 p-0 pt-10">
          <SheetHeader className="px-4 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-nova" />
                <SheetTitle className="text-lg font-medium text-white">Notifications</SheetTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs font-medium h-8 hover:bg-white/10 text-white/70"
                >
                  Mark all as read
                </Button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                    <X size={14} className="text-white/70" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetHeader>

          <div className="py-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-white/60">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-white/30" />
                </div>
                <p className="text-white/60 font-medium">No notifications yet</p>
                <p className="text-white/40 text-sm mt-1">We'll notify you of important updates</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-start p-4 transition-all duration-300 hover:bg-white/5 cursor-pointer ${notification.read ? 'bg-transparent' : 'bg-white/5'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mr-3">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className={`font-medium text-sm ${notification.read ? 'text-white/70' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-white/40 ml-2 whitespace-nowrap">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      <p className={`text-xs mt-1 ${notification.read ? 'text-white/60' : 'text-white/80'}`}>
                        {notification.message}
                      </p>

                      {notification.aiAction && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 py-0 text-[11px] font-medium rounded bg-nova/10 text-nova hover:bg-nova/20 hover:text-white"
                          >
                            <div className="flex items-center gap-1">
                              <span>{notification.aiAction}</span>
                              <ExternalLink size={10} />
                            </div>
                          </Button>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-nova ml-2 mt-1 shrink-0"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Actions Footer */}
          <div className="mt-auto border-t border-white/10 p-4">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start text-sm font-normal text-white/70 hover:text-white hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} />
                  <span>Notification Settings</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-sm font-normal text-white/70 hover:text-white hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Cpu size={14} />
                  <span>AI Notification Preferences</span>
                </div>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
