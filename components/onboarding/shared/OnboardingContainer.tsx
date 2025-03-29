import React from 'react';
import {
    View,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';

interface OnboardingContainerProps {
    children: React.ReactNode;
    picture?: string;
}

const OnboardingContainer = ({ children, picture }: OnboardingContainerProps) => {
    return (
        <View style={styles.fullScreen}>
            <ImageBackground
                source={picture || require('../../../assets/images/onboarding-1.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    style={styles.content}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
                >
                    {children}
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: '100%',
        left: 0,
        top: 0,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 10,
        minHeight: 10,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
});

export default OnboardingContainer; 