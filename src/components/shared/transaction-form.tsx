import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmountInput } from "./amount-input";
import { PercentageSelector } from "./percentage-selector";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TransactionFormProps {
  type: "deposit" | "withdraw";
  balance: number;
  onSubmit?: (amount: number) => void;
  onAmountChange?: (amount: number) => void;
  inputLabel?: string;
  buttonLabel?: string;
  preview?: React.ReactNode;
  showConversion?: boolean;
  conversionCurrency?: string;
  isLoading: boolean;
  inputPrefix?: string;
  maxShares?: number;
  value?: number;
}

export function TransactionForm({
  type,
  balance,
  onSubmit,
  onAmountChange,
  inputLabel,
  buttonLabel,
  isLoading,
  preview,
  inputPrefix = "$",
  maxShares,
  value,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const percentageBase = maxShares !== undefined ? maxShares : balance;

  const handleAmountChange = (value: number) => {
    setAmount(value);
    setPercentage((value / percentageBase) * 100);
    if (onAmountChange) {
      onAmountChange(value);
    }
  };

  const handlePercentageClick = (percent: number) => {
    setPercentage(percent);
    const calculatedAmount = (percentageBase * percent) / 100;
    setAmount(calculatedAmount);
    if (onAmountChange) {
      onAmountChange(calculatedAmount);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(amount);
    }
  };

  const defaultInputLabel =
    type === "deposit" ? "Deposit Amount" : "Withdraw Amount";
  const defaultButtonLabel = type === "deposit" ? "Deposit" : "Withdraw";

  const currentAmount = value !== undefined ? value : amount;

  return (
    <CardContent className="space-y-6 p-0">
      <AmountInput
        value={currentAmount}
        type={type}
        onChange={handleAmountChange}
        label={inputLabel || defaultInputLabel}
        prefix={inputPrefix}
      />

      <PercentageSelector
        selectedPercentage={percentage}
        onSelect={handlePercentageClick}
      />

      {preview}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className={cn("h-14 w-full text-lg font-medium", {
          "bg-blue-600 hover:bg-blue-700": type === "deposit",
          "bg-purple-600 hover:bg-purple-700": type === "withdraw",
        })}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonLabel || defaultButtonLabel}
      </Button>
    </CardContent>
  );
}
