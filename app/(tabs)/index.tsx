import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/typography/header';
import { GemsModal } from '@/components/GemsModal';

// Sample data for stories (frequently chatted bots)
const stories = [
  { id: '1', name: 'Ara', image: require('@/assets/images/icon.png') },
  { id: '2', name: 'Zen', image: require('@/assets/images/icon.png') },
  { id: '3', name: 'GenZ', image: require('@/assets/images/icon.png') },
  { id: '4', name: 'Poet', image: require('@/assets/images/icon.png') },
  { id: '5', name: 'Chef', image: require('@/assets/images/icon.png') },
  { id: '6', name: 'Friend', image: require('@/assets/images/icon.png') },
];

// Sample user stats
const userStats = {
  goalsCompleted: 2,
  totalGoals: 7,
  streakDays: 5,
  nextMilestone: "Gold Badge",
  progress: 75, // percentage
};

// Sample todo items
const todoItems = [
  { id: '1', title: 'Morning meditation', completed: true },
  { id: '2', title: 'Read 30 minutes', completed: true },
  { id: '3', title: 'Write in journal', completed: false },
  { id: '4', title: 'Evening walk', completed: false },
];

// Sample news items
const newsItems = [
  {
    id: '1',
    title: 'New AI Research Shows Promising Results',
    source: 'Tech Daily',
    time: '2h ago',
    image: require('@/assets/images/icon.png')
  },
  {
    id: '2',
    title: 'Study Shows Benefits of Daily Meditation',
    source: 'Health Weekly',
    time: '5h ago',
    image: require('@/assets/images/icon.png')
  },
];

// Topics
const topicSuggestions = [
  { id: '1', title: 'Books to read this summer' },
  { id: '2', title: 'Productivity tips' },
  { id: '3', title: 'Creative writing prompts' },
  { id: '4', title: 'Local hiking trails' },
];

// hide Stories section
const displayStories = false;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showGemsModal, setShowGemsModal] = useState(false);

  // Animation values for visualizer
  const [visualizerHeights] = useState(
    [...Array(5)].map(() => new Animated.Value(5))
  );

  useEffect(() => {
    // Create an animation for the visualizer
    if (isInputModalVisible) {
      const animations = visualizerHeights.map(height => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(height, {
              toValue: 5 + Math.random() * 30,
              duration: 500 + Math.random() * 500,
              useNativeDriver: false,
            }),
            Animated.timing(height, {
              toValue: 5,
              duration: 500 + Math.random() * 500,
              useNativeDriver: false,
            }),
          ])
        );
      });

      Animated.parallel(animations).start();
    }

    return () => {
      visualizerHeights.forEach(anim => anim.stopAnimation());
    };
  }, [isInputModalVisible]);

  const handleStoryPress = (id: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id }
    });
  };

  const handlePersistentInputPress = () => {
    setIsInputModalVisible(true);
  };

  const handleInputSubmit = () => {
    const trimmedText = inputText.trim().toLowerCase();

    if (trimmedText) {
      // Handle navigation based on input commands
      if (trimmedText === 'chat') {
        // Navigate to chat inbox
        router.push('/chat');
      } else if (trimmedText.startsWith('chat ')) {
        // Extract bot name/id and navigate to specific chat
        const botName = trimmedText.substring(5).trim();
        let botId = '1'; // Default to Ara

        // Find matching bot by name
        stories.forEach(story => {
          if (story.name.toLowerCase() === botName) {
            botId = story.id;
          }
        });

        router.push({
          pathname: '/chat/[id]',
          params: { id: botId }
        });
      } else if (trimmedText === 'search') {
        // Navigate to search page
        router.push('/search');
      } else if (trimmedText === 'profile' || trimmedText === 'settings') {
        // Navigate to profile/settings
        router.push('/profile');
      } else {
        // Default: search with Ara (chat with Ara about this topic)
        router.push({
          pathname: '/chat/[id]',
          params: { id: '1', topic: trimmedText }
        });
      }

      // Reset state
      setIsInputModalVisible(false);
      setInputText('');
    }
  };

  const renderTopicSuggestion = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.topicItem}
      onPress={() => handleStoryPress('1')} // Navigate to Ara with this topic
    >
      <Text style={styles.topicText}>{item.title}</Text>
      <FontAwesome name="chevron-right" size={14} color="#888" />
    </TouchableOpacity>
  );

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  return (
    <SafeAreaView style={[styles.container]} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 10) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting section with Gems */}
        <View style={styles.headerContainer}>
          <Header>Hey, Zen</Header>
          <TouchableOpacity
            style={styles.gemsContainer}
            onPress={() => setShowGemsModal(true)}
          >
            <FontAwesome name="diamond" size={16} color="#4FACFE" />
            <Text style={styles.gemsText}>523</Text>
          </TouchableOpacity>
        </View>

        {/* Stories section (Instagram-like) */}
        {displayStories && (
          <View style={styles.storiesSection}>
            <ThemedText style={styles.sectionTitle}>Favorites</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
              {stories.map((story) => (
                <TouchableOpacity
                  key={story.id}
                  style={styles.storyContainer}
                  onPress={() => handleStoryPress(story.id)}
                >
                  <View style={styles.storyImageContainer}>
                    <Image source={story.image} style={styles.storyImage} />
                  </View>
                  <Text style={styles.storyName}>{story.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>Progress</ThemedText>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <View>
                <Text style={styles.statsTitle}>Today's Goals</Text>
                <Text style={styles.statsSubtitle}>{userStats.goalsCompleted}/{userStats.totalGoals} completed</Text>
              </View>
              <View style={styles.streakContainer}>
                <FontAwesome name="fire" size={16} color="#FF9500" />
                <Text style={styles.streakText}>{userStats.streakDays} days</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${userStats.progress}%` }]} />
            </View>

            <View style={styles.milestoneContainer}>
              <Text style={styles.milestoneText}>Next: {userStats.nextMilestone}</Text>
              <Text style={styles.percentageText}>{formatPercentage(userStats.progress)}</Text>
            </View>
          </View>
        </View>

        {/* Todo List Section */}
        <View style={styles.todoSection}>
          <ThemedText style={styles.sectionTitle}>Tasks</ThemedText>
          <View style={styles.todoCard}>
            {todoItems.map((item) => (
              <View key={item.id} style={styles.todoItem}>
                <View style={styles.todoCheckbox}>
                  {item.completed ? (
                    <FontAwesome name="check-circle" size={20} color="#FF3366" />
                  ) : (
                    <FontAwesome name="circle-thin" size={20} color="#888" />
                  )}
                </View>
                <Text style={[
                  styles.todoText,
                  item.completed && styles.todoCompleted
                ]}>
                  {item.title}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addTodoButton}>
              <FontAwesome name="plus" size={14} color="#FFF" />
              <Text style={styles.addTodoText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* For You Section */}
        <View style={styles.forYouSection}>
          <ThemedText style={styles.sectionTitle}>For You</ThemedText>

          {/* Topics sub-section */}
          <View style={styles.subsectionContainer}>
            <Text style={styles.subsectionTitle}>Topics to Explore</Text>
            <View style={styles.topicsContainer}>
              {topicSuggestions.map(renderTopicSuggestion)}
            </View>
          </View>

          {/* News sub-section */}
          <View style={styles.subsectionContainer}>
            <Text style={styles.subsectionTitle}>Latest News</Text>
            {newsItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.newsItem}>
                <Image source={item.image} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsSource}>{item.source}</Text>
                    <Text style={styles.newsTime}>{item.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Friends Map placeholder */}
          <View style={styles.subsectionContainer}>
            <Text style={styles.subsectionTitle}>Updates from Friends</Text>
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <FontAwesome name="map-marker" size={24} color="#FF3366" />
                <Text style={styles.mapText}>Friend activity map</Text>
              </View>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent input button */}
      <TouchableOpacity
        style={[styles.persistentInputButton, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}
        onPress={handlePersistentInputPress}
      >
        <Text style={styles.persistentInputText}>Ask me anything...</Text>
      </TouchableOpacity>

      {/* Gems Congratulations Modal */}
      <GemsModal
        visible={showGemsModal}
        onClose={() => setShowGemsModal(false)}
        gemCount={523}
      />

      {/* Input Modal with Keyboard Avoiding View */}
      <Modal
        visible={isInputModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsInputModalVisible(false)}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.modalContainer}>
          {/* Ara Animation Area */}
          <TouchableOpacity
            style={styles.modalAraArea}
            activeOpacity={1}
            onPress={() => setIsInputModalVisible(false)}
          >
            <View style={styles.araAnimationContainer}>
              <View style={styles.araAvatar}>
                <Image source={require('@/assets/images/icon.png')} style={styles.araImage} />
              </View>
              <Text style={styles.araListeningText}>Ara is listening...</Text>

              {/* Visualizer bars - animated */}
              <View style={styles.visualizerContainer}>
                {visualizerHeights.map((height, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.visualizerBar,
                      { height, backgroundColor: `rgba(255, 51, 102, 0.8)` }
                    ]}
                  />
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Input Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.modalInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#888"
                value={inputText}
                onChangeText={setInputText}
                autoFocus
                multiline
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.searchButton]}
                  onPress={handleInputSubmit}
                >
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.noteButton]}
                  onPress={handleInputSubmit}
                >
                  <Text style={styles.buttonText}>Save as Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100, // Space for persistent input
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  gemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  gemsText: {
    color: '#4FACFE',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  storiesSection: {
    marginVertical: 10,
  },
  storiesScroll: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 70,
  },
  storyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  storyName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  // Stats section
  statsSection: {
    marginTop: 15,
  },
  statsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3366',
    borderRadius: 4,
  },
  milestoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  milestoneText: {
    color: '#888',
    fontSize: 14,
  },
  percentageText: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '600',
  },
  // Todo section
  todoSection: {
    marginTop: 5,
  },
  todoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  todoCheckbox: {
    marginRight: 12,
  },
  todoText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  todoCompleted: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  addTodoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 12,
  },
  addTodoText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  // For You section
  forYouSection: {
    marginTop: 5,
    paddingBottom: 20,
  },
  subsectionContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  subsectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  // Topics
  topicsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  topicText: {
    color: '#FFF',
    fontSize: 15,
  },
  // News
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  newsTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newsSource: {
    color: '#FF3366',
    fontSize: 13,
  },
  newsTime: {
    color: '#888',
    fontSize: 13,
  },
  // Map
  mapContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  mapText: {
    color: '#888',
    marginTop: 8,
  },
  viewAllButton: {
    padding: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FF3366',
    fontWeight: '500',
  },
  // Persistent input
  persistentInputButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  persistentInputText: {
    color: '#888',
    fontSize: 16,
  },
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalAraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  araAnimationContainer: {
    alignItems: 'center',
  },
  araAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  araImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  araListeningText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  visualizerContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  visualizerBar: {
    width: 5,
    marginHorizontal: 3,
    borderRadius: 2.5,
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    maxHeight: 150,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  searchButton: {
    backgroundColor: '#FF3366',
  },
  noteButton: {
    backgroundColor: '#4A2B87',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});