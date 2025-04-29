import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export function ConnectWalletModal({ open, onClose, onConnected }: ConnectWalletModalProps) {
  const { connect } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  // Removed auto-connect when modal opens
  // Now wallet connection requires explicit user action

  const handleConnect = async (walletType: 'sui' | 'phantom' | 'martian') => {
    try {
      setIsConnecting(true);
      setError(null);
      setConnectedWallet(walletType);

      await connect(walletType);

      if (onConnected) {
        onConnected();
      }

      // Wait a bit before closing to show the connected state
      setTimeout(() => {
        onClose();
        setConnectedWallet(null);
      }, 1000);

    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError(`Failed to connect to ${walletType} wallet. Please try again.`);
      setConnectedWallet(null);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#101112] border border-white/10 p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-0 relative">
          <button
            className="absolute right-6 top-6 rounded-full h-8 w-8 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
          <DialogDescription className="text-white/60">
            Choose a wallet to connect to Nodo AI Yield Vault
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Sui Wallet */}
          <Button
            variant="outline"
            className={`w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all ${connectedWallet === 'sui' ? 'bg-[#4DA1F9]/10 border-[#4DA1F9]/30' : ''}`}
            onClick={() => handleConnect('sui')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#4DA1F9] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.0379 42.0606L69.0805 26.1006C65.444 22.464 59.582 22.464 55.9454 26.1006L39.988 42.0606C36.3514 45.6972 36.3514 51.5593 39.988 55.1959L55.9454 71.1559C59.582 74.7924 65.444 74.7924 69.0805 71.1559L85.0379 55.1959C88.6745 51.5593 88.6745 45.6972 85.0379 42.0606Z" fill="white"/>
                <path d="M85.0379 72.8041L69.0805 56.8441C65.444 53.2076 59.582 53.2076 55.9454 56.8441L39.988 72.8041C36.3514 76.4407 36.3514 82.3028 39.988 85.9393L55.9454 101.899C59.582 105.536 65.444 105.536 69.0805 101.899L85.0379 85.9393C88.6745 82.3028 88.6745 76.4407 85.0379 72.8041Z" fill="white"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Sui Wallet</div>
              <div className="text-xs text-white/60">Connect to your Sui Wallet</div>
            </div>
            {connectedWallet === 'sui' && isConnecting && (
              <Loader2 className="h-5 w-5 text-[#4DA1F9] animate-spin" />
            )}
            {connectedWallet === 'sui' && !isConnecting && (
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            )}
          </Button>

          {/* Phantom Wallet */}
          <Button
            variant="outline"
            className={`w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all ${connectedWallet === 'phantom' ? 'bg-[#4C44C6]/10 border-[#4C44C6]/30' : ''}`}
            onClick={() => handleConnect('phantom')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#4C44C6] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M93.3325 42.0204C91.5166 41.3098 89.582 40.9544 87.6289 40.9651C82.8798 40.9651 78.5651 42.8177 75.3866 45.9962C72.208 49.1747 70.3555 53.4894 70.3555 58.2386C70.3555 63.3599 72.0728 68.0359 75.0312 71.7483C72.208 71.3929 69.3847 71.2153 66.5614 71.2153C62.4243 71.2153 58.3231 71.7483 54.3672 72.8144C58.6785 61.6181 67.4497 47.1732 81.2488 32.8452C82.6702 31.3607 82.6809 29.0527 81.2701 27.5575C79.8593 26.0622 77.5619 26.05 76.1352 27.5309C59.0338 45.4311 48.7913 63.3706 43.6914 74.9664C35.8795 78.1449 30.4029 84.5294 29.1591 92.1637H31.5245C33.1311 92.1637 34.4288 93.4614 34.4288 95.068C34.4288 96.6745 33.1311 97.9723 31.5245 97.9723H29.0354C29.0997 98.5373 29.1854 99.1024 29.2926 99.6674H31.5353C33.1418 99.6674 34.4396 100.965 34.4396 102.572C34.4396 104.178 33.1418 105.476 31.5353 105.476H30.3771C32.3691 112.14 38.4475 117.094 45.7799 117.094H83.7321C93.0735 117.094 100.71 108.962 100.71 99.0702V59.2189C100.71 50.8798 97.8869 44.1401 93.3325 42.0204Z" fill="white"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Phantom</div>
              <div className="text-xs text-white/60">Connect to your Phantom Wallet</div>
            </div>
            {connectedWallet === 'phantom' && isConnecting && (
              <Loader2 className="h-5 w-5 text-[#4C44C6] animate-spin" />
            )}
            {connectedWallet === 'phantom' && !isConnecting && (
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            )}
          </Button>

          {/* Martian Wallet */}
          <Button
            variant="outline"
            className={`w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all ${connectedWallet === 'martian' ? 'bg-[#1F8ECD]/10 border-[#1F8ECD]/30' : ''}`}
            onClick={() => handleConnect('martian')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#1F8ECD] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M64 24C41.9086 24 24 41.9086 24 64C24 86.0914 41.9086 104 64 104C86.0914 104 104 86.0914 104 64C104 41.9086 86.0914 24 64 24ZM48.7273 50.9091C50.5091 50.9091 52.3636 51.4909 53.8909 52.6545C55.4182 53.8182 56.7273 55.4909 57.4545 57.4545C58.1818 59.4182 58.3273 61.6 57.8909 63.6364C57.4545 65.7455 56.4727 67.6 55.0182 69.0545C53.5636 70.5091 51.7091 71.4909 49.6 71.9273C47.4909 72.3636 45.3818 72.2182 43.3455 71.4909C41.3818 70.7636 39.6364 69.4545 38.4727 67.9273C37.3091 66.4 36.7273 64.5455 36.7273 62.7636C36.7273 60.3273 37.6364 58.0364 39.3091 56.3636C41.0545 54.6909 43.2727 53.7818 45.7091 53.7818C46.7636 53.7818 47.7455 54.1455 48.5455 54.7273C49.3455 55.3818 49.8545 56.2545 50.0727 57.2364C50.2909 58.2182 50.1455 59.2727 49.7091 60.1455C49.2727 61.0182 48.5455 61.7455 47.6727 62.1818C46.8 62.6182 45.7455 62.7636 44.7636 62.5455C43.7818 62.3273 42.9091 61.8182 42.2545 61.0182C41.6 60.2182 41.2364 59.2364 41.2364 58.1818C41.2364 56.7273 41.8909 55.3455 43.0545 54.3636C44.2182 53.3818 45.7455 52.8 47.2727 52.8" fill="white"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Martian</div>
              <div className="text-xs text-white/60">Connect to your Martian Wallet</div>
            </div>
            {connectedWallet === 'martian' && isConnecting && (
              <Loader2 className="h-5 w-5 text-[#1F8ECD] animate-spin" />
            )}
            {connectedWallet === 'martian' && !isConnecting && (
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            )}
          </Button>
        </div>
        <div className="px-6 pb-6 pt-2 text-center">
          {isConnecting && !connectedWallet && (
            <div className="flex items-center justify-center mb-3 text-amber-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm">Connecting...</span>
            </div>
          )}
          <p className="text-xs text-white/60">
            By connecting your wallet, you agree to our <a href="#" className="text-amber-500 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
