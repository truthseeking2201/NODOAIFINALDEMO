import { create } from 'zustand'
import { useCallback, useEffect, useState } from 'react'

type WalletType = 'sui' | 'phantom' | 'martian';

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
  // Set default to connected for demo purposes
  address: '0x7d783c975da6e3b5ff8259436d4f7da675da6',
  isConnected: true,
  isConnecting: false,
  isModalOpen: false,
  isWalletDialogOpen: false,
  walletType: 'sui',
  balance: {
    usdc: 1250.45,
    receiptTokens: 125.2
  }, // Initialize with demo values
  connect: async (walletType) => {
    set({ isConnecting: true })
    // Simulate connecting
    await new Promise(resolve => setTimeout(resolve, 1000))
    set({
      address: '0x7d783c975da6e3b5ff8259436d4f7da675da6',
      isConnected: true,
      isConnecting: false,
      isModalOpen: false,
      walletType,
      balance: {
        usdc: 1250.45,
        receiptTokens: 0
      }
    })
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

  // Automatically reconnect if previously connected
  useEffect(() => {
    const hasConnectedBefore = localStorage.getItem('wallet-connected') === 'true'
    const savedWalletType = localStorage.getItem('wallet-type') as WalletType | null

    if (hasConnectedBefore && !isConnected && !isConnecting && savedWalletType) {
      connect(savedWalletType)
    }
  }, [connect, isConnected, isConnecting])

  // Save connection state to localStorage
  useEffect(() => {
    if (isConnected && walletType) {
      localStorage.setItem('wallet-connected', 'true')
      localStorage.setItem('wallet-type', walletType)
    } else {
      localStorage.removeItem('wallet-connected')
      localStorage.removeItem('wallet-type')
    }
  }, [isConnected, walletType])

  // Function to open wallet modal specifically for connection
  const openConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
  }, []);

  const closeConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  // Function to handle transaction signing
  const signTransaction = useCallback((transactionType: 'deposit' | 'withdraw', amount?: string, vaultName?: string) => {
    setCurrentTransaction({
      type: transactionType,
      amount,
      vaultName
    });
    setIsSignatureDialogOpen(true);

    return new Promise<void>((resolve) => {
      // Add a function to window to be called when signature is complete
      window.signatureComplete = () => {
        setIsSignatureDialogOpen(false);
        setCurrentTransaction(null);
        resolve();
      };

      // Add an automatic timeout to resolve the promise after 10 seconds
      // This prevents the UI from getting stuck if there's an issue
      setTimeout(() => {
        if (window.signatureComplete) {
          window.signatureComplete();
        }
      }, 10000);
    });
  }, []);

  const handleSignatureComplete = useCallback(() => {
    if (window.signatureComplete) {
      window.signatureComplete();
    }
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
      // NODOAIx Tokens represent the user's share of the vault's assets
      // They are non-transferable, yield interest over time, and automatically burn upon withdrawal
      const receiptTokenAmount = amount * 0.98; // 98% of deposit amount converted to NODOAIx Tokens
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
      // NODOAIx Tokens automatically burn upon withdrawal, converting back to USDC
      // with accrued interest based on lockup period and vault performance
      const receiptTokenAmount = amount * 0.98; // 98% of withdrawal amount in NODOAIx Tokens
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

// Add signatureComplete function to window type
declare global {
  interface Window {
    signatureComplete?: () => void;
    updateWalletBalance?: () => void;
  }
}
