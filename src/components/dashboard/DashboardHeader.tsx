interface DashboardHeaderProps {
  totalValue: number;
  totalProfit: number;
}

export function DashboardHeader({ totalValue, totalProfit }: DashboardHeaderProps) {
  const profitPercentage = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;

  return (
    <div className="dashboard-header mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">
        Your <span className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-transparent bg-clip-text">Portfolio</span>
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center text-white/60 text-sm gap-2 sm:gap-4">
        <p>
          Current Value: <span className="font-mono font-medium text-white">${totalValue.toLocaleString()}</span>
        </p>
        {totalProfit !== 0 && (
          <div className="flex items-center">
            <span className="hidden sm:inline mx-1">•</span>
            <p className={totalProfit >= 0 ? "text-emerald" : "text-red-500"}>
              {totalProfit > 0 ? "+" : ""}{totalProfit.toLocaleString()} ({profitPercentage.toFixed(2)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
