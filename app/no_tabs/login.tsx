import * as AppleAuthentication from 'expo-apple-authentication';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ImageBackground, Text, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import {
    GoogleOneTapSignIn,
    type OneTapUser,
} from '@react-native-google-signin/google-signin';
import { createAccount, signIn } from '@/lib/google/login';

type AppleUser = {
    user: string;
    identityToken: string;
}

export default function App() {
    const [isAppleAvailable, setIsAppleAvailable] = useState(false);
    const [storedUser, setStoredUser] = useState<string | null>(null);
    const [storedToken, setStoredToken] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const insets = useSafeAreaInsets();

    const [googleUser, setGoogleUser] = useState<OneTapUser | null>(null);
    const [appleUser, setAppleUser] = useState<AppleUser | null>(null);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const scriptTag = document.createElement('script');
            scriptTag.src = 'https://accounts.google.com/gsi/client';
            scriptTag.async = true;
            scriptTag.onload = () => {
                setLoaded(true);
                console.log('Google Sign-In script loaded');
            };
            scriptTag.onerror = (error) => {
                console.error('Failed to load Google script:', error);
            };

            document.body.appendChild(scriptTag);
            return () => {
                document.body.removeChild(scriptTag);
            };
        }
        const checkAppleAvailability = async () => {
            const isAvailable = await AppleAuthentication.isAvailableAsync();
            console.log('isAvailable', isAvailable);
            setIsAppleAvailable(isAvailable);
        };
        const loadStoredAuth = async () => {
            const user = await SecureStore.getItemAsync('user');
            const token = await SecureStore.getItemAsync('identityToken');
            if (user && token) {
                setAppleUser({
                    user: user,
                    identityToken: token,
                });
            }
        };
        checkAppleAvailability();
        loadStoredAuth();
    }, []);

    useEffect(() => {
        // this init is done on iOS only
        if (Platform.OS === 'web') return;

        GoogleOneTapSignIn.configure({
            iosClientId: '477687467226-1el8soi6fth8mklcl8oapmnss15q6m0b.apps.googleusercontent.com',
            webClientId: '477687467226-n0pvp7akpvvh1bsitf65dg65lp2j2sfs.apps.googleusercontent.com',
        });

        const doGoogleSignIn = async () => {
            const result = await signIn();
            console.log('result', result);
            if (result.status === 'signedIn') {
                setGoogleUser(result.user!);
            }
        };
        doGoogleSignIn();
    }, []);

    useEffect(() => {
        // this init is done on web only
        if (Platform.OS !== 'web' || !loaded) return;

        GoogleOneTapSignIn.configure({
            iosClientId: '477687467226-1el8soi6fth8mklcl8oapmnss15q6m0b.apps.googleusercontent.com',
            webClientId: '477687467226-n0pvp7akpvvh1bsitf65dg65lp2j2sfs.apps.googleusercontent.com',
        });

        GoogleOneTapSignIn.signIn(
            {
                ux_mode: 'popup',
            },
            {
                onResponse: (response) => {
                    if (response.type === 'success') {
                        console.log(response.data);
                    }
                },
                onError: (error) => {
                    // handle error
                    console.log('error', error);
                },
                momentListener: (moment: any) => {
                    console.log('moment', moment);
                },
            },
        );

    }, [loaded]);

    const loggedIn = appleUser || googleUser;

    const handleGoogleSignIn = async () => {
        if (Platform.OS === 'web') {
            GoogleOneTapSignIn.signIn(
                {
                    ux_mode: 'popup',
                },
                {
                    onResponse: (response) => {
                        if (response.type === 'success') {
                            console.log(response.data);
                        }
                    },
                    onError: (error) => {
                        // handle error
                        console.log('error', error);
                    },
                    momentListener: (moment: any) => {
                        console.log('moment', moment);
                    },
                },
            );
            return;
        }

        // universal sign in
        const result = await signIn();
        console.log('result', result);
        if (result.status === 'noSavedCredentialFound') {
            const result = await createAccount();
            console.log('result', result);
            if (result.status === 'signedIn') {
                setGoogleUser(result.user!);
            }
        }
        if (result.status === 'signedIn') {
            setGoogleUser(result.user!);
        }
    };

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

                    {googleUser && (
                        <View style={styles.content}>
                            <Text style={styles.loggedInText}>Welcome back, {googleUser.user.email}</Text>
                            <Pressable
                                style={styles.signOutButton}
                                onPress={async () => {
                                    await GoogleOneTapSignIn.signOut(googleUser.user.id);
                                    setGoogleUser(null);
                                }}
                            >
                                <Text style={styles.signOutButtonText}>Sign Out</Text>
                            </Pressable>
                        </View>
                    )}

                    {appleUser && (
                        <View style={styles.content}>
                            <Text style={styles.loggedInText}>Welcome back, {appleUser.user}</Text>
                        </View>
                    )}

                    {false ? (
                        <View style={styles.content}>
                            <Text style={styles.loggedInText}>Welcome back, {appleUser?.identityToken}</Text>
                        </View>
                    ) : (
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

                                            if (credential.identityToken) {
                                                // Store auth tokens securely
                                                await SecureStore.setItemAsync('identityToken', credential.identityToken);
                                                await SecureStore.setItemAsync('user', credential.user);

                                                // Create user data object
                                                const userData = {
                                                    id: credential.user,
                                                    email: credential.email,
                                                    fullName: credential.fullName ?
                                                        `${credential.fullName.givenName} ${credential.fullName.familyName}` :
                                                        null,
                                                };

                                                // TODO: Send to your backend
                                                // await createOrUpdateUser(userData);

                                                // Navigate to main app
                                                router.replace('/');
                                            }
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

                            <Pressable
                                style={styles.googleButton}
                                onPress={handleGoogleSignIn}
                            >
                                <Image
                                    source={require('@/assets/images/google-logo.webp')}
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.googleButtonText}>Sign in with Google</Text>
                            </Pressable>

                        </View>
                    )}

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
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // Android shadow
        elevation: 4,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
        width: 280,
        height: 44,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        // Android shadow
        elevation: 8,
        // Subtle gradient-like effect with a slightly lighter top
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    googleIcon: {
        width: 18,
        height: 18,
        marginRight: 12,
        tintColor: 'white',
    },
    googleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    loggedInText: {
        color: 'white',
        fontSize: 28,
        textAlign: 'center',
    },
    signOutButton: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    signOutButtonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
});
