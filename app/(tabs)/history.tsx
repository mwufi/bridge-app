import React from 'react';
import { StyleSheet, FlatList, Pressable, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
};

const mockHistory: ChatHistory[] = [
  {
    id: '1',
    title: 'Project Planning',
    lastMessage: "Let's break down the tasks for next week...",
    date: new Date(),
  },
  {
    id: '2',
    title: 'Creative Writing',
    lastMessage: "Here's a story about a magical forest...",
    date: new Date(Date.now() - 86400000), // 1 day ago
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: ChatHistory }) => (
    <Pressable
      style={({ pressed }) => [
        styles.historyItem,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={styles.historyContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <Text style={styles.date}>
          {item.date.toLocaleDateString()}
        </Text>
      </View>
      <FontAwesome name="angle-right" size={20} color="#666" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
  },
  historyContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  separator: {
    height: 12,
  },
});
