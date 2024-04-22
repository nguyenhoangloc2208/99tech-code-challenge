// Instead of using useMemo to calculating sortedBalances and formattedBalances 
// whenever there are changes in balances and prices, we can use useEffect. 
// This minimizes unnecessary calculate on each render.

import React from 'react';
// import BoxProps from './path/to/BoxProps';
import useWalletBalances from './path/to/useWalletBalances';
import usePrices from './path/to/usePrices';
import WalletRow from './path/to/WalletRow';

const WalletPage = (props) => { 
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const [sortedBalances, setSortedBalances] = useState([]);
    const [formattedBalances, setFormattedBalances] = useState([]);

    useEffect(() => {
        const getPriority = (blockchain) => {
            switch (blockchain) {
                case 'Osmosis':
                    return 100;
                case 'Ethereum':
                    return 50;
                case 'Arbitrum':
                    return 30;
                case 'Zilliqa':
                case 'Neo':
                    return 20;
                default:
                    return -99;
            }
        };

        const sorted = balances.filter((balance) => {
            const balancePriority = getPriority(balance.blockchain);
            return balancePriority > -99 && balance.amount <= 0;
        }).sort((lhs, rhs) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            return rightPriority - leftPriority;
        });

        setSortedBalances(sorted);
    }, [balances]);

    useEffect(() => {
        setFormattedBalances(prevFormattedBalances => {
            return prevFormattedBalances.map(balance => {
                const formattedAmount = balance.amount.toFixed();
                if (balance.formatted !== formattedAmount) {
                    return { ...balance, formatted: formattedAmount };
                }
                return balance;
            });
        });
    }, [sortedBalances]);

    /* Old code for calculating sortedBalances and formattedBalances
    const sortedBalances = useMemo(() => {
        return balances.filter((balance) => {
            const balancePriority = getPriority(balance.blockchain);
            return balancePriority > -99 && balance.amount <= 0;
        }).sort((lhs, rhs) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            return rightPriority - leftPriority;
        });
    }, [balances, prices]);
    
    const formattedBalances = useMemo(() => {
        return sortedBalances.map((balance) => ({
            ...balance,
            formatted: balance.amount.toFixed()
        }));
    }, [sortedBalances]);
    */

    const rows = formattedBalances.map((balance, index) => {
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
    );
};

export default WalletPage;
