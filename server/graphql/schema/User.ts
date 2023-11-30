import { gql } from 'apollo-server-express';

export const UserTypeDef = gql`
    type User {
        _id: String!
        username: String!
        balance: Float!
        type: String!
    }

    type UserResponse {
        user: User
        token: String
    }

    type Query {
        getUser: UserResponse!
        getAllUsers(search: String, limit: Int, random: Boolean): [User]
    }

    type balanceResponse {
        newBalance: Float
    }

    type usernameChangeResponse {
        newUsername: String!
    }

    type Mutation {
        registerUser(username: String!, password: String!, confirmPassword: String!, type: String!): UserResponse
        loginUser(username: String!, password: String!, type: String!): UserResponse
        deposit(amount: Float!): balanceResponse
        withdraw(amount: Float!): balanceResponse
        changeUsername(newUsername: String!, confirmPassword: String!): usernameChangeResponse
        deleteUser(confirmPassword: String!): String
    }
`;
