// Node.js require:
const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true, async: true}); // options can be passed, e.g. {allErrors: true}

const s_signin = {
    type: "object",
    properties: {
        mobile: { type: "string" }
    },
    required: ["mobile"],
    additionalProperties: true,
};
const s_signout = {
    type: "object",
    properties: {
        mobile: { type: "string" }
    },
    required: ["mobile"],
    additionalProperties: true,
};

const s_generate_otp = {
    type: "object",
    properties: {
        mobile: { type: "string" }
    },
    required: ["mobile"],
    additionalProperties: false,
};

const s_verify_otp = {
    type: "object",
    properties: {
        otp: { type: "number" },
        mobile: { type: "string" }
    },
    required: ["mobile","otp"],
    additionalProperties: false,
};

// const validate = ajv.compile(schema);
// const valid = validate(data);
// if (!valid) console.log(validate.errors);
ajv.addSchema(s_signin, "signIn");
ajv.addSchema(s_signout, "signOut");
ajv.addSchema(s_generate_otp, "generateOTP");
ajv.addSchema(s_verify_otp, "verifyOTP");


module.exports = ajv;