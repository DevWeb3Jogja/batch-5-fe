import { useLogin, usePrivy, useLogout } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export const ConnectButton = () => {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const disableLogin = !ready || (ready && authenticated);

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  const walletAddress = user?.wallet?.address || "";

  return (
    <>
      {ready && authenticated ? (
        <div className="flex items-center gap-2">
          {walletAddress && (
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium">
              {formatAddress(walletAddress)}
            </span>
          )}
          <Button
            onClick={() => logout()}
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          disabled={disableLogin}
          onClick={() => login()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};
