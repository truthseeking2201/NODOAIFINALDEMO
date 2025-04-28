import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Shield } from 'lucide-react';

interface FeaturedVaultPillProps {
  label: string;
  vaultName: string;  // Internal reference, not displayed to users
  type: 'nova' | 'orion' | 'emerald';
  metric: string;
}

export function FeaturedVaultPill({ label, vaultName, type, metric }: FeaturedVaultPillProps) {
  const getVaultColors = () => {
    switch (type) {
      case 'nova':
        return 'from-nova/20 via-nova/10 to-nova/5 border-nova/30 text-nova hover:border-nova/50 hover:shadow-[0_0_15px_rgba(236,111,5,0.2)]';
      case 'orion':
        return 'from-orion/20 via-orion/10 to-orion/5 border-orion/30 text-orion hover:border-orion/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'emerald':
        return 'from-emerald/20 via-emerald/10 to-emerald/5 border-emerald/30 text-emerald hover:border-emerald/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      default:
        return 'from-white/10 to-white/5 border-white/10 text-white hover:border-white/20';
    }
  };

  const getVaultId = () => {
    if (vaultName === 'DEEP-SUI') return 'deep-sui';
    if (vaultName === 'CETUS-SUI') return 'cetus-sui';
    if (vaultName === 'SUI-USDC') return 'sui-usdc';
    return vaultName.toLowerCase().replace('-', '-');
  };

  const getIcon = () => {
    switch (type) {
      case 'nova':
        return <Flame size={14} className="text-nova" />;
      case 'orion':
        return <TrendingUp size={14} className="text-orion" />;
      case 'emerald':
        return <Shield size={14} className="text-emerald" />;
      default:
        return null;
    }
  };

  // Map category label to friendly display names - no direct pool names
  const getCategoryLabel = () => {
    switch (type) {
      case 'nova':
        return 'High Yield';
      case 'orion':
        return 'Balanced';
      case 'emerald':
        return 'Stable';
      default:
        return 'Standard';
    }
  };

  return (
    <Link to={`/vaults/${getVaultId()}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className={`bg-gradient-to-r ${getVaultColors()} backdrop-blur-xl rounded-full py-2 px-5 border flex items-center space-x-3 cursor-pointer transition-all duration-300`}
      >
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 flex items-center justify-center">
            {getIcon()}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">
            {label}
          </div>
        </div>
        <div className="text-xs md:text-sm font-medium flex items-center space-x-2">
          <span className="font-semibold">{getCategoryLabel()}</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="font-mono font-bold">{metric}</span>
        </div>
      </motion.div>
    </Link>
  );
}
