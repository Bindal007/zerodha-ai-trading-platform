import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Server } from 'socket.io';
import { updateStockPrices, startUpdatingStocks } from './sockets/market';
import schema from './graphql/schema';

dotenv.config();

const app = express();
const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        return {
            req,
        };
    },
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('*', (req, res) => {
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

server.start().then(() => server.applyMiddleware({ app }));

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pebuc0d.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .catch((error) => {
        throw error;
    })
    .then(() => {
        console.log('Mongo connection established');
        startUpdatingStocks(undefined, 120000);
        console.log('Started updating all stocks without socket emits');
    });

const port = process.env.PORT || 443;

const http = app.listen(port, () => console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`));
const io = new Server(http);

let refreshIntervalId = null;

io.on('connection', async (socket) => {
    console.log('New socket connection: ', socket?.id);

    if (!refreshIntervalId) {
        console.log('Started 10 second interval for updating stocks');
        refreshIntervalId = setInterval(() => {
            updateStockPrices(io);
        }, 10000);
    }

    socket.on('disconnect', () => {
        if (io.engine.clientsCount === 0 && refreshIntervalId) {
            clearInterval(refreshIntervalId);
            refreshIntervalId = null;
            console.log('No users connected, stopped 10 second interval for stocks');
        }
    });
});
