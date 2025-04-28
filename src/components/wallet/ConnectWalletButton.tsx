
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Wallet, ExternalLink, Shield, Brain, AlertCircle, RefreshCw, ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { TokenIcon } from "@/components/shared/TokenIcons";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { WalletSignatureDialog } from "./WalletSignatureDialog";
import { useWallet } from "@/hooks/useWallet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ConnectWalletButton() {
  const {
    isConnected,
    address,
    balance,
    disconnect,
    isConnectModalOpen,
    openConnectModal,
    closeConnectModal,
    isSignatureDialogOpen,
    currentTransaction,
    handleSignatureComplete
  } = useWallet();

  const { toast } = useToast();
  const [showPulse, setShowPulse] = useState(false);
  const [walletRiskScore, setWalletRiskScore] = useState(98); // Mock AI risk score
  const [securityStatus, setSecurityStatus] = useState<"protected" | "warning" | "risk">("protected");
  const [riskAssessmentTime, setRiskAssessmentTime] = useState<string>("");
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  useEffect(() => {
    // Update risk assessment time
    const date = new Date();
    setRiskAssessmentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Set pulse animation on button when first connecting
    if (isConnected) {
      setShowPulse(true);
      const timer = setTimeout(() => {
        setShowPulse(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
        duration: 2000,
      });
    }
  };

  const refreshWalletData = () => {
    // Simulate refresh with animation
    setLastRefreshTime(Date.now());
    toast({
      title: "Wallet refreshed",
      description: "Latest wallet data loaded",
      duration: 2000,
    });
  };

  // Get security status indicator
  const getSecurityIndicator = (status: "protected" | "warning" | "risk") => {
    switch (status) {
      case "protected":
        return (
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">Protected</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} className="text-orion" />
            <span className="text-xs text-orion font-medium">Warning</span>
          </div>
        );
      case "risk":
        return (
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-xs text-red-500 font-medium">Risky</span>
          </div>
        );
    }
  };

  return (
    <>
      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0.9, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={openConnectModal}
            className="bg-gradient-to-r from-nova-600 to-nova-500 text-white hover:shadow-lg hover:shadow-nova/20 relative overflow-hidden transition-all duration-300"
            data-wallet-connect="true"
          >
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </motion.div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Button
                variant="outline"
                className="border-white/20 bg-gradient-to-r from-white/[0.07] to-white/[0.03] backdrop-blur-sm hover:bg-white/10 transition-all h-9 px-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
                {showPulse && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-nova"
                    animate={{
                      opacity: [1, 0],
                      scale: [1, 1.1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: 2,
                      repeatType: "loop"
                    }}
                  />
                )}
                <div className="flex items-center">
                  <span className="font-mono mr-2">{formatAddress(address || '')}</span>
                  <div className="hidden sm:flex items-center text-white/80 bg-white/10 px-2 py-0.5 rounded-full text-xs">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"
                    />
                    <span className="font-mono">{balance.usdc !== undefined ? `${balance.usdc} USDC` : ''}</span>
                  </div>
                </div>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[340px] p-0 rounded-xl border border-white/10 bg-[#121620]/95 shadow-xl backdrop-blur-xl overflow-hidden"
          >
            <div className="relative">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 opacity-50 pointer-events-none overflow-hidden">
                <div className="absolute -top-[100px] -right-[100px] w-[250px] h-[250px] rounded-full bg-nova/10 blur-[80px]" />
                <div className="absolute -bottom-[100px] -left-[100px] w-[250px] h-[250px] rounded-full bg-violet-500/10 blur-[80px]" />
              </div>

              {/* Content */}
              <div className="relative flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-nova" />
                      </div>
                      <span className="text-white font-medium">Connected Wallet</span>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-white/10"
                            onClick={refreshWalletData}
                          >
                            <motion.div
                              key={lastRefreshTime}
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                              <RefreshCw size={14} className="text-white/70" />
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Refresh wallet data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* AI Security Assessment */}
                  <div className="mt-3 p-2 bg-black/20 rounded-lg border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Brain size={14} className="text-nova" />
                      <span className="text-xs text-white/70">AI Security Assessment:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSecurityIndicator(securityStatus)}
                      <motion.div
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center"
                      >
                        <span className="text-xs font-mono text-white/60">{walletRiskScore}/100</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Address */}
                  <div className="mb-4">
                    <div className="text-xs text-white/50 mb-1.5">Wallet Address</div>
                    <button
                      onClick={handleCopyAddress}
                      className="w-full text-left bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors group"
                    >
                      <span className="font-mono text-xs text-white/80 block truncate pr-8">
                        {address}
                      </span>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 rounded-full p-1 group-hover:bg-white/20">
                        <Copy className="w-3 h-3 text-white/70" />
                      </div>
                    </button>
                  </div>

                  {/* Balances */}
                  <div className="mb-4">
                    <div className="text-xs text-white/50 mb-2">Balance</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-black/20 border border-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TokenIcon token="USDC" size={20} />
                          <div>
                            <div className="text-sm text-white font-medium">USDC</div>
                            <div className="text-xs text-white/50">Stablecoin</div>
                          </div>
                        </div>
                        <div className="font-mono text-sm text-white">{balance.usdc}</div>
                      </div>

                      {balance.receiptTokens > 0 && (
                        <div className="flex items-center justify-between p-2.5 bg-black/20 border border-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <TokenIcon token="RECEIPT" size={20} />
                              <motion.div
                                animate={{
                                  opacity: [0, 0.8, 0],
                                  scale: [1, 1.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "loop"
                                }}
                                className="absolute inset-0 rounded-full border border-nova/50"
                              />
                            </div>
                            <div>
                              <div className="text-sm text-white font-medium flex items-center gap-1">
                                NODOAIx
                                <Sparkles size={10} className="text-nova" />
                              </div>
                              <div className="text-xs text-white/50">AI Yield Token</div>
                            </div>
                          </div>
                          <div className="font-mono text-sm text-nova">{balance.receiptTokens.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10 text-sm">
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight size={14} />
                        <span>View on Explorer</span>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="border-nova/20 bg-nova/5 hover:bg-nova/10 text-nova text-sm">
                      <div className="flex items-center gap-1.5">
                        <Brain size={14} />
                        <span>AI Portfolio Analysis</span>
                      </div>
                    </Button>
                  </div>

                  {/* Disconnect Button */}
                  <Button
                    variant="outline"
                    onClick={disconnect}
                    className="w-full h-10 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 flex items-center justify-center gap-2 hover:bg-red-500/20 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Disconnect</span>
                  </Button>
                </div>

                {/* Status Footer */}
                <div className="text-[10px] border-t border-white/10 p-2 text-white/40 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span>Secure Connection</span>
                  </div>
                  <div>Last checked: {riskAssessmentTime}</div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* New Connect Wallet Modal */}
      <ConnectWalletModal
        open={isConnectModalOpen}
        onClose={closeConnectModal}
      />

      {/* Wallet Signature Dialog */}
      <WalletSignatureDialog
        open={isSignatureDialogOpen}
        onComplete={handleSignatureComplete}
        transactionType={currentTransaction?.type || 'deposit'}
        amount={currentTransaction?.amount}
        vaultName={currentTransaction?.vaultName}
      />
    </>
  );
}
