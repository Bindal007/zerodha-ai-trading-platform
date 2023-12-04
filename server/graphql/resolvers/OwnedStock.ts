import { OwnedStock } from '../../models/OwnedStock';
import { Transaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { verifyToken } from '../../middleware/auth';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { Stock } from '../../models/Stock';

async function clearFirstTransaction(userId) {
    try {
        const countTransactions = await Transaction.find({ userId }).countDocuments();
        if (countTransactions > 20) {
            await Transaction.findOneAndDelete({ userId: userId }, { sort: { ['date']: 1 } });
        }
    } catch (error) {
        return { error: 'Failure to cleanup transaction logs!' };
    }
}

export const OwnedStockResolver = {
    Query: {
        getOwnedStocks: async (_, args, context) => {
            const token = context.req.headers.authorization;

            const result = verifyToken({ token: token.split(' ')[1] });

            if (result.error) {
                throw new AuthenticationError(result.error);
            }

            const ownedStocks = await OwnedStock.find({ userId: result.userId }).sort({ ['userId']: 1 });

            const object = Object.fromEntries(ownedStocks.map((stock: any) => [stock.ticker, stock]));

            return { ownedStocks: object };
        },
        getOwnedStock: async (_, { ticker }, context) => {
            const token = context.req.headers.authorization;

            const result = verifyToken({ token: token.split(' ')[1] });

            if (result.error) {
                throw new AuthenticationError(result.error);
            }

            const ownedStock = await OwnedStock.find({ userId: result.userId, ticker });

            return { ownedStock };
        },
    },
    Mutation: {
        buyStock: async (_, { ticker, shares }, context) => {
            const token = context.req.headers.authorization;

            const authResult = verifyToken({ token: token.split(' ')[1] });

            if (authResult.error) {
                throw new AuthenticationError(authResult.error);
            }

            const stock: any = await Stock.findOne({ ticker });
            const user: any = await User.findOne({ _id: authResult.userId });
            const alreadyOwned = (await OwnedStock.find({ userId: authResult.userId, ticker }).countDocuments()) > 0;
            const cost = shares * stock.price;

            if (cost > user.balance) {
                throw new ApolloError("Can't afford transaction. $" + (cost - user.balance).toFixed(2) + ' more required.');
            }

            let response;

            if (alreadyOwned) {
                const ownedStock = await OwnedStock.findOneAndUpdate(
                    { userId: authResult.userId, ticker },
                    { $inc: { shares, initialInvestment: cost } },
                    { new: true }
                );

                await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: -cost } });

                const newTransaction = new Transaction({ userId: authResult.userId, type: 'BUY', ticker, shares, totalAmount: cost, stockPrice: stock.price });
                await newTransaction.save();

                response = { ownedStock, price: stock.price, newBalance: user.balance - cost };
            } else {
                const newOwnedStock = new OwnedStock({
                    userId: authResult.userId,
                    ticker,
                    shares,
                    initialInvestment: cost,
                });

                const result = await newOwnedStock.save();
                await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: -cost } });

                const newTransaction = new Transaction({ userId: authResult.userId, type: 'BUY', ticker, shares, totalAmount: cost, stockPrice: stock.price });
                await newTransaction.save();

                response = { ownedStock: result, newBalance: user.balance - cost };
            }

            clearFirstTransaction(authResult.userId);

            return response;
        },
        sellStock: async (_, { ticker, shares }, context) => {
            const token = context.req.headers.authorization;

            const authResult = verifyToken({ token: token.split(' ')[1] });

            if (authResult.error) {
                throw new AuthenticationError(authResult.error);
            }

            const ownedStock: any = await OwnedStock.findOne({ userId: authResult.userId, ticker });

            let response;

            if (ownedStock) {
                if (ownedStock.shares < shares) {
                    throw new ApolloError('Invalid shares amount');
                }

                const stock: any = await Stock.findOne({ ticker });
                const profit = stock.price * shares;
                const initialInvestment = ownedStock.initialInvestment - (ownedStock.initialInvestment * shares) / ownedStock.shares;

                const result: any = await OwnedStock.findOneAndUpdate(
                    { userId: authResult.userId, ticker },
                    { $inc: { shares: -shares }, initialInvestment },
                    { new: true }
                );

                const newTransaction = new Transaction({
                    userId: authResult.userId,
                    type: 'SELL',
                    ticker,
                    shares,
                    totalAmount: profit,
                    stockPrice: stock.price,
                });
                await newTransaction.save();

                if (result.shares === 0) {
                    await OwnedStock.findOneAndDelete({ userId: authResult.userId, ticker });
                }

                const user: any = await User.findOneAndUpdate({ _id: authResult.userId }, { $inc: { balance: profit } }, { new: true });

                response = { ownedStock: result, newBalance: user.balance };
            } else {
                throw new ApolloError('Stock not owned');
            }

            clearFirstTransaction(authResult.userId);

            return response;
        },
    },
};
