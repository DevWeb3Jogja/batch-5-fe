import { ArrowRight, Info } from "lucide-react";
import { formatUnits } from "viem";

interface PreviewProps {
  type: "deposit" | "mint" | "redeem" | "withdraw";
  inputAmount: number;
  outputAmount?: bigint;
  inputCurrency: string;
  outputCurrency: string;
  isLoading?: boolean;
  exchangeRate?: number;
}

export function Preview({
  type,
  inputAmount,
  outputAmount,
  inputCurrency,
  outputCurrency,
  isLoading = false,
  exchangeRate,
}: PreviewProps) {
  const getTitle = () => {
    switch (type) {
      case "deposit":
        return "You will receive";
      case "mint":
        return "You will pay";
      case "redeem":
        return "You will receive";
      case "withdraw":
        return "You will burn";
      default:
        return "Preview";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "deposit":
        return "Deposit assets to receive shares";
      case "mint":
        return "Mint exact shares by depositing assets";
      case "redeem":
        return "Redeem shares to receive assets";
      case "withdraw":
        return "Withdraw exact assets by burning shares";
      default:
        return "";
    }
  };

  const formattedOutput = outputAmount
    ? Number(formatUnits(outputAmount, 6)).toFixed(6)
    : "0.000000";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Info className="h-4 w-4" />
        <span className="font-medium">{getDescription()}</span>
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              {type === "deposit" || type === "mint" ? "Input" : "Burn"}
            </div>
            <div className="font-semibold text-lg">
              {inputAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">{inputCurrency}</div>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{getTitle()}</div>
            <div className="font-semibold text-lg text-blue-600">
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                formattedOutput
              )}
            </div>
            <div className="text-xs text-gray-600">{outputCurrency}</div>
          </div>
        </div>
      </div>

      {exchangeRate && (
        <div className="flex items-center justify-between text-xs text-gray-600 px-2">
          <span>Exchange Rate</span>
          <span className="font-medium">
            1 {inputCurrency} = {exchangeRate.toFixed(6)} {outputCurrency}
          </span>
        </div>
      )}

      <div className="text-xs text-gray-500 px-2">
        {type === "deposit" && (
          <p>
            💡 Deposit converts your assets into vault shares at the current
            exchange rate.
          </p>
        )}
        {type === "mint" && (
          <p>
            💡 Mint allows you to specify exact shares to receive. The required
            assets will be calculated.
          </p>
        )}
        {type === "redeem" && (
          <p>
            💡 Redeem burns your shares to receive the underlying assets at the
            current rate.
          </p>
        )}
        {type === "withdraw" && (
          <p>
            💡 Withdraw allows you to specify exact assets to receive. The
            required shares will be calculated.
          </p>
        )}
      </div>
    </div>
  );
}
