import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface VaultDetailHeaderProps {
  vaultName: string; // Internal reference, not shown to users
  styles: {
    gradientText: string;
  };
}

export function VaultDetailHeader({ vaultName, styles }: VaultDetailHeaderProps) {
  const getVaultInfo = () => {
    if (vaultName.includes('SUI-USDC')) {
      return {
        displayName: 'SUI-USDC',
        subtitle: 'A low-risk vault utilizing the SUI ↔ USDC trading pair',
        riskBadge: {
          text: 'Low Risk',
          class: 'bg-emerald/10 text-emerald border-emerald/20'
        },
        type: 'emerald'
      };
    } else if (vaultName.includes('Cetus')) {
      return {
        displayName: 'CETUS-SUI',
        subtitle: 'A moderate-risk vault focusing on the CETUS ↔ SUI trading pair',
        riskBadge: {
          text: 'Medium Risk',
          class: 'bg-orion/10 text-orion border-orion/20'
        },
        type: 'orion'
      };
    } else {
      return {
        displayName: 'DEEP-SUI',
        subtitle: 'A high-risk, high-reward vault leveraging the DEEP ↔ SUI trading pair',
        riskBadge: {
          text: 'High Risk',
          class: 'bg-nova/10 text-nova border-nova/20'
        },
        type: 'nova'
      };
    }
  };

  const vaultInfo = getVaultInfo();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Link to="/">
        <Button
          variant="ghost"
          className="mb-4 mt-2 rounded-xl flex items-center gap-2 text-[#C9CDD3] hover:text-white font-medium text-xs tracking-wide"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Vaults
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className={`w-10 h-10 rounded-lg ${
              vaultInfo.type === 'nova' ? 'bg-gradient-to-br from-nova/20 to-transparent' :
              vaultInfo.type === 'orion' ? 'bg-gradient-to-br from-orion/20 to-transparent' :
              'bg-gradient-to-br from-emerald/20 to-transparent'
            } flex items-center justify-center`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Brain size={20} className={
                  vaultInfo.type === 'nova' ? 'text-nova' :
                  vaultInfo.type === 'orion' ? 'text-orion' :
                  'text-emerald'
                } />
              </motion.div>
            </div>
            <motion.div
              className={`absolute -inset-1 rounded-lg border ${
                vaultInfo.type === 'nova' ? 'border-nova/30' :
                vaultInfo.type === 'orion' ? 'border-orion/30' :
                'border-emerald/30'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2, 1.4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 5
              }}
            />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold text-white mb-0.5 ${
              vaultInfo.type === 'nova' ? 'text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500' :
              vaultInfo.type === 'orion' ? 'text-transparent bg-clip-text bg-gradient-to-r from-orion via-yellow-500 to-amber-500' :
              'text-transparent bg-clip-text bg-gradient-to-r from-emerald via-green-500 to-teal-500'
            }`}>
              {vaultInfo.displayName}
            </h1>
            <p className="text-white/60 text-sm">
              {vaultInfo.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`rounded-full px-3 py-1.5 border text-sm font-medium flex items-center gap-1.5 ${vaultInfo.riskBadge.class}`}>
            <ShieldCheck className="h-4 w-4" />
            {vaultInfo.riskBadge.text}
          </div>
        </div>
      </div>
    </div>
  );
}
