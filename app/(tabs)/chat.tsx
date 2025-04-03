import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { Header } from '@/components/typography/header';
import db from '@/lib/instant';
import { id } from '@instantdb/react-native';


export default function ChatInboxScreen() {
  const router = useRouter();

  // Fetch conversations and their latest messages
  const { isLoading, error, data } = db.useQuery({
    conversations: {
      $: {
        order: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (error) {
    console.error("UH OH! Instant Error -- ", error.message + ". Look at the error for details", error);
  }

  const conversations = (data?.conversations || []);

  const handleConversationPress = (id: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id }
    });
  };

  const handleNewChatPress = () => {
    // Navigate to bot selection screen
    router.push('/chat/new');
  };

  const formatTime = (dateString: string | number) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderConversationItem = ({ item }: { item: any }) => {
    const lastMessage = item.data?.messages?.[0];
    const botInfo = item.data?.botInfo || { name: 'Ara', image: require('@/assets/images/icon.png') };

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item.id)}
      >
        <View style={styles.avatarContainer}>
          <Image source={botInfo.image} style={styles.avatar} />
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.botName}>{item.data?.name || botInfo.name}</Text>
            <Text style={styles.timeStamp}>
              {lastMessage ? formatTime(lastMessage.createdAt) : ''}
            </Text>
          </View>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
          >
            {lastMessage?.content || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Header style={{ paddingLeft: 0 }}>Messages</Header>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChatPress}>
          <FontAwesome name="pencil-square-o" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  newChatButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FF3366',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#AAA',
  },
});