import React, { useEffect, useState } from 'react';
import StocksData from "./components/stocksData";
import "./components/app.css"
const API = "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=tcCqNrIJrpjhDOjDh9UnYcIijq7rxYtf";

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [numStocks, setNumStocks] = useState(20); // Default to maximum of 20 stocks

  const handleNumStocksChange = (event) => {
    const value = parseInt(event.target.value);
    setNumStocks(Math.min(value, 20)); // Limit input to maximum of 20
  };

  const fetchStocks = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        setStocks(data.results.slice(0, numStocks)); // Limit fetched stocks based on user input
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStockPrices = async () => {
    const symbols = stocks.map(stock => stock.symbol).join(','); // Extract symbols from fetched stocks
    const priceAPI = `https://api.polygon.io/v1/last/stocks/${symbols}?apiKey=tcCqNrIJrpjhDOjDh9UnYcIijq7rxYtf`;

    try {
      const res = await fetch(priceAPI);
      const data = await res.json();
      if (data && data.status === 'OK') {
        // Merge the fetched price data with the existing stocks data
        const updatedStocks = stocks.map(stock => ({
          ...stock,
          price: data.results[stock.symbol]?.last?.price || 'N/A' // Get the last price or display 'N/A' if not available
        }));
        setStocks(updatedStocks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStocks(API);

    // Fetch stock prices at 5-second intervals
    const priceInterval = setInterval(() => {
      fetchStockPrices();
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(priceInterval); // Clear interval on component unmount
  }, [numStocks]);

  return (
    <div>
      <h1>Stocks</h1>
      <label htmlFor="numStocksInput">Number of Stocks:</label>
      <input
        id="numStocksInput"
        type="number"
        min="1"
        max="20"
        value={numStocks}
        onChange={handleNumStocksChange}
      />
      <br />
      {stocks.length > 0 ? (
        <StocksData stocks={stocks} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
