# Web3 Frontend Bootcamp - DevWeb3Jogja

A hands-on Web3 frontend bootcamp project that teaches students how to build decentralized applications (dApps) using modern Web3 technologies. This project demonstrates a complete DeFi (Decentralized Finance) application with wallet integration, token faucet, and vault operations.

## 🎯 Learning Objectives

By completing this bootcamp, students will learn:

### Core Web3 Concepts

- **Wallet Integration**: Connect and interact with Web3 wallets (MetaMask, WalletConnect, etc.)
- **Smart Contract Interaction**: Read from and write to blockchain smart contracts
- **Transaction Management**: Handle transaction states, confirmations, and error handling
- **Token Operations**: Work with ERC-20 tokens (USDC Mock)
- **DeFi Mechanics**: Understand deposit, mint, redeem, and withdraw operations in a vault system

### Technical Skills

- **React 19** with TypeScript for type-safe development
- **Wagmi v3**: Modern React hooks for Ethereum development
- **Viem**: Low-level Ethereum interactions and utilities
- **RainbowKit**: Beautiful wallet connection UI
- **TanStack Query**: Efficient data fetching and caching
- **Tailwind CSS v4**: Modern utility-first styling
- **React Router**: Client-side routing in SPAs

### Project Features

1. **Faucet Page**: Mint test USDC tokens for development
2. **Earn Page**: Interact with a vault contract
   - Deposit USDC into the vault
   - Mint vault shares
   - Redeem shares for USDC
   - Withdraw USDC from the vault

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ installed
- pnpm package manager (`corepack enable pnpm`)
- MetaMask or another Web3 wallet
- Some Base Sepolia testnet ETH for gas fees

### Installation

1. Clone the repository:

```bash
git clone https://github.com/DevWeb3Jogja/batch-5-fe.git
cd batch-5-fe
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

4. Start the development server:

```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📚 Project Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── earn/          # Vault operations (deposit, mint, redeem, withdraw)
│   │   └── faucet/        # Token faucet for testing
│   ├── shared/            # Reusable components
│   └── ui/                # UI primitives (buttons, cards, inputs)
├── lib/
│   ├── wagmi-config.ts    # Wagmi and blockchain configuration
│   ├── usdc-mock-abi.ts   # Smart contract ABI
│   └── utils.ts           # Utility functions
└── pages/                 # Page components
```

## 🌟 Key Technologies

### Wagmi v3

Wagmi provides React hooks for Ethereum interactions:

- `useConnect` / `useDisconnect`: Wallet connection management
- `useReadContract`: Read data from smart contracts
- `useWriteContract`: Execute transactions
- `useWaitForTransactionReceipt`: Wait for transaction confirmations

### RainbowKit

Beautiful, customizable wallet connection UI that supports:

- MetaMask
- WalletConnect
- Coinbase Wallet
- And many more...

### Viem

TypeScript library for Ethereum that provides:

- Type-safe contract interactions
- Utility functions (`formatUnits`, `parseUnits`)
- Lower-level blockchain operations

## 🔗 Smart Contracts

This project interacts with two main contracts on Base Sepolia:

- **USDC Mock**: `0xF6f2377B59c2c316537a64F5c366DE38f3FB0796`
- **Vault Contract**: `0x613148C5e1A27c99B28Cb01A5954C5dD3b2c9abf`

## 🎓 Learning Path

### Branch: `main`

The main branch contains the complete implementation with all features working. Use this as a reference.

### Branch: `privy-io`

This branch will demonstrate wallet integration using Privy.io as an alternative to RainbowKit. Students will:

1. See how Privy.io wallet connection works
2. Complete the remaining features (earn page operations)
3. Learn how to swap between different wallet providers

## 📖 Bootcamp Curriculum

### Module 1: Wallet Connection

- Understanding Web3 wallets
- Implementing wallet connect/disconnect
- Managing connection states
- Displaying wallet address and balance

### Module 2: Reading from Blockchain

- Using `useReadContract` hook
- Fetching token balances
- Understanding contract ABIs
- Formatting blockchain data

### Module 3: Writing to Blockchain

- Using `useWriteContract` hook
- Handling transaction states
- Error handling and user feedback
- Transaction confirmations

### Module 4: DeFi Operations

- Token approvals
- Deposit/Withdraw mechanics
- Mint/Redeem share calculations
- Percentage-based operations

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Network Configuration

The app is configured to work with **Base Sepolia** testnet. To get testnet ETH:

1. Visit [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
2. Enter your wallet address
3. Receive testnet ETH for gas fees

## 🤝 Contributing

This is a bootcamp project for educational purposes. Students are encouraged to:

1. Fork the repository
2. Experiment with the code
3. Add new features

## 📝 Exercises for Students

1. **Add a new token**: Integrate another ERC-20 token into the faucet
2. **Improve UI/UX**: Add loading skeletons, better error messages
3. **Add features**: Implement transaction history, token swap preview
4. **Multi-chain support**: Add support for another testnet
5. **Wallet abstraction**: Implement the Privy.io integration in the `privy-io` branch

## 🐛 Troubleshooting

### Common Issues

**Wallet won't connect**

- Ensure MetaMask is installed and unlocked
- Check that you're on Base Sepolia network
- Clear browser cache and reload

**Transaction fails**

- Ensure you have enough testnet ETH for gas
- Check if you have sufficient USDC balance
- Verify contract approval for token transfers

**Balance not updating**

- Wait for transaction confirmation
- Manually refresh the page
- Check transaction on [Sepolia Basescan](https://sepolia.basescan.org/)

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Base Documentation](https://docs.base.org/)
- [Ethereum Development Documentation](https://ethereum.org/en/developers/)

## 📄 License

MIT License - feel free to use this project for learning and teaching purposes.

## 👥 Bootcamp Information

**Organizer**: DevWeb3Jogja  
**Repository**: [batch-5-fe](https://github.com/DevWeb3Jogja/batch-5-fe)  
**Branch for Learning**: `privy-io` (wallet integration demo)

---

Happy coding! 🚀 If you have questions, feel free to open an issue or reach out to the bootcamp instructors.
