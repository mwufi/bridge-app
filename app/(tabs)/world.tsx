import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { Header } from '@/components/typography/header';
import { CommunityCard } from '@/components/CommunityCard';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';

// Mock data for communities
const mockCommunities = [
  { id: '1', name: 'AI Enthusiasts', memberCount: 1245, image: require('@/assets/images/icon.png') },
  { id: '2', name: 'Coding Help', memberCount: 876, image: require('@/assets/images/icon.png') },
  { id: '3', name: 'Book Club', memberCount: 532, image: require('@/assets/images/icon.png') },
  { id: '4', name: 'Travel Stories', memberCount: 1893, image: require('@/assets/images/icon.png') },
];

export default function WorldScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState(mockCommunities);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCommunity = (name: string, description: string) => {
    const newCommunity = {
      id: String(communities.length + 1),
      name,
      memberCount: 0,
      image: require('@/assets/images/icon.png'),
    };
    setCommunities([newCommunity, ...communities]);
  };

  const handleCommunityPress = (id: string) => {
    router.push(`/community/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <Header>Communities</Header>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <FontAwesome name="search" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {filteredCommunities.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <FontAwesome name="users" size={48} color="#888" />
          <Text style={styles.emptyStateText}>
            {searchQuery.trim() !== ''
              ? `No communities found for "${searchQuery}"`
              : 'Join or create a community to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCommunities}
          renderItem={({ item }) => (
            <CommunityCard
              id={item.id}
              name={item.name}
              memberCount={item.memberCount}
              image={item.image}
              onPress={handleCommunityPress}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.communitiesList}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <FontAwesome name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <CreateCommunityModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreateCommunity={handleCreateCommunity}
      />
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
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  communitiesList: {
    padding: 16,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});