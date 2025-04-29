import { VaultData, UserInvestment, TransactionHistory } from "@/types/vault";
import { Vault } from "@/types";

// Memoized mock data - only create these once
const createMockVaults = (): Vault[] => {
  const vaults = [
    {
      id: 'deep-sui',
      name: 'DEEP-SUI',
      tvl: 1250000,
      apr: 24.8,
      riskLevel: 'High',
      strategy: 'Aggressive position management in the DEEP-SUI concentrated liquidity pool, maximizing yield capture in volatile market conditions.',
      tokens: ['DEEP', 'SUI'],
      description: 'A high-risk, high-reward vault leveraging the DEEP ↔ SUI trading pair in high-spread, low-liquidity conditions.',
      performance: {
        day: 0.08,
        week: 0.54,
        month: 2.1,
        allTime: 27.9
      }
    },
    {
      id: 'cetus-sui',
      name: 'CETUS-SUI',
      tvl: 2100000,
      apr: 18.7,
      riskLevel: 'Medium',
      strategy: 'Active position management in the CETUS-SUI concentrated liquidity pool, optimizing for fee capture while mitigating impermanent loss.',
      tokens: ['CETUS', 'SUI'],
      description: 'A moderate-risk vault focusing on the CETUS ↔ SUI trading pair, balancing yield potential with managed volatility.',
      performance: {
        day: 0.05,
        week: 0.38,
        month: 1.6,
        allTime: 20.4
      }
    },
    {
      id: 'sui-usdc',
      name: 'SUI-USDC',
      tvl: 3000000,
      apr: 12.5,
      riskLevel: 'Low',
      strategy: 'Optimized position management in the SUI-USDC concentrated liquidity pool, aiming to outperform static LP by ≥3%.',
      tokens: ['SUI', 'USDC'],
      description: 'A low-risk vault utilizing the SUI ↔ USDC trading pair with relatively low price volatility and impermanent loss risk.',
      performance: {
        day: 0.03,
        week: 0.25,
        month: 1.0,
        allTime: 13.8
      }
    }
  ];
  return vaults;
};

// Mock user investments - Remove NODOAIx investment
const createMockUserInvestments = (): UserInvestment[] => [
  {
    vaultId: "deep-sui",
    principal: 500,
    shares: 48.25,
    depositDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    lockupPeriod: 60,
    unlockDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    currentValue: 536.50,
    profit: 36.50,
    isWithdrawable: false,
    currentApr: 24.8
  },
  {
    vaultId: "cetus-sui",
    principal: 750,
    shares: 73.12,
    depositDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lockupPeriod: 30,
    unlockDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    currentValue: 771.25,
    profit: 21.25,
    isWithdrawable: true,
    currentApr: 18.7
  }
];

// Mock transaction history - Enhanced with more recent transactions for better demo
const createMockTransactions = (): TransactionHistory[] => [
  // Recent transactions (matching those in EnhancedActivitySection)
  {
    id: "user-1",
    type: "deposit",
    amount: 5000,
    vaultId: "deep-sui",
    vaultName: "DEEP-SUI",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-2",
    type: "deposit",
    amount: 2500,
    vaultId: "cetus-sui",
    vaultName: "CETUS-SUI",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-3",
    type: "withdraw",
    amount: 1200,
    vaultId: "sui-usdc",
    vaultName: "SUI-USDC",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-4",
    type: "deposit",
    amount: 3000,
    vaultId: "sui-usdc",
    vaultName: "SUI-USDC",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-5",
    type: "deposit",
    amount: 8000,
    vaultId: "deep-eth",
    vaultName: "DEEP-ETH",
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-6",
    type: "deposit",
    amount: 3700,
    vaultId: "cetus-eth",
    vaultName: "CETUS-ETH",
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-7",
    type: "withdraw",
    amount: 2200,
    vaultId: "deep-eth",
    vaultName: "DEEP-ETH",
    timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "user-8",
    type: "deposit",
    amount: 4500,
    vaultId: "deep-sui",
    vaultName: "DEEP-SUI",
    timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  // Older transactions
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    vaultId: "deep-sui",
    vaultName: "DEEP-SUI",
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx2",
    type: "deposit",
    amount: 750,
    vaultId: "cetus-sui",
    vaultName: "CETUS-SUI",
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx3",
    type: "withdraw",
    amount: 250,
    vaultId: "sui-usdc",
    vaultName: "SUI-USDC",
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  }
];

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: Date;
  vaultName: string;
}

// Cache for API responses
const cache = {
  vaults: null as Vault[] | null,
  investments: null as UserInvestment[] | null,
  transactions: null as TransactionHistory[] | null
};

export class VaultService {
  // Initialize with memoized data
  private vaults: Vault[] = createMockVaults();
  private userInvestments: UserInvestment[] = createMockUserInvestments();
  private sharedTransactionHistory: TransactionHistory[] = createMockTransactions();

  // Get all vaults with caching
  async getVaults(): Promise<Vault[]> {
    // Use cached data if available
    if (cache.vaults) {
      return Promise.resolve(cache.vaults);
    }

    // Otherwise, return data immediately without delay
    cache.vaults = this.vaults;
    return Promise.resolve(this.vaults);
  }

  // Get a specific vault by ID with caching
  async getVaultById(id: string): Promise<Vault | undefined> {
    // Check if we have cached vaults
    if (cache.vaults) {
      return Promise.resolve(cache.vaults.find(v => v.id === id));
    }

    // Otherwise get from the vaults list without delay
    const vault = this.vaults.find(v => v.id === id);
    return Promise.resolve(vault);
  }

  // Get user investments with caching
  async getUserInvestments(): Promise<UserInvestment[]> {
    // Reset userInvestments to default mock data
    this.userInvestments = createMockUserInvestments();

    if (cache.investments) {
      return Promise.resolve(cache.investments);
    }

    cache.investments = this.userInvestments;
    return Promise.resolve(this.userInvestments);
  }

  // Get transaction history with caching
  async getTransactionHistory(vaultId?: string): Promise<TransactionHistory[]> {
    // Reset transaction history to default mock data
    const mockTransactions = createMockTransactions();
    this.sharedTransactionHistory = mockTransactions;

    // Always return mock transactions, bypassing the cache for now
    // This guarantees we'll see the transactions
    if (!vaultId) {
      return Promise.resolve(mockTransactions);
    }

    const filteredTransactions = mockTransactions.filter(tx => tx.vaultId === vaultId);
    return Promise.resolve(filteredTransactions);
  }

  // Deposit to a vault
  async depositToVault(vaultId: string, amount: number): Promise<Transaction> {
    const vault = this.vaults.find(v => v.id === vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    // Generate unique transaction ID
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Create transaction for legacy API
    const transaction: Transaction = {
      id: txId,
      type: 'deposit',
      amount,
      timestamp: now,
      vaultName: vault.name
    };

    // Also create a TransactionHistory record for the shared history
    const txHistory: TransactionHistory = {
      id: txId,
      type: 'deposit',
      amount,
      vaultId: vaultId,
      vaultName: vault.name,
      timestamp: now.toISOString(),
      status: 'completed'
    };

    // Add to shared transaction history
    this.sharedTransactionHistory.unshift(txHistory);

    // Update cached transactions
    if (cache.transactions) {
      cache.transactions.unshift(txHistory);
    }

    // Update TVL
    vault.tvl += amount;

    return Promise.resolve(transaction);
  }

  // Withdraw method compatible with the WithdrawModal component
  async withdraw(investmentId: string, amount: number): Promise<Transaction> {
    // For NODOAIx tokens, use the redeemNODOAIxTokens method
    if (investmentId === 'nodoaix-tokens') {
      return this.redeemNODOAIxTokens(amount);
    }

    // For other vaults, use the withdrawFromVault method
    return this.withdrawFromVault(investmentId, amount);
  }

  // Withdraw from a vault
  async withdrawFromVault(vaultId: string, amount: number): Promise<Transaction> {
    const vault = this.vaults.find(v => v.id === vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    if (amount > vault.tvl) {
      throw new Error('Insufficient funds in vault');
    }

    // Generate unique transaction ID
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Create transaction for legacy API
    const transaction: Transaction = {
      id: txId,
      type: 'withdraw',
      amount,
      timestamp: now,
      vaultName: vault.name
    };

    // Also create a TransactionHistory record for the shared history
    const txHistory: TransactionHistory = {
      id: txId,
      type: 'withdraw',
      amount,
      vaultId: vaultId,
      vaultName: vault.name,
      timestamp: now.toISOString(),
      status: 'completed'
    };

    // Add to shared transaction history
    this.sharedTransactionHistory.unshift(txHistory);

    // Update cached transactions
    if (cache.transactions) {
      cache.transactions.unshift(txHistory);
    }

    // Update TVL
    vault.tvl -= amount;

    return Promise.resolve(transaction);
  }

  // Redeem NODOAIx tokens
  async redeemNODOAIxTokens(amount: number): Promise<Transaction> {
    // Generate unique transaction ID
    const txId = `tx-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Create transaction for legacy API
    const transaction: Transaction = {
      id: txId,
      type: 'withdraw',
      amount,
      timestamp: now,
      vaultName: 'NODOAIx Tokens'
    };

    // Also create a TransactionHistory record for the shared history
    const txHistory: TransactionHistory = {
      id: txId,
      type: 'withdraw',
      amount,
      vaultId: 'nodoaix-tokens',
      vaultName: 'NODOAIx Tokens',
      timestamp: now.toISOString(),
      status: 'completed'
    };

    // Add to shared transaction history
    this.sharedTransactionHistory.unshift(txHistory);

    // Update cached transactions
    if (cache.transactions) {
      cache.transactions.unshift(txHistory);
    }

    return Promise.resolve(transaction);
  }

  // Clear cache - useful for testing or when data becomes stale
  clearCache() {
    cache.vaults = null;
    cache.investments = null;
    cache.transactions = null;
  }
}

// Create a singleton instance
export const vaultService = new VaultService();
