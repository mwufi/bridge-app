import React, { useState } from 'react';
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { TabsFilter, TabType } from '@/components/TabsFilter';
import { Header } from '@/components/typography/header';

// Mock data for search results
const mockBots = [
  { id: '1', name: 'Ara', description: 'Your main AI companion', image: require('@/assets/images/icon.png') },
  { id: '2', name: 'GenZ', description: 'Talks like a Gen Z', image: require('@/assets/images/icon.png') },
  { id: '3', name: 'Poet', description: 'Creates beautiful poetry', image: require('@/assets/images/icon.png') },
  { id: '4', name: 'Chef', description: 'Cooking and recipe expert', image: require('@/assets/images/icon.png') },
];

const mockMessages = [
  { id: '1', botName: 'Ara', content: 'Here are some great books on machine learning...', date: '2 days ago' },
  { id: '2', botName: 'Chef', content: 'The recipe for pasta carbonara includes...', date: '1 week ago' },
  { id: '3', botName: 'Poet', content: 'Roses are red, violets are blue...', date: '2 weeks ago' },
];

const mockWebsites = [
  { id: '1', title: 'Introduction to AI', url: 'ai-intro.com', snippet: 'Learn about the basics of artificial intelligence...' },
  { id: '2', title: 'Machine Learning Guide', url: 'ml-guide.com', snippet: 'A comprehensive guide to machine learning...' },
];

type SearchResultItem = {
  id: string;
  type: 'bot' | 'message' | 'website';
  data: any;
};

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Custom tab options for search
  const searchTabs = [
    { id: 'all' as TabType, label: 'All' },
    { id: 'bots' as TabType, label: 'Bots' },
    { id: 'messages' as TabType, label: 'Messages' },
    { id: 'websites' as TabType, label: 'Websites' },
  ];

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    let results: SearchResultItem[] = [];

    // Filter based on active tab
    if (activeTab === 'all' || activeTab === 'bots') {
      const filteredBots = mockBots.filter(
        bot => bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bot.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      results = [...results, ...filteredBots.map(bot => ({ id: `bot-${bot.id}`, type: 'bot', data: bot }))];
    }

    if (activeTab === 'all' || activeTab === 'messages') {
      const filteredMessages = mockMessages.filter(
        msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      results = [...results, ...filteredMessages.map(msg => ({ id: `msg-${msg.id}`, type: 'message', data: msg }))];
    }

    if (activeTab === 'all' || activeTab === 'websites') {
      const filteredWebsites = mockWebsites.filter(
        web => web.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          web.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          web.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      );
      results = [...results, ...filteredWebsites.map(web => ({ id: `web-${web.id}`, type: 'website', data: web }))];
    }

    setSearchResults(results);
    setHasSearched(true);
  };

  const renderSearchResult = ({ item }: { item: SearchResultItem }) => {
    switch (item.type) {
      case 'bot':
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/chat?id=${item.data.id}`)}
          >
            <Image source={item.data.image} style={styles.botImage} />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{item.data.name}</Text>
              <Text style={styles.resultDescription}>{item.data.description}</Text>
            </View>
          </TouchableOpacity>
        );

      case 'message':
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/chat?id=${item.data.botName.toLowerCase()}&message=${item.data.id}`)}
          >
            <View style={styles.messageIconContainer}>
              <FontAwesome name="comment" size={24} color="#FFF" />
            </View>
            <View style={styles.resultTextContainer}>
              <View style={styles.messageHeader}>
                <Text style={styles.resultTitle}>{item.data.botName}</Text>
                <Text style={styles.messageDate}>{item.data.date}</Text>
              </View>
              <Text style={styles.resultDescription} numberOfLines={2}>{item.data.content}</Text>
            </View>
          </TouchableOpacity>
        );

      case 'website':
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => console.log('Open website or create chat about website')}
          >
            <View style={styles.websiteIconContainer}>
              <FontAwesome name="globe" size={24} color="#FFF" />
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{item.data.title}</Text>
              <Text style={styles.websiteUrl}>{item.data.url}</Text>
              <Text style={styles.resultDescription} numberOfLines={2}>{item.data.snippet}</Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <Header>Search</Header>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for bots, messages, websites..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome name="search" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <TabsFilter
        activeTab={activeTab as TabType}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (hasSearched) {
            handleSearch();
          }
        }}
      />

      {!hasSearched ? (
        <View style={styles.emptyStateContainer}>
          <Image source={require('@/assets/images/empty-state.png')} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateText}>Search for bots, messages, or websites</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No results found for "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
  },
  searchButton: {
    backgroundColor: '#FF3366',
    width: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  botImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A2B87',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  websiteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2B4587',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#CCC',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 12,
    color: '#888',
  },
  websiteUrl: {
    fontSize: 12,
    color: '#FF3366',
    marginBottom: 4,
  },
});