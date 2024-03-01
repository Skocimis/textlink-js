"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const https = __importStar(require("https"));
// Declare the API_KEY object with the APIKey interface
const API_KEY = { value: "" };
/**
 * A helper function to make HTTPS requests to the TextLink API.
 * @param path The endpoint path.
 * @param payload The request payload as a string.
 * @returns A promise that resolves to the parsed response.
 */
const returnEndpointPromise = (path, payload) => {
    return new Promise(resolve => {
        let reqOptions = {
            hostname: 'textlinksms.com',
            port: 443,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + API_KEY.value
            }
        };
        let req = https.request(reqOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', err => {
            const obj = {
                ok: false,
                message: err.message || "An error has occurred",
            };
            resolve(obj);
        });
        req.write(payload);
        req.end();
    });
};
const TextLink = {
    /**
     * Set the API key, so that the service knows that you are authorized to use it.
     * @param apiKey Unique key created using the [API Console](https://textlinksms.com/dashboard/api)
     * @example
     * TextLink.useKey("YOUR_API_KEY");
     */
    useKey(apiKey) {
        API_KEY.value = apiKey;
    },
    /**
     * Verifies the code that the customer has submitted.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param code Verification code that the user has submitted.
     * @returns A Promise resolving to the VerifyCodeResult.
     */
    verifyCode(phone_number, code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phone_number) {
                return { ok: false, message: "You have not specified the phone number. " };
            }
            if (!code) {
                return { ok: false, message: "You have not specified the verification code. " };
            }
            if (!API_KEY.value) {
                return { ok: false, message: "You have not specified the API key. Specify it by calling the useKey function. " };
            }
            const data = JSON.stringify({ phone_number, code });
            const result = yield returnEndpointPromise('/api/verify-code', data);
            return result;
        });
    },
    /**
     * Sends a phone number verification SMS to your customers.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param options Options about the verification process, including fields: service_name, expiration_time, source_country.
     * @returns A Promise resolving to the VerifyPhoneResult.
     */
    sendVerificationSMS(phone_number, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phone_number) {
                return { ok: false, message: "You have not specified the phone number. " };
            }
            if (!API_KEY.value) {
                return { ok: false, message: "You have not specified the API key. Specify it by calling the useKey function. " };
            }
            const data = JSON.stringify({
                phone_number,
                service_name: options === null || options === void 0 ? void 0 : options.service_name,
                expiration_time: options === null || options === void 0 ? void 0 : options.expiration_time,
                source_country: options === null || options === void 0 ? void 0 : options.source_country
            });
            const result = yield returnEndpointPromise('/api/send-code', data);
            return result;
        });
    },
    /**
     * Sends an SMS to a specified phone number.
     * @param phone_number Recipient's phone number, including the country calling code, like `+381617581234`.
     * @param text Message body to be sent.
     * @param source_country Optional ISO-2 code of the sender's phone number country.
     * @returns A Promise resolving to the SendMessageResult.
     */
    sendSMS(phone_number, text, source_country) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phone_number) {
                return { ok: false, queued: false, message: "You have not specified the recipient phone number. " };
            }
            if (!text) {
                return { ok: false, queued: false, message: "You have not specified the message body. " };
            }
            if (!API_KEY.value) {
                return { ok: false, queued: false, message: "You have not specified the API key. Specify it by calling the useKey function. " };
            }
            const data = JSON.stringify({ phone_number, text, source_country });
            const result = yield returnEndpointPromise('/api/send-sms', data);
            return result;
        });
    }
};
module.exports = TextLink;
