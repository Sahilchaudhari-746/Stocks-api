import React, { useState, useEffect } from 'react';

const StocksData = ({ stocks }) => {
  const [updatedStocks, setUpdatedStocks] = useState([]);

  useEffect(() => {
    // Set initial state with valid price values
    const initialStocks = stocks.map(stock => ({
      ...stock,
      price: !isNaN(stock.price) ? stock.price : 0, // Ensure price is a number, set to 0 if NaN
      movement: getUpDown()
    }));
    setUpdatedStocks(initialStocks);

    const interval = setInterval(() => {
      const newStocks = updatedStocks.map(stock => ({
        ...stock,
        price: getRandomPrice(stock.price),
        movement: getUpDown()
      }));
      setUpdatedStocks(newStocks);
    }, 5000); // 5000 milliseconds = 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [stocks]); // Update when stocks prop changes

  const getRandomPrice = (currentPrice) => {
    const minChange = -0.5; // Minimum price change
    const maxChange = 0.5; // Maximum price change
    const change = minChange + Math.random() * (maxChange - minChange); // Random price change
    return (parseFloat(currentPrice) + change).toFixed(2); // Apply change and round to 2 decimal places
  };

  const getUpDown = () => {
    const random = Math.random();
    return random < 0.5 ? 'Up' : 'Down';
  };

  return (
    <div className="table-container">
      <table className="stocks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Movement</th>
          </tr>
        </thead>
        <tbody>
          {updatedStocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.name}</td>
              <td>{stock.type}</td>
              <td>{stock.price}</td>
              <td>{stock.movement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StocksData;
