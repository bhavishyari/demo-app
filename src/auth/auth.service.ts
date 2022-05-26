import { Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import web3 from './web3connect';
import { LoginDto } from './dtos/login.dto';
@Injectable()
export class AuthService {
    constructor(
    ) { }
    public async login( loginDto: LoginDto ) {
        const signatureAddress = await web3.eth.accounts.recover(loginDto.signature_message, loginDto.signature_hash);
        if (loginDto.public_address == signatureAddress) {
            let today = new Date();
            let exp = new Date(today);
            exp.setDate(today.getDate() + 60);
            var token = jwt.sign({
                address: loginDto.public_address,
                signatureMessage: loginDto.signature_message,
                signatureHash: loginDto.signature_hash,
                exp: exp.getTime() / 1000,
              }, process.env.SECRET);
            return {token: token}
        } else {
            throw new Error('Invalid signature');
        }
    }
}