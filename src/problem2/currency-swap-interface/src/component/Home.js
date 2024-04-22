import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.scss';
import Select from "react-select";
import ArrowIcon from "./ui/ArrowIcon";

const Home = () => {
    const [prices, setPrices] = useState(null);
    const [inputCurrency, setInputCurrency] = useState("");
    const [outputCurrency, setOutputCurrency] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [outputAmount, setOutputAmount] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios('https://interview.switcheo.com/prices.json');
                setPrices(response.data)
            }
            catch (err){
                console.error(err);
            }
        }
        fetchData();
    },[]);
    useEffect(() => {
        const handleSubmit = () => {
            if (inputCurrency && outputCurrency && inputAmount) {
                const inputPrice = prices.find(prices => prices.currency === inputCurrency)?.price;
                const outputPrice = prices.find(currency => currency.currency === outputCurrency)?.price;
                if (inputPrice && outputPrice) {
                    const inputAmountNum = parseFloat(inputAmount);
                    const outputAmountNum = (inputAmountNum * inputPrice) / outputPrice;
                    setOutputAmount(outputAmountNum.toFixed(2));
                }
            }
        };
        handleSubmit();
    },[inputCurrency, inputAmount, outputCurrency, prices])


    const customOption = (option) => {
        if (!option.value) {
            return <div>Select a currency...</div>;
        }
        
        return (
            <div>
                <img src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.value}.svg`} alt='' width="24" height="24" style={{ marginRight: 10 }} />
                {option.label}
            </div>
        );
    };

    const handleSwap = () =>{
        const temp = inputCurrency;
        setInputCurrency(outputCurrency);
        setOutputCurrency(temp);
    }

    return(
        <>
            {/* {prices && prices.length > 0 &&
                prices.map((data, index) => {
                    return(
                        <div key={index}>
                            {data.currency}
                            <img src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${data.currency}.svg`} alt=''/>
                            </div>
                        )
                    })
                } */}
            <form className="currency-swap-form">
                <h1>Currency Swap</h1>
                <div className="input-group">
                    <label htmlFor="input-amount">Amount</label>
                    <input
                        id="input-amount"
                        type="number"
                        pattern="[0-9]*"
                        name="amount"
                        min="1"
                        step="any"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="input-currency">From</label>
                    <Select
                        id="input-currency"
                        value={{ value: inputCurrency, label: inputCurrency }}
                        onChange={(selectedOption) => setInputCurrency(selectedOption.value)}
                        options={prices ? prices.map(currency => ({ value: currency.currency, label: currency.currency })) : []}
                        formatOptionLabel={customOption}
                        required
                    />
                </div>
                <button onClick={() => handleSwap()} className="swap-btn">
                    <div>
                        <ArrowIcon/>
                        <span>Swap</span>
                    </div>
                </button>
                <div className="input-group">
                    <label htmlFor="output-currency">To</label>
                    <Select
                        id="output-currency"
                        value={{ value: outputCurrency, label: outputCurrency }}
                        onChange={(selectedOption) => setOutputCurrency(selectedOption.value)}
                        options={prices ? prices.map(currency => ({ value: currency.currency, label: currency.currency })) : []}
                        formatOptionLabel={customOption}
                        required
                    />
                </div>
                { outputAmount && 
                    <div className="output-container">
                        <div className="output-amount">{inputAmount} {inputCurrency} equal</div>
                        <div className="output-amount">{outputAmount} {outputCurrency}</div>
                    </div>
                }
                {/* <button type="submit">CONFIRM SWAP</button> */}
            </form>
        </>
        
    )
}

export default Home;