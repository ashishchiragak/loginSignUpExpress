let SUCCESS = {
    DEFAULT_SUCCESS: "operation Successful",
};

let ERROR = {
    NO_ACCESS_TOKEN: 'access token is required',
    INVALID_ACCESS_TOKEN: 'you are not authorised.',
    WRONG_PASSWORD: 'Please enter valid password.',
    INVALID_EMAIL: 'Please enter valid email.',
    INVALID_URL: 'you have entered invalid URL.',
    INVALID_INPUT: 'you have entered invalid INPUT.',// must be handled by app
    EMAIL_ALREADY_EXISTS: 'entered email already registered with us.',
    PHONE_NO_ALREADY_EXISTS: 'entered phone number already registered with us.',
    CAMERA_IDS_ALREADY_EXISTS: 'entered phone number already registered with us.',
    USER_ALREADY_EXISTS: 'user already registered with us.',
    DELETED: 'Your account has been deleted by the admin.',
    BLOCK_USER: 'Your account has been suspended by the admin.',
    VERIFY_EMAIL: 'Verify your email first to login.',
    WRONG_OTP: 'Please enter valid OTP.',
    USER_NOT_FOUND: 'user not found.',
    DEFAULT: 'SOMETHING_WENT_WRONG',
    EMAIL_NOT_VERIFIED: 'Verify your email first to login.',
};

module.exports = {
    SUCCESS: SUCCESS,
    ERROR: ERROR,
};