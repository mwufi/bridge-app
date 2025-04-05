import {
    GoogleOneTapSignIn,
    statusCodes,
    isErrorWithCode,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin';

// Somewhere in your code
export const signIn = async () => {
    try {
        await GoogleOneTapSignIn.checkPlayServices();
        const response = await GoogleOneTapSignIn.signIn();

        if (isSuccessResponse(response)) {
            // read user's info
            console.log(response.data);
            return {
                status: 'signedIn',
                user: response.data,
            }
        } else if (isNoSavedCredentialFoundResponse(response)) {
            // Android and Apple only.
            // No saved credential found (user has not signed in yet, or they revoked access)
            // call `createAccount()`
            return {
                status: 'noSavedCredentialFound',
            }
        }
    } catch (error) {
        console.error(error);
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.ONE_TAP_START_FAILED:
                    // Android-only, you probably have hit rate limiting.
                    // You can still call `presentExplicitSignIn` in this case.
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android: play services not available or outdated.
                    // Get more details from `error.userInfo`.
                    // Web: when calling an unimplemented api (requestAuthorization)
                    // or when the Google Client Library is not loaded yet.
                    break;
                default:
                // something else happened
            }
        } else {
            // an error that's not related to google sign in occurred
            return {
                status: 'error',
                error: error,
            }
        }
    }

    return {
        status: 'error',
        error: 'Unknown error',
    }
};

export const createAccount = async () => {
    const response = await GoogleOneTapSignIn.createAccount();

    if (isSuccessResponse(response)) {
        // read user's info
        console.log(response.data);
        return {
            status: 'signedIn',
            user: response.data,
        }
    }
    return {
        status: 'error',
        error: 'Unknown error',
    }
}