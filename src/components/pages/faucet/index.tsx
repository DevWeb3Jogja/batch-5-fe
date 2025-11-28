import {
  CheckCircle2,
  Coins,
  ExternalLink,
  Loader2,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatUnits, parseUnits } from "viem";
import { useState } from "react";
import {
  useConnection,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { USDC_MOCK_ADDRESS } from "@/lib/constants";
import { usdcMockAbi } from "@/lib/usdc-mock-abi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Faucet() {
  const [mintAmount, setMintAmount] = useState("100");

  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDC_MOCK_ADDRESS,
    abi: usdcMockAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMint = async () => {
    if (!address) return;

    try {
      const amount = parseUnits(mintAmount, 6);
      writeContract({
        address: USDC_MOCK_ADDRESS,
        abi: usdcMockAbi,
        functionName: "mint",
        args: [address, amount],
      });
    } catch (error) {
      console.error("Mint error:", error);
    }
  };

  if (isConfirmed && balance !== undefined) {
    refetchBalance();
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">USDC Mock Faucet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Get free USDC Mock tokens for testing purposes
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Coins className="h-6 w-6 text-blue-600" />
              Mint USDC Mock Tokens
            </CardTitle>
            <CardDescription className="text-gray-600">
              Connect your wallet and mint test tokens instantly
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Wallet className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-gray-600 text-center max-w-sm">
                  Connect your Web3 wallet to start minting USDC Mock tokens
                </p>
                <ConnectButton />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Connected Wallet
                      </p>
                      <p className="text-lg font-mono font-semibold text-gray-900">
                        {formatAddress(address!)}
                      </p>
                    </div>
                    <Button
                      onClick={() => disconnect()}
                      variant="outline"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 p-6 text-white">
                  <p className="text-sm font-medium opacity-90">
                    Your USDC Mock Balance
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {balance !== undefined
                      ? `${Number(formatUnits(balance, 6)).toFixed(2)} USDC`
                      : "Loading..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mint Amount (USDC)
                  </label>
                  <Input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="100"
                    min="1"
                    className="text-lg"
                  />
                  <div className="flex gap-2">
                    {[10, 100, 1000].map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => setMintAmount(amount.toString())}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        {amount} USDC
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleMint}
                  disabled={
                    isPending ||
                    isConfirming ||
                    !mintAmount ||
                    parseFloat(mintAmount) <= 0
                  }
                  size="lg"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isPending ? "Confirm in Wallet..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Mint {mintAmount} USDC Mock
                    </>
                  )}
                </Button>

                {hash && (
                  <div className="rounded-lg border border-gray-200 p-4 space-y-2">
                    {isConfirming && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">
                          Waiting for confirmation...
                        </span>
                      </div>
                    )}
                    {isConfirmed && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Transaction confirmed!
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Transaction Hash:</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-mono"
                      >
                        {formatAddress(hash)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {writeError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">
                          Transaction Failed
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          {writeError.message.split("\n")[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Contract Address
                  </p>
                  <a
                    href={`https://sepolia.etherscan.io/address/${USDC_MOCK_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-mono"
                  >
                    {USDC_MOCK_ADDRESS}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
