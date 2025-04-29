import { create } from 'zustand'
import { useCallback, useEffect, useState } from 'react'

// Simplified wallet types - removed reference to specific crypto wallets
type WalletType = 'demo' | 'sui' | 'phantom' | 'martian';

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  isModalOpen: boolean
  isWalletDialogOpen: boolean
  walletType: WalletType | null
  balance: {
    usdc: number
    receiptTokens: number  // NODOAIx Tokens - representing user's share of vault assets
  }
  connect: (walletType: WalletType) => Promise<void>
  disconnect: () => void
  openModal: () => void
  closeModal: () => void
  openWalletDialog: () => void
  closeWalletDialog: () => void
  addReceiptTokens: (amount: number) => void
}

const useWalletStore = create<WalletState>((set) => ({
  // Initial state - not connected by default
  address: null,
  isConnected: false,
  isConnecting: false,
  isModalOpen: false,
  isWalletDialogOpen: false,
  walletType: null,
  balance: {
    usdc: 0,
    receiptTokens: 0
  },
  connect: async (walletType) => {
    set({ isConnecting: true })

    try {
      // Check for wallet extensions before trying to connect
      if (walletType === 'phantom' && typeof window.phantom === 'undefined') {
        console.warn("Phantom wallet extension not detected");
        // Continue with mock data for demo purposes
      } else if (walletType === 'sui' && typeof window.suiWallet === 'undefined') {
        console.warn("Sui wallet extension not detected");
        // Continue with mock data for demo purposes
      }

      // Simulate connection delay for a more realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock wallet addresses for different wallets
      let mockAddress = "";
      switch(walletType) {
        case 'sui':
          mockAddress = '0x7d783c975da6e3b5ff8259436d4f7da675da6';
          break;
        case 'phantom':
          mockAddress = '0x8e492fd7a3c975da6e3b5ff8259436d4f7d';
          break;
        case 'martian':
          mockAddress = '0x9f723da6e3b5ff8259436d4f7da675dc975d';
          break;
        default:
          mockAddress = '0x7d783c975da6e3b5ff8259436d4f7da675da6';
      }

      set({
        address: mockAddress,
        isConnected: true,
        isConnecting: false,
        isModalOpen: false,
        walletType,
        balance: {
          usdc: 1250.45,
          receiptTokens: 0
        }
      })
    } catch (error) {
      console.error(`Failed to connect ${walletType} wallet:`, error);
      // Reset the connecting state to avoid UI being stuck
      set({ isConnecting: false });
      throw error; // Re-throw to allow component-level handling
    }
  },
  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      isModalOpen: false,
      walletType: null,
      balance: {
        usdc: 0,
        receiptTokens: 0
      }
    })
  },
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  openWalletDialog: () => set({ isWalletDialogOpen: true }),
  closeWalletDialog: () => set({ isWalletDialogOpen: false }),
  addReceiptTokens: (amount) => set((state) => ({
    balance: {
      ...state.balance,
      receiptTokens: state.balance.receiptTokens + amount
    }
  }))
}))

export const useWallet = () => {
  const {
    address,
    isConnected,
    isConnecting,
    isModalOpen,
    isWalletDialogOpen,
    walletType,
    balance,
    connect,
    disconnect,
    openModal,
    closeModal,
    openWalletDialog,
    closeWalletDialog,
    addReceiptTokens
  } = useWalletStore()

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<{
    type: 'deposit' | 'withdraw';
    amount?: string;
    vaultName?: string;
  } | null>(null);

  // Check for previously stored connection (on initial load only)
  useEffect(() => {
    // We've removed the auto-connect feature
    // Now we only connect if there's a stored wallet connection
    const storedConnection = localStorage.getItem('wallet-connected');
    if (storedConnection === 'true' && !isConnected && !isConnecting) {
      // Connect with demo wallet on initial load if previously connected
      // For testing purposes, let's disable the auto-connect for now
      // connect('demo');
    }
  }, []); // Empty dependency array to run only on mount

  // Save connection state to localStorage
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('wallet-connected', 'true')
    } else {
      localStorage.removeItem('wallet-connected')
    }
  }, [isConnected])

  // Function to open wallet modal specifically for connection
  const openConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
    // Remove auto-connect to make it user-initiated only
  }, []);

  const closeConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  // Simplified transaction signing without external wallet integration
  const signTransaction = useCallback((transactionType: 'deposit' | 'withdraw', amount?: string, vaultName?: string) => {
    setCurrentTransaction({
      type: transactionType,
      amount,
      vaultName
    });
    setIsSignatureDialogOpen(true);

    return new Promise<void>((resolve) => {
      // Complete transaction immediately
      setIsSignatureDialogOpen(false);
      setCurrentTransaction(null);
      resolve();
    });
  }, []);

  const handleSignatureComplete = useCallback(() => {
    setIsSignatureDialogOpen(false);
    setCurrentTransaction(null);
  }, []);

  // Function for deposit that includes signing
  const deposit = useCallback(async (vaultId: string, amount: number, lockupPeriod: number) => {
    if (!isConnected) {
      openConnectModal();
      return { success: false, txId: '' };
    }

    try {
      // First sign the transaction
      await signTransaction('deposit', amount.toString(), vaultId);

      // After signature, add NODOAIx Tokens
      const receiptTokenAmount = amount * 0.98;
      addReceiptTokens(receiptTokenAmount);

      // Return success
      return {
        success: true,
        txId: `tx${Math.random().toString(36).substring(2, 10)}`
      };
    } catch (error) {
      console.error("Deposit failed:", error);
      return { success: false, txId: '' };
    }
  }, [isConnected, openConnectModal, signTransaction, addReceiptTokens]);

  // Function for withdrawal that includes signing
  const withdraw = useCallback(async (vaultId: string, amount: number) => {
    if (!isConnected) {
      openConnectModal();
      return { success: false, txId: '' };
    }

    try {
      // First sign the transaction
      await signTransaction('withdraw', amount.toString(), vaultId);

      // After signature, burn NODOAIx Tokens
      const receiptTokenAmount = amount * 0.98;
      addReceiptTokens(-receiptTokenAmount);

      // Return success
      return {
        success: true,
        txId: `tx${Math.random().toString(36).substring(2, 10)}`
      };
    } catch (error) {
      console.error("Withdrawal failed:", error);
      return { success: false, txId: '' };
    }
  }, [isConnected, openConnectModal, signTransaction, addReceiptTokens]);

  return {
    address,
    isConnected,
    isConnecting,
    isModalOpen,
    isWalletDialogOpen,
    walletType,
    balance,
    connect,
    disconnect,
    openModal,
    closeModal,
    openWalletDialog,
    closeWalletDialog,
    isConnectModalOpen,
    openConnectModal,
    closeConnectModal,
    isSignatureDialogOpen,
    setIsSignatureDialogOpen,
    currentTransaction,
    handleSignatureComplete,
    signTransaction,
    deposit,
    withdraw
  }
}
