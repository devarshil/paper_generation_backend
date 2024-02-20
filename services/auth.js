const BaseService = require(".");
const UserLogin = require('../models/auth')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = require('twilio')(accountSid, authToken);

class AuthService extends BaseService {

    constructor(req, res, reqQuery) {
        super();
        this.req = req;
        this.res = res;
        this.reqQuery = reqQuery;
    }

    async login() {
        const contact = this.req.contact;

        let existingUser = await UserLogin.findOne({ contact });

        let otp;

        if (existingUser) {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            existingUser.otp = otp;
            existingUser.otpExpiration = new Date(new Date().getTime() + 2 * 60000);
            await existingUser.save();
        } else {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            const newUser = new UserLogin({
                contact,
                otp,
                otpExpiration: new Date(new Date().getTime() + 2 * 60000)
            });

            await newUser.validate();
            await newUser.save();
        }

        const message = await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_FROM_NUMBER,
            to: contact,
        });

        const data = {
            message: `OTP sent successfully to this number: ${message.to}`,
        }

        return data;
    }

    async verifyOtp() {
        const { contact, otp } = this.req;

        const user = await UserLogin.findOne({ contact, otp });

        if (!user) {
            return {
                error: 'Invalid OTP',
                login: false
            };
        }

        if (new Date() > user.otpExpiration) {
            await UserLogin.findOneAndUpdate({ contact, otp }, { otp: '000000' });
            return {
                error: 'OTP expired',
                login: false
            };
        }

        await UserLogin.findOneAndUpdate({ contact, otp }, { otp: '000000' });

        return {
            message: 'Logged in successfully.',
            login: true
        };
    }
}

module.exports = AuthService;

