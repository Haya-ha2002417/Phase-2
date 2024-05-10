const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function seedProducts(data) {
  for (const productData of data) {
    await prisma.product.create({
      data: {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        seller: { connect: { id: productData.sellerId } },
        imageUrl: productData.imageUrl,
        description: productData.description
      }
    });
  }
}

async function seedSellers(data) {
  for (const sellerData of data) {
    await prisma.seller.create({
      data: {
        id: sellerData.id,
        username: sellerData.username,
        password: sellerData.password,
        companyName: sellerData.companyName,
        bankAccount: sellerData.bankAccount
      }
    });
  }
}

async function seedBuyers(data) {
  for (const buyerData of data) {
    await prisma.buyer.create({
      data: {
        id: buyerData.id,
        username: buyerData.username,
        password: buyerData.password,
        firstName: buyerData.firstName,
        lastName: buyerData.lastName,
        address: buyerData.address,
        city: buyerData.city,
        Country: buyerData.Country,
        balance: buyerData.balance
      }
    });
  }
}

async function seedPurchases(data) {
  for (const purchaseData of data) {
    await prisma.purchase.create({
      data: {
        id: purchaseData.id,
        quantity: purchaseData.quantity,
        totalPrice: purchaseData.totalPrice,
        date: purchaseData.date,
        product: { connect: { id: purchaseData.productId } },
        seller: { connect: { id: purchaseData.sellerId } },
        buyer: { connect: { id: purchaseData.buyerId } },
      }
    });
  }
}
async function removeItem(itemId) {
  try {
    // Find the seller ID of the item
    const item = await prisma.product.findUnique({
      where: {
        id: itemId
      },
      select: {
        sellerId: true
      }
    });

    if (!item) {
      throw new Error(`Item with ID ${itemId} not found.`);
    }

    const { sellerId } = item;

    // Delete purchases related to the item
    await prisma.purchase.deleteMany({
      where: {
        productId: itemId
      }
    });

    // Delete the item itself
    await prisma.product.delete({
      where: {
        id: itemId
      }
    });


    console.log(`Item with ID ${itemId} and related purchases removed successfully.`);
  } catch (error) {
    throw new Error('Error removing item and related purchases: ' + error.message);
  }
}




async function seedDatabase() {
  try {
  //  // Read JSON file
  //   const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  //   await seedSellers(data[1]);
  //   // Populate products
  //   await seedProducts(data[0]);

  //   // Populate sellers
    

  //   // Populate buyers
  //   await seedBuyers(data[2]);

  //   // Populate purchases
  //   await seedPurchases(data[3]);
    await removeItem("NaN")

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
