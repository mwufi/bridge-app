import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';

type CommunityCardProps = {
    id: string;
    name: string;
    memberCount: number;
    image: any;
    onPress: (id: string) => void;
};

export function CommunityCard({ id, name, memberCount, image, onPress }: CommunityCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(id)}
        >
            <Image source={image} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.memberCount}>{memberCount.toLocaleString()} members</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    memberCount: {
        fontSize: 14,
        color: '#CCC',
    },
}); 