import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

export default function App() {
    const [isAppleAvailable, setIsAppleAvailable] = useState(false);

    useEffect(() => {
        const checkAppleAvailability = async () => {
            const isAvailable = await AppleAuthentication.isAvailableAsync();
            console.log('isAvailable', isAvailable);
            setIsAppleAvailable(isAvailable);
        };
        checkAppleAvailability();
    }, []);

    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' && isAppleAvailable && (
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={5}
                    style={styles.button}
                    onPress={async () => {
                        try {
                            const credential = await AppleAuthentication.signInAsync({
                                requestedScopes: [
                                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                ],
                            });
                            console.log(credential);
                            // signed in
                        } catch (e: any) {
                            if (e.code === 'ERR_REQUEST_CANCELED') {
                                // handle that the user canceled the sign-in flow
                            } else {
                                // handle other errors
                            }
                        }
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        height: 44,
    },
});
