// pages/index.js
"use client"
import "./components/Statistics.css"
import { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './components/Barchart';
import Piechart from './components/PieChart';
export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/states');
        setStats(response.data);
        console.log("stats", response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  // Extracting data for Bar Chart - Top Products by Sales
  const topProductsBySalesData = stats && stats.topProductsBySales.map(item => ({
    name: `Product ID: ${item.productId}`,
    quantity: item._sum.quantity
  }));

  // Extracting data for Pie Chart - Total Purchases Percentage Per Seller
  const totalPurchasesPerSellerData = stats && stats.totalPurchasesPerSeller.map(item => ({
    name: `Seller ID: ${item.sellerId}`,
    count: item._count
  }));

  // Extracting data for Pie Chart - Buyers Per Location
  const buyersPerLocationData = stats && stats.buyersPerLocation.map(item => ({
    name: `${item.city}, ${item.Country}`,
    count: item._count
  }));

  // Extracting data for Least Selling Products
  const leastSellingProductsData = stats && stats.getLeastSellingProducts.map(item => ({
    name: `Product ID: ${item.productId}`
  }));

  // Extracting data for Items Never Purchased
  const itemsNeverPurchasedData = stats && stats.getItemsNeverPurchased.map(item => ({
    name: item.name
  }));

  // Extracting data for Average Purchase Frequency Per Buyer
  const averagePurchaseFrequencyPerBuyerData = stats && stats.getAveragePurchaseFrequencyPerBuyer;

  return (
    <div className="app">
      <h1>Statistics</h1>
      {stats && (
        <div className="dashboard">
          <div className="chart-container">
            <h2>Items Never Purchased</h2>
            <ul>
              {itemsNeverPurchasedData.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
          <div className="chart-container">
            <h2>Average Purchase Frequency Per Buyer</h2>
            <p>{averagePurchaseFrequencyPerBuyerData}</p>
          </div>
          <div className="chart-container2">
            <h2>Top Products by Sales</h2>
            <BarChart data={topProductsBySalesData} datakey="quantity" nameSize={30} />
          </div>
          <div className="chart-container">
            <h2>Total Purchases Percentage Per Seller</h2>
            <Piechart data={totalPurchasesPerSellerData} datakey="count" />
          </div>
          <div className="chart-container">
            <h2>Buyers Per Location</h2>
            <Piechart data={buyersPerLocationData} datakey="count" />
          </div>
          <div className="chart-container">
            <h2>Least Selling Products</h2>
            <ul>
              {leastSellingProductsData.map((product, index) => (
                <li key={index}>{product.name}</li>
              ))}
            </ul>
          </div>
          
        </div>
      )}
      {!stats && <p>Please wait...</p>}
    </div>
  );
}
