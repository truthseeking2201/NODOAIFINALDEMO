import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Wallet } from "lucide-react";

export function ConnectWalletPrompt() {
  const { openConnectModal } = useWallet();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md mx-auto bg-black/30 border border-white/10">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-amber-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>

          <p className="text-white/60 mb-6">
            Connect your wallet to access your personalized dashboard and view your investment portfolio.
          </p>

          <Button
            onClick={openConnectModal}
            className="gradient-bg-nova text-[#0E0F11] font-medium"
            size="lg"
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>

          <div className="mt-6 grid grid-cols-3 gap-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: '1.5s'
              }}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
