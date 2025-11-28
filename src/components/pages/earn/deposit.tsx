import { BalanceCard } from "@/components/shared/balance-card";
import { TransactionForm } from "@/components/shared/transaction-form";
import { Preview } from "@/components/shared/preview";
import { USDC_MOCK_ADDRESS, VAULT_ADDRESS } from "@/lib/wagmi-config";
import {
  erc4626Abi,
  erc20Abi,
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

export const Deposit = () => {
  const accountConnection = useConnection();
  const [depositAmount, setDepositAmount] = useState(0);
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
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

  // Get the current value of user's shares in underlying assets
  const { data: convertedAssets, refetch: refetchConvertedAssets } =
    useReadContract({
      abi: erc4626Abi,
      address: VAULT_ADDRESS,
      functionName: "convertToAssets",
      args: [userVaultBalance || 0n],
    });

  // Get total vault assets for APY calculation (simplified)
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
    writeContract: approve,
    isPending: isApproving,
    data: approveHashData,
    reset: resetApprove,
  } = useWriteContract();

  const {
    writeContract: deposit,
    isPending: isDepositing,
    isSuccess: isDepositSuccess,
    reset: resetDeposit,
  } = useWriteContract();

  // Wait for approve transaction
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Preview deposit - calculate shares user will receive
  const { data: previewShares, isLoading: isLoadingPreview } = useReadContract({
    abi: erc4626Abi,
    address: VAULT_ADDRESS,
    functionName: "previewDeposit",
    args: [parseUnits(depositAmount.toString(), 6)],
  });

  // Calculate exchange rate
  const exchangeRate =
    previewShares && depositAmount > 0
      ? Number(formatUnits(previewShares, 6)) / depositAmount
      : undefined;

  // Set approve hash when approve transaction is submitted
  useEffect(() => {
    if (approveHashData) {
      setApproveHash(approveHashData);
    }
  }, [approveHashData]);

  // Auto-deposit after approval succeeds
  useEffect(() => {
    if (isApproveSuccess && depositAmount > 0) {
      const amountInWei = parseUnits(depositAmount.toString(), 6);
      deposit({
        address: VAULT_ADDRESS,
        abi: erc4626Abi,
        functionName: "deposit",
        args: [amountInWei, accountConnection.address as Address],
      });
      setApproveHash(undefined);
    }
  }, [isApproveSuccess, depositAmount, deposit, accountConnection.address]);

  // Refetch balances after successful deposit
  useEffect(() => {
    if (isDepositSuccess) {
      refetchWalletBalance();
      refetchVaultBalance();
      refetchConvertedAssets();
      refetchTotalAssets();
      refetchTotalSupply();

      // Store initial deposit for yield calculation (simplified - in production use proper tracking)
      if (initialDeposit === null && convertedAssets) {
        setInitialDeposit(Number(formatUnits(convertedAssets, 6)));
      }

      setDepositAmount(0);
      resetApprove();
      resetDeposit();
    }
  }, [
    isDepositSuccess,
    refetchWalletBalance,
    refetchVaultBalance,
    refetchConvertedAssets,
    refetchTotalAssets,
    refetchTotalSupply,
    resetApprove,
    resetDeposit,
    initialDeposit,
    convertedAssets,
  ]);

  const handleDeposit = (amount: number) => {
    if (!accountConnection.address || amount <= 0) return;

    const amountInWei = parseUnits(amount.toString(), 6);

    // First approve the vault to spend tokens
    approve({
      address: USDC_MOCK_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, amountInWei],
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

  // Calculate yield (simplified - current value minus initial deposit)
  const yieldEarned =
    initialDeposit !== null && depositedValue > 0
      ? depositedValue - initialDeposit
      : undefined;

  const yieldPercentage =
    yieldEarned !== undefined && initialDeposit !== null && initialDeposit > 0
      ? (yieldEarned / initialDeposit) * 100
      : undefined;

  // Calculate APY (simplified - based on share value vs assets)
  // In production, this should be calculated based on historical data
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
        variant="primary"
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
          type="deposit"
          balance={walletBalance}
          onSubmit={handleDeposit}
          onAmountChange={setDepositAmount}
          showConversion={true}
          conversionCurrency="aUSDC"
          isLoading={isApproving || isDepositing}
          preview={
            depositAmount > 0 && (
              <Preview
                type="deposit"
                inputAmount={depositAmount}
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
