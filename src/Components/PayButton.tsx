import SolanaProvider from "../Providers/Solana";

const PayButton = () => {
    return (
        <SolanaProvider>
            <button>Pay</button>
        </SolanaProvider>
    );
}

export default PayButton;