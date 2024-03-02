# TextLink Node.js helper library

[![NPM](https://nodei.co/npm/textlink-sms.png?downloads=true&stars=true)](https://www.npmjs.com/package/textlink-sms)

### Supported Node.js Versions
* Node.js 18
* Node.js 20
* Node.js 21
* Node.js 22

## Installation
`npm install textlink-sms` or `yarn add textlink-sms`

## Sending an SMS

To send an SMS, you have to create an API key using the [TextLink API Console](https://textlinksms.com/dashboard/api). When you register an account, you automatically get an API key with 0.5$ of credits (for TextLink service) and 500 free messages (for [Use your device](https://docs.textlinksms.com/send-sms-through-your-phone) service).

### Just send a message

```javascript
const textlink = require("textlink-sms");
textlink.useKey("YOUR_API_KEY"); //You can create one in the API Console at https://textlinksms.com/dashboard/api

textlink.sendSMS("+381611231234", "Dummy message text...");
```

### Handle response

```javascript
async function async_function() {
  let result = await textlink.sendSMS("+381611231234", "Dummy message text...");
  console.log(result);
}
async_function();
```

### Example of the result of a successfully sent message

```json
{
    "ok": true
}
```

### Example of the result of an unsuccessfully sent message

```json
{
    "ok": false,
    "message": "API key not found"
}
```

## Verifying a phone number

You can also use our service to easily verify a phone number, without storing data about the phones that you are about to verify, because we can do it for you.

### Example usage

```js
//User has sent his phone number for verification
await textlink.sendVerificationSMS("+11234567890", verificationOptions);

//Show him the code submission form
//We will handle the verification code ourselves

//The user has submitted the code
const result = await textlink.verifyCode("+11234567890", "USER_ENTERED_CODE"); 
//if `result.ok` is true, then the phone number is verified. 
```

#### Verification options

`VerificationOptions` the optional argument for the `sendVerificationSMS` function. It contains the parameters of the verification code that should be sent:

`service_name` is what the user will see in the verification message, e. g. `"Your verification code for Guest is: CODE"`

`expiration_time` is how many miliseconds the code is valid. Default is 10 minutes.

`source_country` is the ISO-2 code of the sender's phone number country
```javascript
{
  service_name: "Guest",
  expiration_time: 10 * 60 * 1000,
  source_country: "US"
}
```

## Getting help

If you need help installing or using the library, please check the [FAQ](https://textlinksms.com) first, and contact us at [help@textlinksms.com](mailto://help@textlinksms.com) if you don't find an answer to your question.

If you've found a bug in the API, package or would like new features added, you are also free to contact us!
