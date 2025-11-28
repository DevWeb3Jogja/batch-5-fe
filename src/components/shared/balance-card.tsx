import {
  Wallet,
  TrendingUp,
  Coins,
  PiggyBank,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  amount: number;
  shares: number;
  currency: string;
  variant?: "primary" | "secondary";
  depositedValue?: number;
  yieldEarned?: number;
  yieldPercentage?: number;
  apy?: number;
  totalAssets?: number;
  totalSupply?: number;
}

export function BalanceCard({
  amount,
  currency,
  shares,
  variant = "primary",
  depositedValue,
  yieldEarned,
  yieldPercentage,
  apy,
  totalAssets,
  totalSupply,
}: BalanceCardProps) {
  const isPrimary = variant === "primary";

  const gradientClass = isPrimary
    ? "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600"
    : "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600";

  const accentColor = isPrimary ? "bg-blue-400/20" : "bg-purple-400/20";
  const borderColor = isPrimary ? "border-blue-400/30" : "border-purple-400/30";

  return (
    <div
      className={cn("relative overflow-hidden p-8 text-white", gradientClass)}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={cn(
              "rounded-xl p-5 backdrop-blur-sm border",
              accentColor,
              borderColor
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                Wallet Balance
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xl font-semibold opacity-90">
                {currency}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
              <TrendingUp className="h-3 w-3" />
              <span>Available to deposit</span>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl p-5 backdrop-blur-sm border",
              accentColor,
              borderColor
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Coins className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                Vault Shares
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {shares.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xl font-semibold opacity-90">aUSDC</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
              <TrendingUp className="h-3 w-3" />
              <span>Your vault position</span>
            </div>
          </div>
        </div>

        {shares > 0 && depositedValue !== undefined && depositedValue > 0 && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-75">Estimated Share Value</span>
              <span className="font-semibold">
                1 aUSDC ≈ {(depositedValue / shares).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        )}

        {(totalAssets !== undefined || totalSupply !== undefined) && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-75">
              Vault Statistics
            </div>
            <div className="grid grid-cols-2 gap-4">
              {totalAssets !== undefined && (
                <div>
                  <div className="text-xs opacity-75 mb-1">Total Assets</div>
                  <div className="text-lg font-bold">
                    {totalAssets.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs opacity-75">{currency}</div>
                </div>
              )}
              {totalSupply !== undefined && (
                <div>
                  <div className="text-xs opacity-75 mb-1">Total Supply</div>
                  <div className="text-lg font-bold">
                    {totalSupply.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs opacity-75">aUSDC</div>
                </div>
              )}
            </div>
            {shares > 0 && totalSupply !== undefined && totalSupply > 0 && (
              <div className="mt-3 text-xs opacity-75">
                Your ownership:{" "}
                <span className="font-semibold text-white">
                  {((shares / totalSupply) * 100).toFixed(4)}%
                </span>{" "}
                of the vault
              </div>
            )}
          </div>
        )}

        {(depositedValue !== undefined || apy !== undefined) && (
          <div className="mt-6 pt-4 border-t border-white/20 space-y-4">
            {depositedValue !== undefined && depositedValue > 0 && (
              <div
                className={cn(
                  "rounded-lg p-4 backdrop-blur-sm border",
                  accentColor,
                  borderColor
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <PiggyBank className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium opacity-90">
                      Total Deposited Value
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {depositedValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {currency}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {yieldEarned !== undefined &&
              depositedValue !== undefined &&
              depositedValue > 0 && (
                <div
                  className={cn(
                    "rounded-lg p-4 backdrop-blur-sm border",
                    accentColor,
                    borderColor
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "p-1.5 rounded-lg",
                          yieldEarned >= 0 ? "bg-green-500/30" : "bg-red-500/30"
                        )}
                      >
                        {yieldEarned >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium opacity-90">
                        Accrued Yield
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-lg font-bold",
                          yieldEarned >= 0 ? "text-green-200" : "text-red-200"
                        )}
                      >
                        {yieldEarned >= 0 ? "+" : ""}
                        {yieldEarned.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {currency}
                      </div>
                      {yieldPercentage !== undefined && (
                        <div
                          className={cn(
                            "text-xs font-semibold mt-0.5",
                            yieldEarned >= 0 ? "text-green-300" : "text-red-300"
                          )}
                        >
                          {yieldEarned >= 0 ? "+" : ""}
                          {yieldPercentage.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {apy !== undefined && (
              <div
                className={cn(
                  "rounded-lg p-4 backdrop-blur-sm border",
                  accentColor,
                  borderColor
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <Percent className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium opacity-90">
                      Current APY
                    </span>
                  </div>
                  <div className="text-lg font-bold text-green-200">
                    {apy.toFixed(2)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
