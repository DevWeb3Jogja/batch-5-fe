import type { PropsWithChildren } from "react";
import { TabsTrigger } from "../ui/tabs";
import { ArrowDownCircle, ArrowUpCircle, Coins, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  deposit: ArrowDownCircle,
  mint: Coins,
  redeem: Wallet,
  withdraw: ArrowUpCircle,
};

export const TabTrigger = ({
  value,
  children,
}: PropsWithChildren<{ value: string }>) => {
  const Icon = iconMap[value as keyof typeof iconMap] || ArrowDownCircle;

  const getTabClasses = () => {
    switch (value) {
      case "deposit":
        return "data-[state=active]:border-blue-600 data-[state=active]:bg-blue-800/20";
      case "mint":
        return "data-[state=active]:border-green-600 data-[state=active]:bg-green-800/20";
      case "redeem":
        return "data-[state=active]:border-orange-600 data-[state=active]:bg-orange-800/20";
      case "withdraw":
        return "data-[state=active]:border-purple-600 data-[state=active]:bg-purple-800/20";
      default:
        return "data-[state=active]:border-blue-600 data-[state=active]:bg-blue-800/20";
    }
  };

  const getIconClasses = () => {
    switch (value) {
      case "deposit":
        return "text-blue-600";
      case "mint":
        return "text-green-600";
      case "redeem":
        return "text-orange-600";
      case "withdraw":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative rounded-none border-b-2 border-transparent py-4",
        "data-[state=active]:shadow-none data-[state=active]:border-b",
        "data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0",
        getTabClasses()
      )}
    >
      <Icon className={cn("mr-2 h-5 w-5", getIconClasses())} />
      <span className="text-sm font-medium text-gray-700">{children}</span>
    </TabsTrigger>
  );
};
