import React, { useState } from "react";
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

  const handleConnect = async (walletType: 'sui' | 'phantom' | 'martian') => {
    try {
      setIsConnecting(true);
      setError(null);
      await connect(walletType);
      if (onConnected) {
        onConnected();
      }
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError(`Failed to connect to ${walletType} wallet. Please try again.`);
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
            className="w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all"
            onClick={() => handleConnect('sui')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#4DA1F9] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.0379 42.0606L69.0805 26.1006C65.444 22.464 59.582 22.464 55.9454 26.1006L39.988 42.0606C36.3514 45.6972 36.3514 51.5593 39.988 55.1959L55.9454 71.1559C59.582 74.7924 65.444 74.7924 69.0805 71.1559L85.0379 55.1959C88.6745 51.5593 88.6745 45.6972 85.0379 42.0606Z" fill="white"/>
                <path d="M85.0379 72.8041L69.0805 56.8441C65.444 53.2076 59.582 53.2076 55.9454 56.8441L39.988 72.8041C36.3514 76.4407 36.3514 82.3028 39.988 85.9393L55.9454 101.899C59.582 105.536 65.444 105.536 69.0805 101.899L85.0379 85.9393C88.6745 82.3028 88.6745 76.4407 85.0379 72.8041Z" fill="white"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium">Sui Wallet</div>
              <div className="text-xs text-white/60">Connect to your Sui Wallet</div>
            </div>
          </Button>

          {/* Phantom Wallet */}
          <Button
            variant="outline"
            className="w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all"
            onClick={() => handleConnect('phantom')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#4C44C6] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M93.3325 42.0204C91.5166 41.3098 89.582 40.9544 87.6289 40.9651C82.8798 40.9651 78.5651 42.8177 75.3866 45.9962C72.208 49.1747 70.3555 53.4894 70.3555 58.2386C70.3555 63.3599 72.0728 68.0359 75.0312 71.7483C72.208 71.3929 69.3847 71.2153 66.5614 71.2153C62.4243 71.2153 58.3231 71.7483 54.3672 72.8144C58.6785 61.6181 67.4497 47.1732 81.2488 32.8452C82.6702 31.3607 82.6809 29.0527 81.2701 27.5575C79.8593 26.0622 77.5619 26.05 76.1352 27.5309C59.0338 45.4311 48.7913 63.3706 43.6914 74.9664C35.8795 78.1449 30.4029 84.5294 29.1591 92.1637H31.5245C33.1311 92.1637 34.4288 93.4614 34.4288 95.068C34.4288 96.6745 33.1311 97.9723 31.5245 97.9723H29.0354C29.0997 98.5373 29.1854 99.1024 29.2926 99.6674H31.5353C33.1418 99.6674 34.4396 100.965 34.4396 102.572C34.4396 104.178 33.1418 105.476 31.5353 105.476H30.3771C32.3691 112.14 38.4475 117.094 45.7799 117.094H83.7321C93.0735 117.094 100.71 108.962 100.71 99.0702V59.2189C100.71 50.8798 97.8869 44.1401 93.3325 42.0204Z" fill="white"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium">Phantom</div>
              <div className="text-xs text-white/60">Connect to your Phantom Wallet</div>
            </div>
          </Button>

          {/* Martian Wallet */}
          <Button
            variant="outline"
            className="w-full py-6 px-4 justify-start space-x-4 border-white/10 hover:bg-white/5 transition-all"
            onClick={() => handleConnect('martian')}
            disabled={isConnecting}
          >
            <div className="h-10 w-10 rounded-full bg-[#1F8ECD] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M64 24C41.9086 24 24 41.9086 24 64C24 86.0914 41.9086 104 64 104C86.0914 104 104 86.0914 104 64C104 41.9086 86.0914 24 64 24ZM48.7273 50.9091C50.5091 50.9091 52.3636 51.4909 53.8909 52.6545C55.4182 53.8182 56.7273 55.4909 57.4545 57.4545C58.1818 59.4182 58.3273 61.6 57.8909 63.6364C57.4545 65.7455 56.4727 67.6 55.0182 69.0545C53.5636 70.5091 51.7091 71.4909 49.6 71.9273C47.4909 72.3636 45.3818 72.2182 43.3455 71.4909C41.3818 70.7636 39.6364 69.4545 38.4727 67.9273C37.3091 66.4 36.7273 64.5455 36.7273 62.7636C36.7273 60.3273 37.6364 58.0364 39.3091 56.3636C41.0545 54.6909 43.2727 53.7818 45.7091 53.7818C46.7636 53.7818 47.7455 54.1455 48.5455 54.7273C49.3455 55.3818 49.8545 56.2545 50.0727 57.2364C50.2909 58.2182 50.1455 59.2727 49.7091 60.1455C49.2727 61.0182 48.5455 61.7455 47.6727 62.1818C46.8 62.6182 45.7455 62.7636 44.7636 62.5455C43.7818 62.3273 42.9091 61.8182 42.2545 61.0182C41.6 60.2182 41.2364 59.2364 41.2364 58.1818C41.2364 56.7273 41.8909 55.3455 43 54.4C41.6727 54.5455 40.4364 55.0545 39.4545 55.8545C38.4727 56.6545 37.7455 57.7455 37.3818 58.9818C37.0182 60.2182 37.0909 61.5273 37.5273 62.7636C37.9636 64 38.7636 65.0545 39.8545 65.8545C40.9455 66.6545 42.2545 67.0909 43.6 67.0909C44.9455 67.0909 46.2545 66.6545 47.3455 65.8545C48.4364 65.0545 49.2364 64 49.6727 62.7636C50.1091 61.5273 50.1818 60.2182 49.8182 58.9818C49.4545 57.7455 48.7273 56.6545 47.7455 55.8545C46.7636 55.0545 45.5273 54.5455 44.2 54.4C45.3091 53.5273 46.7636 50.9091 48.7273 50.9091ZM65.6364 78.9091C65.6364 80.8727 64.8364 82.7636 63.3818 84.1455C61.9273 85.6 59.9636 86.4 58.0727 86.4C56.1091 86.4 54.2182 85.6 52.8364 84.1455C51.3818 82.6909 50.5818 80.8 50.5818 78.9091H57.3455C57.3455 79.3455 57.5636 79.7818 57.8545 80.0727C58.1455 80.3636 58.5818 80.5818 59.0182 80.5818C59.4545 80.5818 59.8909 80.3636 60.1818 80.0727C60.4727 79.7818 60.6909 79.3455 60.6909 78.9091H65.6364ZM82.2909 53.7818C80.4364 53.7818 78.5818 54.3636 77.0545 55.5273C75.5273 56.6909 74.2182 58.3636 73.4909 60.3273C72.7636 62.2909 72.6182 64.4727 73.0545 66.5091C73.4909 68.6182 74.4727 70.4727 75.9273 71.9273C77.3818 73.3818 79.2364 74.3636 81.3455 74.8C83.4545 75.2364 85.5636 75.0909 87.6 74.3636C89.5636 73.6364 91.3091 72.3273 92.4727 70.8C93.6364 69.2727 94.2182 67.4182 94.2182 65.5636C94.2182 63.1273 93.3091 60.8364 91.6364 59.1636C89.8909 57.4909 87.6727 56.5818 85.2364 56.5818C84.1818 56.5818 83.2 56.9455 82.4 57.5273C81.6 58.1818 81.0909 59.0545 80.8727 60.0364C80.6545 61.0182 80.8 62.0727 81.2364 62.9455C81.6727 63.8182 82.4 64.5455 83.2727 64.9818C84.1455 65.4182 85.2 65.5636 86.1818 65.3455C87.1636 65.1273 88.0364 64.6182 88.6909 63.8182C89.3455 63.0182 89.7091 62.0364 89.7091 60.9818C89.7091 59.5273 89.0545 58.1455 87.9455 57.2C89.2727 57.3455 90.5091 57.8545 91.4909 58.6545C92.4727 59.4545 93.2 60.5455 93.5636 61.7818C93.9273 63.0182 93.8545 64.3273 93.4182 65.5636C92.9818 66.8 92.1818 67.8545 91.0909 68.6545C90 69.4545 88.6909 69.8909 87.3455 69.8909C86 69.8909 84.6909 69.4545 83.6 68.6545C82.5091 67.8545 81.7091 66.8 81.2727 65.5636C80.8364 64.3273 80.7636 63.0182 81.1273 61.7818C81.4909 60.5455 82.2182 59.4545 83.2 58.6545C84.1818 57.8545 85.4182 57.3455 86.7455 57.2C85.6364 56.3273 84.1818 53.7818 82.2909 53.7818Z" fill="white"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium">Martian</div>
              <div className="text-xs text-white/60">Connect to your Martian Wallet</div>
            </div>
          </Button>
        </div>
        <div className="px-6 pb-6 pt-2 text-center">
          {isConnecting && (
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
