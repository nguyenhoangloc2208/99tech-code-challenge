//Haven't imported React, BoxProps, useMemo yet.

interface WalletBalance { // blockchain hasn't been defined inside this
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps { // BoxProps hasn't been imported yet

}
const WalletPage: React.FC<Props> = (props: Props) => { // React and component haven't been imported 
    const { children, ...rest } = props;
    const balances = useWalletBalances(); //Hasn't been imported yet.
    const prices = usePrices(); //Hasn't been imported yet.

    const getPriority = (blockchain: any): number => { // incorrect data type, blockchain should be string or undefined
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => { // useMemo hasn't been imported
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain); // balancePriority hasn't been used
            if (lhsPriority > -99) { // lhsPriority hasn't been defined
                if (balance.amount <= 0) {
                return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => { // code isn't used
        return {
        ...balance,
        formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
        <WalletRow //Hasn't been imported yet.
            className={classes.row} // classes hasn't been defined
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
        />
        )
    })

    return (
        <div {...rest}> // React hasn't been imported
        {rows}
        </div>
    )
}

// WalletPages hasn't been exported