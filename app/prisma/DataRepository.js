const { PrismaClient } = require("@prisma/client");

class DataHandler {
  constructor() {
    this.client = new PrismaClient();
  }
  async getHighestItemId() {
    
    try {
      const items = await this.getItems();
      if (items.length === 0) {
        throw new Error('No items found');
      }
      // Find the item with the highest ID
      const highestItem = items.reduce((prev, current) => {
        return prev.id > current.id ? prev : current;
      });
      return highestItem.id;
    } catch (error) {
      throw new Error('Error fetching item with highest ID: ' + error.message);
    }
  
}

  async getLeastSellingProducts() {
    try {
      const result = await this.client.purchase.groupBy({
        by: ["productId"],
        orderBy: {
          _count: {
            quantity: "asc", // Sort by the count of purchases in ascending order
          },
        },
        take: 5,
      });
      return result;
    } catch (error) {
      throw new Error(
        "Error fetching least selling products: " + error.message
      );
    }
  }

  async getAveragePurchaseFrequencyPerBuyer() {
    try {
      const purchaseCountsPerBuyer = await this.client.purchase.groupBy({
        by: ["buyerId"],
        _count: true, // Count the number of purchases per buyer
      });

      // Calculate the total number of buyers
      const totalBuyers = purchaseCountsPerBuyer.length;

      // Calculate the total number of purchases
      const totalPurchases = purchaseCountsPerBuyer.reduce(
        (acc, buyer) => acc + buyer._count,
        0
      );

      // Calculate the average purchase frequency per buyer
      const averagePurchaseFrequency = totalPurchases / totalBuyers;

      return averagePurchaseFrequency;
    } catch (error) {
      throw new Error(
        "Error fetching average purchase frequency per buyer: " + error.message
      );
    }
  }

  async getItemsNeverPurchased() {
    try {
      const allItems = await this.client.product.findMany();
      const purchasedItems = await this.client.purchase.findMany({
        select: {
          productId: true,
        },
      });
      const purchasedItemIds = new Set(
        purchasedItems.map((item) => item.itemId)
      );
      const itemsNeverPurchased = allItems.filter(
        (item) => !purchasedItemIds.has(item.id)
      );
      return itemsNeverPurchased;
    } catch (error) {
      throw new Error("Error fetching items never purchased: " + error.message);
    }
  }
  async getTopProductsBySales() {
    //--
    const result = await this.client.purchase.groupBy({
      by: ["productId"],
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      _sum: {
        quantity: true,
      },
      take: 5,
    });
    return result;
  }
  async getBuyersPerLocation() {
    //--
    try {
      const result = await this.client.buyer.groupBy({
        by: ["city", "Country"],
        _count: true,
      });
      return result;
    } catch (error) {
      throw new Error("Error fetching buyers per location: " + error.message);
    }
  }
  async getTotalPurchasesPerSeller() {
    //--
    const result = await this.client.purchase.groupBy({
      by: ["sellerId"],
      _count: true,
    });
    return result;
  }

  async signIn(uname, pwd) {
    try {
      let user = await this.client.buyer.findUnique({
        where: {
          username: uname,
        },
      });

      if (!user || user.password !== pwd) {
        user = await this.client.seller.findUnique({
          where: {
            username: uname,
          },
        });

        if (!user || user.password !== pwd) {
          throw new Error("Invalid username or password");
        }
      }

      return user;
    } catch (error) {
      throw new Error("Error during sign-in: " + error.message);
    }
  }

  async addItem(name, price, qty, sellerId, img, desc) {
    let highestItemId = await this.getHighestItemId();
    console.log(highestItemId)
     let id = (parseInt(highestItemId)+1).toString()
     console.log("id is",id)
    try {
      const newItem = await this.client.product.create({
        data: {
          id,
          name,
          price,
          quantity: qty,
          seller: { connect: { id: sellerId } },
          imageUrl: img,
          description: desc,
        },
      });
      return newItem;
    } catch (error) {
      throw new Error("Error adding item: " + error.message);
    }
  }

  async getItems() {
    try {
      const items = await this.client.product.findMany();
      return items;
    } catch (error) {
      throw new Error("Error fetching items: " + error.message);
    }
  }

  async getTransactions() {
    try {
      const transactions = await this.client.purchase.findMany();
      return transactions;
    } catch (error) {
      throw new Error("Error fetching transactions: " + error.message);
    }
  }

  async purchase(productId, buyerId, qty) {
    console.log(productId, buyerId, qty)
    try {
      const product = await this.client.product.findUnique({
        where: {
          id: productId,
        },
      });
console.log("product found")
      if (!product) {
        throw new Error("Product not found");
      }

      const totalPrice = product.price * qty;

      const buyer = await this.client.buyer.findUnique({
        where: {
          id: buyerId,
        },
      });
      console.log("buyer Found")
      if (!buyer || buyer.balance < totalPrice) {
        throw new Error("Insufficient balance");
      }
      console.log("Not Insufficient balance")
      const transaction = await this.client.purchase.create({
        data: {
          productId,
          sellerId:product.sellerId ,
          buyerId,
          quantity: qty,
          totalPrice,
        },
      });
      await this.client.buyer.update({
        where: {
          id: buyerId,
        },
        data: {
          balance: {
            decrement: totalPrice,
          },
        },
      });

      return transaction;
    } catch (error) {
      throw new Error("Error during purchase: " + error.message);
    }
  }

  async getSellerInfo(id) {
    try {
      const seller = await this.client.seller.findUnique({
        where: {
          id,
        },
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      return seller;
    } catch (error) {
      throw new Error("Error fetching seller info: " + error.message);
    }
  }

  async getUserInfo(id) {
    try {
      const user = await this.client.buyer.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error fetching user info: " + error.message);
    }
  }

  async close() {
    await this.client.$disconnect();
  }
}

module.exports = DataHandler;
