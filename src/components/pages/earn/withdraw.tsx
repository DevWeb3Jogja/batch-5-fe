import { BalanceCard } from "@/components/shared/balance-card";
import { TransactionForm } from "@/components/shared/transaction-form";
import { Preview } from "@/components/shared/preview";
import { USDC_MOCK_ADDRESS, VAULT_ADDRESS } from "@/lib/constants";
import {
  erc20Abi,
  erc4626Abi,
  formatUnits,
  parseUnits,
  type Address,
} from "viem";
import {
  useConnection,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useState } from "react";

export const Withdraw = () => {
  const accountConnection = useConnection();
  const [withdrawAssets, setWithdrawAssets] = useState(0);
  const [initialDeposit, setInitialDeposit] = useState<number | null>(null);

  const { data: userWalletBalance, refetch: refetchWalletBalance } =
    useReadContract({
      abi: erc20Abi,
      address: USDC_MOCK_ADDRESS,
      functionName: "balanceOf",
      args: [accountConnection.address as Address],
    });

  const { data: userVaultBalance, refetch: refetchVaultBalance } =
    useReadContract({
      abi: erc4626Abi,
      address: VAULT_ADDRESS,
      functionName: "balanceOf",
      args: [accountConnection.address as Address],
    });

  const { data: convertedAssets, refetch: refetchConvertedAssets } =
    useReadContract({
      abi: erc4626Abi,
      address: VAULT_ADDRESS,
      functionName: "convertToAssets",
      args: [userVaultBalance || 0n],
    });

  const { data: totalAssets, refetch: refetchTotalAssets } = useReadContract({
    abi: erc4626Abi,
    address: VAULT_ADDRESS,
    functionName: "totalAssets",
  });

  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    abi: erc4626Abi,
    address: VAULT_ADDRESS,
    functionName: "totalSupply",
  });

  const {
    writeContract: withdraw,
    isPending: isWithdrawing,
    data: withdrawHash,
    reset: resetWithdraw,
  } = useWriteContract();

  const { isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const { data: previewShares, isLoading: isLoadingPreview } = useReadContract({
    abi: erc4626Abi,
    address: VAULT_ADDRESS,
    functionName: "previewWithdraw",
    args: [parseUnits(withdrawAssets.toString(), 6)],
  });

  const exchangeRate =
    previewShares && withdrawAssets > 0
      ? Number(formatUnits(previewShares, 6)) / withdrawAssets
      : undefined;

  useEffect(() => {
    if (isWithdrawSuccess) {
      refetchWalletBalance();
      refetchVaultBalance();
      refetchConvertedAssets();
      refetchTotalAssets();
      refetchTotalSupply();
      setWithdrawAssets(0);
      resetWithdraw();
    }
  }, [
    isWithdrawSuccess,
    refetchWalletBalance,
    refetchVaultBalance,
    refetchConvertedAssets,
    refetchTotalAssets,
    refetchTotalSupply,
    resetWithdraw,
  ]);

  useEffect(() => {
    if (
      initialDeposit === null &&
      convertedAssets &&
      Number(convertedAssets) > 0
    ) {
      setInitialDeposit(Number(formatUnits(convertedAssets, 6)));
    }
  }, [convertedAssets, initialDeposit]);

  const handleWithdraw = (assets: number) => {
    if (!accountConnection.address || assets <= 0) return;

    const assetsInWei = parseUnits(assets.toString(), 6);

    withdraw({
      address: VAULT_ADDRESS,
      abi: erc4626Abi,
      functionName: "withdraw",
      args: [
        assetsInWei,
        accountConnection.address as Address,
        accountConnection.address as Address,
      ],
    });
  };

  const walletBalance = userWalletBalance
    ? Number(formatUnits(userWalletBalance, 6))
    : 0;
  const vaultShares = userVaultBalance
    ? Number(formatUnits(userVaultBalance, 6))
    : 0;
  const depositedValue = convertedAssets
    ? Number(formatUnits(convertedAssets, 6))
    : 0;

  const yieldEarned =
    initialDeposit !== null && depositedValue > 0
      ? depositedValue - initialDeposit
      : undefined;

  const yieldPercentage =
    yieldEarned !== undefined && initialDeposit !== null && initialDeposit > 0
      ? (yieldEarned / initialDeposit) * 100
      : undefined;

  const apy =
    totalAssets && totalSupply && Number(totalSupply) > 0
      ? (Number(formatUnits(totalAssets, 6)) /
          Number(formatUnits(totalSupply, 6)) -
          1) *
        100
      : undefined;

  return (
    <>
      <BalanceCard
        amount={walletBalance}
        currency="USDC"
        shares={vaultShares}
        variant="secondary"
        depositedValue={depositedValue}
        yieldEarned={yieldEarned}
        yieldPercentage={yieldPercentage}
        apy={apy}
        totalAssets={
          totalAssets ? Number(formatUnits(totalAssets, 6)) : undefined
        }
        totalSupply={
          totalSupply ? Number(formatUnits(totalSupply, 6)) : undefined
        }
      />
      <div className="p-8">
        <TransactionForm
          type="withdraw"
          balance={vaultShares}
          onSubmit={handleWithdraw}
          onAmountChange={setWithdrawAssets}
          inputLabel="Assets to Withdraw"
          buttonLabel="Withdraw Assets"
          showConversion={true}
          conversionCurrency="aUSDC"
          isLoading={isWithdrawing}
          value={withdrawAssets}
          preview={
            withdrawAssets > 0 && (
              <Preview
                type="withdraw"
                inputAmount={withdrawAssets}
                outputAmount={previewShares}
                inputCurrency="USDC"
                outputCurrency="aUSDC"
                isLoading={isLoadingPreview}
                exchangeRate={exchangeRate}
              />
            )
          }
        />
      </div>
    </>
  );
};
