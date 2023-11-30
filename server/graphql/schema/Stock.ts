import { gql } from 'apollo-server-express';

export const StockTypeDef = gql`
    type Stock {
        ticker: String!
        name: String!
        exchange: String!
        price: Float!
        logo: String!
        ipo: String!
        industry: String!
        country: String!
        currency: String!
        weburl: String!
    }
    type stocks {
        stocks: [Stock]
    }

    type stock {
        stock: Stock
    }

    type Query {
        getStocks(search: String, limit: Int, random: Boolean): stocks
        getStock(ticker: String): stock
    }

    type Mutation {
        createStock(
            ticker: String!,
            name: String!,
            exchange: String!,
            price: Float!,
            logo: String!,
            ipo: String!,
            industry: String!,
            country: String!,
            currency: String!,
            weburl: String!
        ): Stock

        updateStock(ticker: String!, price: Float, logo: String, weburl: String): Stock

        deleteStock(ticker: String!): String
    }
`;
