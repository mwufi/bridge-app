import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
    children: ReactNode;
    style?: object;
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        display: 'flex',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
        lineHeight: 32,
    },
});

export function Header({ children, style }: HeaderProps) {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerTitle}>{children}</Text>
        </View>
    );
}