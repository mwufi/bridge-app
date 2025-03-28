import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

type Category = 'All' | 'Inbox' | 'Finance' | 'Code' | 'Recurring';

type Task = {
    id: string;
    title: string;
    category: Category;
    schedule?: string;
    icon?: string;
};

const tasks: Task[] = [
    {
        id: '1',
        title: 'Summarize emails',
        category: 'Inbox',
        schedule: 'Daily 9 am',
        icon: '✉️',
    },
    {
        id: '2',
        title: 'Research new AI startups',
        category: 'Inbox',
        icon: '🌐',
    },
    {
        id: '3',
        title: 'Revenue report',
        category: 'Finance',
        schedule: 'Daily 9 am',
        icon: '💰',
    },
    {
        id: '4',
        title: 'Code review',
        category: 'Code',
        icon: '💻',
    },
];

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [user, setUser] = useState({ name: 'John Doe', firstName: 'John' });

    const filteredTasks = tasks.filter(
        task => selectedCategory === 'All' || task.category === selectedCategory
    );

    const handleTaskPress = (task: Task) => {
        router.push({
            pathname: '/chat',
            params: { taskId: task.id, title: task.title }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome, {user.firstName}</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {['All', 'Inbox', 'Finance', 'Code', 'Recurring'].map((category) => (
                        <Pressable
                            key={category}
                            onPress={() => setSelectedCategory(category as Category)}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <ScrollView style={styles.taskList}>
                    {filteredTasks.map((task) => (
                        <Pressable
                            key={task.id}
                            style={styles.taskItem}
                            onPress={() => handleTaskPress(task)}
                        >
                            <View style={styles.taskLeft}>
                                <View style={styles.checkbox} />
                                <View style={styles.taskContent}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    {task.schedule && (
                                        <Text style={styles.taskSchedule}>
                                            <FontAwesome name="clock-o" size={12} color="#999" /> {task.schedule}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <View style={styles.taskRight}>
                                <Text style={styles.taskIcon}>{task.icon}</Text>
                                <FontAwesome name="angle-right" size={16} color="#999" />
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    categoryScroll: {
        paddingHorizontal: 16,
        marginVertical: 16,
        maxHeight: 32,
    },
    categoryButton: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    categoryButtonActive: {
        backgroundColor: '#000',
    },
    categoryText: {
        color: '#666',
        fontSize: 15,
    },
    categoryTextActive: {
        color: '#fff',
    },
    taskList: {
        flex: 1,
        padding: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: 12,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 17,
        marginBottom: 4,
    },
    taskSchedule: {
        fontSize: 13,
        color: '#999',
    },
    taskRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    taskIcon: {
        fontSize: 16,
    },
}); 