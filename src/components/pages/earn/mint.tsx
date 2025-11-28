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

export const Mint = () => {
  const accountConnection = useConnection();
  const [mintShares, setMintShares] = useState(0);
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
    writeContract: approve,
    isPending: isApproving,
    data: approveHashData,
    reset: resetApprove,
  } = useWriteContract();

  const {
    writeContract: mint,
    isPending: isMinting,
    isSuccess: isMintSuccess,
    reset: resetMint,
  } = useWriteContract();

  // Wait for approve transaction
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Preview mint - calculate assets needed to mint exact shares
  const { data: previewAssets, isLoading: isLoadingPreview } = useReadContract({
    abi: erc4626Abi,
    address: VAULT_ADDRESS,
    functionName: "previewMint",
    args: [parseUnits(mintShares.toString(), 6)],
  });

  // Calculate exchange rate (assets per share)
  const exchangeRate =
    previewAssets && mintShares > 0
      ? Number(formatUnits(previewAssets, 6)) / mintShares
      : undefined;

  // Set approve hash when approve transaction is submitted
  useEffect(() => {
    if (approveHashData) {
      setApproveHash(approveHashData);
    }
  }, [approveHashData]);

  // Auto-mint after approval succeeds
  useEffect(() => {
    if (isApproveSuccess && mintShares > 0) {
      const sharesInWei = parseUnits(mintShares.toString(), 6);
      mint({
        address: VAULT_ADDRESS,
        abi: erc4626Abi,
        functionName: "mint",
        args: [sharesInWei, accountConnection.address as Address],
      });
      setApproveHash(undefined);
    }
  }, [isApproveSuccess, mintShares, mint, accountConnection.address]);

  // Refetch balances after successful mint
  useEffect(() => {
    if (isMintSuccess) {
      refetchWalletBalance();
      refetchVaultBalance();
      refetchConvertedAssets();
      refetchTotalAssets();
      refetchTotalSupply();

      if (initialDeposit === null && convertedAssets) {
        setInitialDeposit(Number(formatUnits(convertedAssets, 6)));
      }

      setMintShares(0);
      resetApprove();
      resetMint();
    }
  }, [
    isMintSuccess,
    refetchWalletBalance,
    refetchVaultBalance,
    refetchConvertedAssets,
    refetchTotalAssets,
    refetchTotalSupply,
    resetApprove,
    resetMint,
    initialDeposit,
    convertedAssets,
  ]);

  const handleMint = (shares: number) => {
    if (!accountConnection.address || shares <= 0 || !previewAssets) return;

    // Approve the max assets that will be needed
    approve({
      address: USDC_MOCK_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, previewAssets],
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
          maxShares={walletBalance}
          onSubmit={handleMint}
          onAmountChange={setMintShares}
          inputLabel="Shares to Mint"
          buttonLabel="Mint Shares"
          showConversion={true}
          conversionCurrency="aUSDC"
          isLoading={isApproving || isMinting}
          inputPrefix=""
          preview={
            mintShares > 0 && (
              <Preview
                type="mint"
                inputAmount={mintShares}
                outputAmount={previewAssets}
                inputCurrency="aUSDC"
                outputCurrency="USDC"
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
