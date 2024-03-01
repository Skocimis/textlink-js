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
declare const TextLink: {
    /**
     * Set the API key, so that the service knows that you are authorized to use it.
     * @param apiKey Unique key created using the [API Console](https://textlinksms.com/dashboard/api)
     * @example
     * TextLink.useKey("YOUR_API_KEY");
     */
    useKey(apiKey: string): void;
    /**
     * Verifies the code that the customer has submitted.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param code Verification code that the user has submitted.
     * @returns A Promise resolving to the VerifyCodeResult.
     */
    verifyCode(phone_number: string, code: string): Promise<VerifyCodeResult>;
    /**
     * Sends a phone number verification SMS to your customers.
     * @param phone_number Phone number to verify, including country calling code, like `+381617581234`.
     * @param options Options about the verification process, including fields: service_name, expiration_time, source_country.
     * @returns A Promise resolving to the VerifyPhoneResult.
     */
    sendVerificationSMS(phone_number: string, options?: VerificationOptions): Promise<VerifyPhoneResult>;
    /**
     * Sends an SMS to a specified phone number.
     * @param phone_number Recipient's phone number, including the country calling code, like `+381617581234`.
     * @param text Message body to be sent.
     * @param source_country Optional ISO-2 code of the sender's phone number country.
     * @returns A Promise resolving to the SendMessageResult.
     */
    sendSMS(phone_number: string, text: string, source_country?: string): Promise<SendMessageResult>;
};
export = TextLink;
