<h1 align="center">
  Hex-Market
</h1>

![Project Logo](./assets/HexLogo.svg)

## Start Guide

### Development Watch Run

- Create .env file `cp .env-sample .env` and set `NODE_ENV=development`
- Install dependencies: `npm install`
- Make Sure you have a running mongod instance using `mongod`
- Start the app using `npm run start:dev` 
- All ENV variable list in config/env/development.env
- Feel free to change the port in config/env/development.env


### Deploy in staging

- Create .env file `echo NODE_ENV=development > .env`
- Change the port number in config/env/development.env
- Make Sure you have a running mongod instance
- Install PM2: `npm install pm2 -g`
- Install dependencies and start server: `npm run start:staging`



### Deploy in production

- Create .env file `echo NODE_ENV=production > .env`
- Change the port number in config/env/production.env
- Make Sure you have a running mongod instance
- Install PM2: `npm install pm2 -g`
- Install dependencies and start server: `npm run start:pro`



## API Documentation

```bash
# Get All Listed Items
$ curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/v1/nft

# Get All Owner Items By OwnerAddress
$ curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/v1/nft/owner-address/:ownerAddress

# Update Price NFTItem By _id
$ curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"price":10, "blockchainIndex":2}' \
  http://localhost:3000/v1/nft/:id

# Solid NFTItem By _id
$ curl --header "Content-Type: application/json" \
  --request PUT \
  http://localhost:3000/v1/nft/sold/:id

# Fetch NFT Items from rarible By ownerAddress
$ curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/v1/nft/rarible/owner-address/ETHEREUM:0xAa76B40d59cefa8817E16C617f048310E9eaEA6f
```