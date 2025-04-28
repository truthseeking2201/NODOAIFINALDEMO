import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NODOAIxCardProps {
  balance: number;
  principal: number;
  fees: number;
  unlockTime: Date;
  holderCount: number;
  contractAddress: string;
  auditUrl: string;
  styles: {
    gradientBg: string;
    hoverBg: string;
    textColor: string;
    borderColor: string;
  };
  unlockProgress: number;
}

export function NODOAIxCard({
  balance,
  principal,
  fees,
  unlockTime,
  holderCount,
  contractAddress,
  auditUrl,
  styles,
  unlockProgress
}: NODOAIxCardProps) {
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const daysUntilUnlock = Math.ceil((unlockTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${styles.borderColor}`}>
      <CardHeader className="card-header">
        <CardTitle className="card-title flex items-center justify-between">
          <span>NODO AI Token</span>
          <span className={`text-sm font-medium ${styles.textColor}`}>
            ${balance.toFixed(2)}
          </span>
        </CardTitle>
        <CardDescription className="card-description">
          AI-powered governance & staking token
        </CardDescription>
      </CardHeader>
      <CardContent className="card-content pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-white/60">Principal</p>
            <p className="text-sm font-medium">${principal.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-white/60">Protocol Fees</p>
            <p className="text-sm font-medium">${fees.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/60">Unlock in {daysUntilUnlock} days</p>
            <p className="text-xs font-medium">{unlockProgress}%</p>
          </div>
          <Progress value={unlockProgress} className="h-1.5" 
            indicatorClassName={styles.gradientBg} />
        </div>
        
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Holders</span>
            <span>{holderCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Contract</span>
            <a 
              href={`https://explorer.sui.io/address/${contractAddress}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-white/80"
            >
              {formatAddress(contractAddress)}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-white/20 hover:bg-white/5"
          onClick={() => window.open(auditUrl, '_blank')}
        >
          View Security Audit
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
} 