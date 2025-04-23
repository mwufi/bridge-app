import React from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorScheme } from '@/lib/theme';

type ScrollToBottomButtonProps = {
    isVisible: boolean;
    onPress: () => void;
    theme: ColorScheme;
};

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
    isVisible,
    onPress,
    theme,
}) => {
    const insets = useSafeAreaInsets();
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: isVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    bottom: insets.bottom + 20,
                },
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                ]}
                onPress={onPress}
            >
                <FontAwesome
                    name="chevron-down"
                    size={20}
                    color={theme.input?.foreground || '#FFFFFF'}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
}); 