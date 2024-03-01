import * as https from 'https';

// Interface for the API key object
interface APIKey {
    value: string;
}

// Define a type for the function parameter in `returnEndpointPromise`
interface RequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: {
        'Content-Type': string;
        'Authorization': string;
    };
}

// Define a type for the response object
interface EndpointResponse {
    ok: boolean;
    queued?: boolean | null;
    message: string;
}

// Declare the API_KEY object with the APIKey interface
const API_KEY: APIKey = { value: "" };

/**
 * A helper function to make HTTPS requests to the TextLink API.
 * @param path The endpoint path.
 * @param payload The request payload as a string.
 * @returns A promise that resolves to the parsed response.
 */
const returnEndpointPromise = (path: string, payload: string): Promise<EndpointResponse> => {
    return new Promise(resolve => {
        let reqOptions: RequestOptions = {
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
            const obj: EndpointResponse = {
                ok: false,
                message: err.message || "An error has occurred",
            };
            resolve(obj);
        });
        req.write(payload);
        req.end();
    });
};

interface VerifyCodeResult {
    ok: boolean;
    message: string;
}

interface VerifyPhoneResult {
    ok: boolean;
    code?: string;
    message: string;
}

interface VerificationOptions {
    service_name?: string;
    expiration_time?: number;
    source_country?: string;
}

interface SendMessageResult {
    ok: boolean;
    queued?: boolean | null;
    message?: string;
}

const TextLink = {
    /**
     * Set the API key, so that the service knows that you are authorized to use it.
     * @param apiKey Unique key created using the [API Console](https://textlinksms.com/dashboard/api)
     * @example
     * TextLink.useKey("YOUR_API_KEY");
     */
    useKey(apiKey: string): void {
        API_KEY.value = apiKey;
    },
    /**
     * Verifies the code that the customer has submitted.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param code Verification code that the user has submitted.
     * @returns A Promise resolving to the VerifyCodeResult.
     */
    async verifyCode(phone_number: string, code: string): Promise<VerifyCodeResult> {
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
        const result = await returnEndpointPromise('/api/verify-code', data);
        return result;
    },
    /**
     * Sends a phone number verification SMS to your customers.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param options Options about the verification process, including fields: service_name, expiration_time, source_country.
     * @returns A Promise resolving to the VerifyPhoneResult.
     */
    async sendVerificationSMS(
        phone_number: string,
        options?: VerificationOptions
    ): Promise<VerifyPhoneResult> {
        if (!phone_number) {
            return { ok: false, message: "You have not specified the phone number. " };
        }

        if (!API_KEY.value) {
            return { ok: false, message: "You have not specified the API key. Specify it by calling the useKey function. " };
        }

        const data = JSON.stringify({
            phone_number,
            service_name: options?.service_name,
            expiration_time: options?.expiration_time,
            source_country: options?.source_country
        });
        const result = await returnEndpointPromise('/api/send-code', data);
        return result;
    },
    /**
     * Sends an SMS to a specified phone number.
     * @param phone_number Recipient's phone number, including the country calling code, like `+381617581234`.
     * @param text Message body to be sent.
     * @param source_country Optional ISO-2 code of the sender's phone number country.
     * @returns A Promise resolving to the SendMessageResult.
     */
    async sendSMS(
        phone_number: string,
        text: string,
        source_country?: string
    ): Promise<SendMessageResult> {
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
        const result = await returnEndpointPromise('/api/send-sms', data);
        return result;
    }
};


export = TextLink;
