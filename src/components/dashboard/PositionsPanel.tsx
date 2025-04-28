import { UserInvestment } from "@/types/vault";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, Wallet } from "lucide-react";
import { useState } from "react";
import { DepositDrawer } from "@/components/vault/DepositDrawer";

interface PositionsPanelProps {
  positions: UserInvestment[];
  isLoading: boolean;
  onWithdraw: (investment: UserInvestment) => void;
}

export function PositionsPanel({ positions, isLoading, onWithdraw }: PositionsPanelProps) {
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);

  if (isLoading) {
    return <PositionsSkeletonLoader />;
  }

  if (!positions.length) {
    return <EmptyPositionsState />;
  }

  const handleAddFunds = (vaultId: string) => {
    setSelectedVaultId(vaultId);
    setIsDepositDrawerOpen(true);
  };

  return (
    <>
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Positions</CardTitle>
          <Button variant="outline" size="sm">
            <ArrowUpRight size={14} className="mr-1" /> New Deposit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {positions.map(position => (
              <PositionCard
                key={position.vaultId}
                position={position}
                onWithdraw={onWithdraw}
                onAddFunds={handleAddFunds}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedVaultId && (
        <DepositDrawer
          open={isDepositDrawerOpen}
          onClose={() => setIsDepositDrawerOpen(false)}
          vault={{
            id: selectedVaultId,
            name: getVaultType(selectedVaultId).name,
            type: getVaultType(selectedVaultId).type,
            apr: positions.find(p => p.vaultId === selectedVaultId)?.currentApr || 0,
            apy: 0, // Calculate as needed
            tvl: 0,
            lockupPeriods: [{ days: 30, aprBoost: 0 }],
            description: `${getVaultType(selectedVaultId).name} strategy`,
            riskLevel: getRiskLevel(selectedVaultId),
            strategy: `Automated yield optimization for ${getVaultType(selectedVaultId).name}`,
            performance: { daily: [], weekly: [], monthly: [] }
          }}
        />
      )}
    </>
  );
}

function PositionCard({
  position,
  onWithdraw,
  onAddFunds
}: {
  position: UserInvestment;
  onWithdraw: (investment: UserInvestment) => void;
  onAddFunds: (vaultId: string) => void;
}) {
  const vaultType = getVaultType(position.vaultId);
  const isLocked = !position.isWithdrawable;

  return (
    <div className="position-card bg-black/40 border border-white/10 rounded-xl p-4">
      <div className="position-info flex items-center mb-4">
        <div className={`vault-badge w-10 h-10 rounded-lg mr-3 flex items-center justify-center ${getVaultBadgeClass(position.vaultId)}`}>
          {getVaultIcon(position.vaultId)}
        </div>
        <div>
          <h4 className={`vault-name text-base font-medium ${vaultType.className}`}>{vaultType.name}</h4>
          <div className="vault-lock-status">
            {isLocked ? (
              <div className="flex items-center text-xs text-white/60">
                <Clock size={12} className="mr-1" />
                <span>Unlocks in {getRemainingDays(position.unlockDate)} days</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-emerald">
                <span>Unlocked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="position-details grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <div className="detail-row">
          <span className="detail-label text-xs text-white/60">Capital Invested</span>
          <span className="detail-value text-sm font-mono font-medium">${position.principal.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label text-xs text-white/60">APR (AVG)</span>
          <span className="detail-value text-sm font-mono font-medium text-nova">{position.currentApr?.toFixed(1) || calculateEstimatedApr(position.vaultId).toFixed(1)}%</span>
        </div>
        <div className="detail-row">
          <span className="detail-label text-xs text-white/60">Current Value</span>
          <span className="detail-value text-sm font-mono font-medium">${position.currentValue.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label text-xs text-white/60">Profit</span>
          <span className={`detail-value text-sm font-mono font-medium ${position.profit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
            {position.profit >= 0 ? '+' : ''}${position.profit.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="position-actions flex gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onAddFunds(position.vaultId)}>
          <Wallet size={14} className="mr-1" /> Add Funds
        </Button>
        <Button
          variant="default"
          size="sm"
          className={`w-full ${getVaultButtonClass(position.vaultId)}`}
          disabled={isLocked}
          onClick={() => onWithdraw(position)}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}

function PositionsSkeletonLoader() {
  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="h-5 w-32 bg-white/10 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg mr-3 bg-white/10 animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="mb-2">
                    <div className="h-3 w-20 bg-white/10 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="h-9 w-full bg-white/10 rounded animate-pulse"></div>
                <div className="h-9 w-full bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyPositionsState() {
  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Active Positions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <ArrowUpRight size={24} className="text-white/40" />
        </div>
        <h3 className="text-lg font-medium mb-2">No active positions</h3>
        <p className="text-white/60 max-w-md mb-6">
          Start building your yield portfolio by depositing into one of our AI-optimized vaults.
        </p>
        <Button variant="default" className="gradient-bg-nova">Start Earning Yield</Button>
      </CardContent>
    </Card>
  );
}

// Helper functions
function getVaultType(vaultId: string) {
  if (vaultId.includes('deep')) {
    return {
      name: 'Aggressive Yield Vault',
      className: 'text-nova',
      type: 'nova' as const
    };
  }
  if (vaultId.includes('cetus')) {
    return {
      name: 'Balanced Yield Vault',
      className: 'text-orion',
      type: 'orion' as const
    };
  }
  return {
    name: 'Conservative Yield Vault',
    className: 'text-emerald',
    type: 'emerald' as const
  };
}

function getRiskLevel(vaultId: string): 'low' | 'medium' | 'high' {
  if (vaultId.includes('deep')) return 'high';
  if (vaultId.includes('cetus')) return 'medium';
  return 'low';
}

function calculateEstimatedApr(vaultId: string): number {
  if (vaultId.includes('deep')) return 21.5;
  if (vaultId.includes('cetus')) return 18.9;
  return 15.2;
}

function getRemainingDays(unlockDate: string): number {
  const lockDate = new Date(unlockDate);
  const now = new Date();
  const diffTime = lockDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function getVaultBadgeClass(vaultId: string): string {
  if (vaultId.includes('deep')) return 'bg-nova/20 border border-nova/30';
  if (vaultId.includes('cetus')) return 'bg-orion/20 border border-orion/30';
  return 'bg-emerald/20 border border-emerald/30';
}

function getVaultButtonClass(vaultId: string): string {
  if (vaultId.includes('deep')) return 'gradient-bg-nova text-[#0E0F11]';
  if (vaultId.includes('cetus')) return 'gradient-bg-orion text-[#0E0F11]';
  return 'gradient-bg-emerald text-[#0E0F11]';
}

function getVaultIcon(vaultId: string): JSX.Element {
  if (vaultId.includes('deep')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9L9 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9L15 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (vaultId.includes('cetus')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 14L12 10L16 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
