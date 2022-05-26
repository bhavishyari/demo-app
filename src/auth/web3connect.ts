const Web3 = require("web3");
// import { ConfigService } from '@nestjs/config';
// const configObject = new ConfigService();
// const HTTP_PROVIDER = configObject.get(process.env.MAINNET_URL);
// const provider = new Web3.providers.HttpProvider(process.env.MAINNET_URL);
const web3 = new Web3(process.env.MAINNET_URL);
export default web3;