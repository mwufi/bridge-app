import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

/**
 * TypingIndicator component displays animated dots to indicate typing activity
 */
const TypingIndicator = () => {
  // Create animated values for each dot
  const dot1Opacity = useRef(new Animated.Value(0.4)).current;
  const dot2Opacity = useRef(new Animated.Value(0.4)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;
  
  // Animation sequence
  const animateDots = () => {
    Animated.sequence([
      // Dot 1 animation
      Animated.timing(dot1Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease
      }),
      // Dot 2 animation
      Animated.timing(dot2Opacity, {
        toValue: 1, 
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease
      }),
      // Dot 3 animation
      Animated.timing(dot3Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.ease
      }),
      // Reset all dots
      Animated.parallel([
        Animated.timing(dot1Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.ease
        })
      ])
    ]).start(() => {
      // Loop the animation
      animateDots();
    });
  };
  
  // Start animation on mount
  useEffect(() => {
    animateDots();
    
    // Clean up the animation when unmounting
    return () => {
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
      dot3Opacity.stopAnimation();
    };
  }, []);
  
  return (
    <View style={styles.typingDots}>
      <Animated.View style={[styles.typingDot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  typingDots: {
    flexDirection: 'row',
    width: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 2,
  },
});

export default TypingIndicator;