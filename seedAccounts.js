// MongoDB seed script for 50 accounts
// Usage: mongo <your-db> seedAccounts.js

const userId = ObjectId("64b7f1a2c2a4e2a1b1c1a1a1"); // Replace with a real user _id

const types = ["checking", "savings", "credit"];
const currencies = ["USD", "EUR", "GBP"];

const accounts = Array.from({ length: 50 }, (_, i) => ({
  name: `Account ${i + 1}`,
  type: types[i % types.length],
  balance: Math.floor(Math.random() * 10000) + 100,
  currency: currencies[i % currencies.length],
  userId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

db.accounts.insertMany(accounts);

print('Inserted 50 accounts into db.accounts');
