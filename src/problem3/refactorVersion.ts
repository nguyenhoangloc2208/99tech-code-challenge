import React, { useMemo } from 'react';
import { BoxProps } from 'path/to/BoxProps';
import useWalletBalances from './path/to/useWalletBalances';
import usePrices from './path/to/usePrices';
import { WalletRow } from 'path/to/WalletRow';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain?: string;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {
    children?: React.ReactNode;
}
const WalletPage: React.FC<Props> = (props: Props) => { 
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: string | undefined): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100;
            case 'Ethereum':
                return 50;
            case 'Arbitrum':
                return 30;
            case 'Zilliqa':
                return 20;
            case 'Neo':
                return 20;
            default:
                return -99;
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99) {
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

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => { //code không được sử dụng
        return {
        ...balance,
        formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className="wallet-row"
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return (
        <div {...rest}>
        {rows}
        </div>
    )
}

export default WalletBalance;