import DataHandler from '../../../prisma/DataRepository';
const statesData = new DataHandler();
export async function GET(request) {
    try {
      console.log("Coming")
      const year = new Date().getFullYear().toString();
      const getLeastSellingProducts = await statesData.getLeastSellingProducts();
     const getAveragePurchaseFrequencyPerBuyer = await statesData.getAveragePurchaseFrequencyPerBuyer();
     const topProductsBySales = await statesData.getTopProductsBySales(); //
      const buyersPerLocation = await statesData.getBuyersPerLocation(); //
     const getItemsNeverPurchased = await statesData.getItemsNeverPurchased();
     const totalPurchasesPerSeller = await statesData.getTotalPurchasesPerSeller(); //
     return Response.json({
        getLeastSellingProducts,
        getAveragePurchaseFrequencyPerBuyer,
        topProductsBySales,
        buyersPerLocation,
        getItemsNeverPurchased,
        totalPurchasesPerSeller,
      });
    } catch (error) {
      Response.statusCode = 500;
      return Response.json({ error: 'Error fetching statistics', message: error.message });
    }
  }
  