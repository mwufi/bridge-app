import * as AppleAuthentication from 'expo-apple-authentication';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ImageBackground, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
    const [isAppleAvailable, setIsAppleAvailable] = useState(false);
    const insets = useSafeAreaInsets();

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
            <ImageBackground
                source={require('@/assets/images/onboarding-1.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <StatusBar style="light" />
                <View style={[styles.overlay, { paddingTop: insets.top }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Ara</Text>
                        <Text style={styles.subtitle}>Connect with your world</Text>
                    </View>

                    <View style={styles.content}>
                        {Platform.OS === 'ios' && isAppleAvailable && (
                            <AppleAuthentication.AppleAuthenticationButton
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                                cornerRadius={8}
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
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(100, 0, 0, 0.1)',
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: 'white',
        opacity: 0.9,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    button: {
        width: 280,
        height: 44,
    },
});
