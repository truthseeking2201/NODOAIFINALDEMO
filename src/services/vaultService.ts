import { VaultData, UserInvestment, TransactionHistory } from "@/types/vault";
import { Vault } from "@/types";

// Mock data for the vaults
const mockVaults: VaultData[] = [
  {
    id: "sui-usdc",
    name: "SUI-USDC",
    type: "emerald",
    tvl: 3000000,
    apr: 12.5,
    apy: 13.8,
    description: "A low-risk vault utilizing the SUI ↔ USDC trading pair with relatively low price volatility and impermanent loss risk.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.2 },
      { days: 90, aprBoost: 2.5 }
    ],
    riskLevel: "low",
    strategy: "Optimized position management in the SUI-USDC concentrated liquidity pool, aiming to outperform static LP by ≥3%.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 4) + 1) * 3 + i / 10
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 2) + 1) * 4 + i / 6
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 1) * 5 + i
      }))
    }
  },
  {
    id: "cetus-sui",
    name: "CETUS-SUI",
    type: "orion",
    tvl: 2100000,
    apr: 18.7,
    apy: 20.4,
    description: "A moderate-risk vault focusing on the CETUS ↔ SUI trading pair, balancing yield potential with managed volatility.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.7 },
      { days: 90, aprBoost: 3.5 }
    ],
    riskLevel: "medium",
    strategy: "Active position management in the CETUS-SUI concentrated liquidity pool, optimizing for fee capture while mitigating impermanent loss.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 5) + 0.5) * 1.5 + i / 15
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 3) + 0.5) * 2 + i / 6
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 0.5) * 3 + i / 2
      }))
    }
  },
  {
    id: "deep-sui",
    name: "DEEP-SUI",
    type: "nova",
    tvl: 1250000,
    apr: 24.8,
    apy: 27.9,
    description: "A high-risk, high-reward vault leveraging the DEEP ↔ SUI trading pair in high-spread, low-liquidity conditions.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 2.5 },
      { days: 90, aprBoost: 5.0 }
    ],
    riskLevel: "high",
    strategy: "Aggressive position management in the DEEP-SUI concentrated liquidity pool, maximizing yield capture in volatile market conditions.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 3) + 1.2) * 4 + i / 8
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 1.5) + 1.2) * 5 + i / 1.5
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 1.2) * 7 + i * 1.2
      }))
    }
  }
];

// Mock user investments - Remove NODOAIx investment
const mockUserInvestments: UserInvestment[] = [
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
const mockTransactions: TransactionHistory[] = [
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

export class VaultService {
  private vaults: Vault[] = [
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

  // Use the shared mockTransactions for consistency between Vault Catalog and Dashboard
  private sharedTransactionHistory: TransactionHistory[] = mockTransactions;

  // Get all vaults
  async getVaults(): Promise<Vault[]> {
    try {
      // For demonstration purposes:
      // Return actual vaults (normal operation)
      return Promise.resolve(this.vaults);

      // IMPORTANT: The line below is deliberately placed after a return statement
      // to ensure it never executes. To test the error UI, move this line ABOVE
      // the return statement and uncomment it.
      // throw new Error("API connection error");
    } catch (error) {
      console.error("Error fetching vaults:", error);
      // In a real application, you might want to propagate the error
      // but for this demo, we'll fall back to returning vaults
      return Promise.resolve(this.vaults);
    }
  }

  // Get a specific vault by ID
  async getVaultById(id: string): Promise<Vault | undefined> {
    const vault = this.vaults.find(v => v.id === id);
    return Promise.resolve(vault);
  }

  // Get user investments
  async getUserInvestments(): Promise<UserInvestment[]> {
    // In a real app, this would filter by the connected user's address
    return Promise.resolve(mockUserInvestments);
  }

  // Get transaction history for a specific vault
  async getTransactionHistory(vaultId?: string): Promise<TransactionHistory[]> {
    if (!vaultId) {
      return Promise.resolve(this.sharedTransactionHistory);
    }

    const filteredTransactions = this.sharedTransactionHistory.filter(tx => tx.vaultId === vaultId);
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

    return Promise.resolve(transaction);
  }
}

export const vaultService = new VaultService();
