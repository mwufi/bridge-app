import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import db from '@/lib/instant';
import { id } from '@instantdb/react-native';

import { ThemedText } from '@/components/ThemedText';

// Mock data for AI personalities
const aiPersonalities = [
  {
    id: '1',
    name: 'Ara',
    description: 'Your friendly AI assistant that can help with anything',
    image: require('@/assets/images/icon.png'),
    accent: '#FF3366',
    popular: true,
  },
  {
    id: '2',
    name: 'GenZ',
    description: 'Talks in current internet lingo and keeps things casual',
    image: require('@/assets/images/icon.png'),
    accent: '#4A2B87',
    popular: true,
  },
  {
    id: '3',
    name: 'Poet',
    description: 'Expresses ideas through beautiful, creative writing',
    image: require('@/assets/images/icon.png'),
    accent: '#2B4587',
  },
  {
    id: '4',
    name: 'Chef',
    description: 'Culinary expert with thousands of recipes and cooking tips',
    image: require('@/assets/images/icon.png'),
    accent: '#872B4A',
    popular: true,
  },
  {
    id: '5',
    name: 'Teacher',
    description: 'Patient explainer of complex concepts in simple terms',
    image: require('@/assets/images/icon.png'),
    accent: '#2B8745',
  },
  {
    id: '6',
    name: 'Traveler',
    description: 'Well-traveled guide with tips for destinations worldwide',
    image: require('@/assets/images/icon.png'),
    accent: '#87752B',
  },
  {
    id: '7',
    name: 'Friend',
    description: "Casual, supportive friend who's always there to listen",
    image: require('@/assets/images/icon.png'),
    accent: '#2B6487',
  },
];

export default function NewChatScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePersonalitySelect = async (personalityId: string) => {
    try {
      // Create a new conversation
      const conversationId = id();
      const personality = aiPersonalities.find(p => p.id === personalityId);

      await db.transact([
        db.tx.conversations[conversationId].update({
          data: {
            name: personality?.name || 'New Chat',
            botId: personalityId,
            createdAt: new Date().toISOString()
          }
        })
      ]);

      // Navigate to the new chat
      router.push({
        pathname: '/chat/[id]',
        params: { id: conversationId }
      });
    } catch (error) {
      console.error('Error creating new conversation:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderPersonalityItem = ({ item }: { item: typeof aiPersonalities[0] }) => (
    <TouchableOpacity
      style={[
        styles.personalityCard,
        { borderColor: item.accent }
      ]}
      onPress={() => handlePersonalitySelect(item.id)}
    >
      <View style={[styles.avatarContainer, { backgroundColor: item.accent }]}>
        <Image source={item.image} style={styles.avatar} />
      </View>

      <View style={styles.personalityInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.personalityName}>{item.name}</Text>
          {item.popular && (
            <View style={[styles.popularBadge, { backgroundColor: item.accent }]}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        <Text style={styles.personalityDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <FontAwesome name="chevron-right" size={16} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>New Chat</ThemedText>
      </View>

      <View style={styles.content}>
        <Text style={styles.prompt}>Who would you like to chat with?</Text>

        <FlatList
          data={aiPersonalities}
          renderItem={renderPersonalityItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.personalityList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 20,
  },
  personalityList: {
    paddingBottom: 20,
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  personalityInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  personalityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 8,
  },
  popularBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  personalityDescription: {
    fontSize: 14,
    color: '#AAA',
  },
});