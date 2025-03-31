import React from 'react';
import { StyleSheet, ScrollView, Pressable, Text, ViewStyle, TextStyle } from 'react-native';

export type TabType = 'new' | 'all' | 'groups' | 'classes' | 'communities' | 'posts' | 'trending';

interface TabsFilterProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const tabs: { id: TabType; label: string }[] = [
    { id: 'new', label: 'New Messages' },
    { id: 'all', label: 'All' },
    { id: 'groups', label: 'Groups' },
    { id: 'classes', label: 'Classes' },
];

export function TabsFilter({ activeTab, onTabChange }: TabsFilterProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer as ViewStyle}
            contentContainerStyle={styles.tabs as ViewStyle}
        >
            {tabs.map(tab => (
                <Pressable
                    key={tab.id}
                    style={[
                        styles.tab as ViewStyle,
                        activeTab === tab.id && styles.activeTab as ViewStyle,
                    ]}
                    onPress={() => onTabChange(tab.id)}
                >
                    <Text
                        style={[
                            styles.tabText as TextStyle,
                            activeTab === tab.id && styles.activeTabText as TextStyle,
                        ]}
                    >
                        {tab.label}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        maxHeight: 55,
        paddingBottom: 10
    },
    tabs: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
        flexDirection: 'row',
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        height: 32,
        lineHeight: 20,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        color: '#9E9E9E',
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#2C3E50',
    },
}); 