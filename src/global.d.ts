import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
    interface Web3Props {
        provider: ethers.providers.JsonRpcProvider;
        signer: ethers.providers.JsonRpcSigner;
        account: string;
        chainId: number;
    }
}