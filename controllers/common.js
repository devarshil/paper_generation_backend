const handleException = require("../decorators/error");
const Joi = require("joi");
const AuthService = require("../services/auth");
const commonRouter = require('express').Router();

const LoginRequest = Joi.object({
    contact: Joi.string().optional(),
    otp: Joi.string().optional()
});

commonRouter.post("/login", handleException(async (req, res) => {
    try {
        const reqBody = await LoginRequest.validateAsync(req.body);
        const authServ = new AuthService(reqBody, res, req.user);
        const data = await authServ.login();

        if (!res.headersSent) {
            res.json({
                data
            });
        }
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}));

commonRouter.post('/verify-otp', handleException(async (req, res) => {
    try {
        const reqBody = await LoginRequest.validateAsync(req.body);
        const authServ = new AuthService(reqBody, res, req.user);
        const data = await authServ.verifyOtp();

        res.status(200).json({
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}));

module.exports = commonRouter;