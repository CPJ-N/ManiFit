import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { exerciseCategories } from '../../constants/categories';
import { ROUTES } from '../../constants/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Card } from '../../../components/ui/card';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with 20px padding and 20px gap

interface Props {
  navigation: any;
}

// Enhanced Category Card Component
const CategoryCard = ({ 
  category, 
  onPress 
}: { 
  category: any; 
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.categoryCardWrapper}>
    <Card style={styles.categoryCard}>
      <LinearGradient
        colors={['#2A2A2A', '#333']}
        style={styles.categoryCardGradient}
      >
        <VStack space="md" style={styles.categoryCardContent}>
          {/* Category Image */}
          <View style={styles.categoryImageContainer}>
            <LinearGradient
              colors={['#FFD20A', '#FFA500']}
              style={styles.categoryImageGradient}
            >
              <Image source={category.image} style={styles.categoryImage} />
            </LinearGradient>
          </View>

          {/* Category Name */}
          <Text style={styles.categoryName}>
            {category.name.toUpperCase()}
          </Text>

          {/* Category Icon Arrow */}
          <View style={styles.categoryArrow}>
            <Ionicons name="chevron-forward" size={16} color="#FFD20A" />
          </View>
        </VStack>
      </LinearGradient>
    </Card>
  </TouchableOpacity>
);

export default function CategoriesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleCategoryPress = (category: any) => {
    navigation.navigate(ROUTES.EXERCISES, {
      categoryName: category.name,
      categoryImage: category.image,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.08)', 'transparent', 'rgba(255, 210, 10, 0.03)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Enhanced Header */}
      <Box style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <VStack space="md">
          {/* Back Button */}
          <HStack style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
          </HStack>

          {/* Header Content */}
          <VStack space="xs" style={styles.headerContent}>
            <HStack style={styles.headerTitleRow}>
              <Ionicons name="barbell" size={24} color="#FFD20A" />
              <Heading size="xl" style={styles.title}>
                Exercise Categories
              </Heading>
            </HStack>
            <Text style={styles.subtitle}>
              Choose a body part to work on and discover exercises
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Header */}
        <Card style={styles.statsCard}>
          <LinearGradient
            colors={['rgba(255, 210, 10, 0.1)', 'rgba(255, 210, 10, 0.05)']}
            style={styles.statsGradient}
          >
            <HStack space="lg" style={styles.statsContent}>
              <VStack style={styles.statItem}>
                <Text style={styles.statNumber}>{exerciseCategories.length}</Text>
                <Text style={styles.statLabel}>Categories</Text>
              </VStack>
              <View style={styles.statDivider} />
              <VStack style={styles.statItem}>
                <Text style={styles.statNumber}>100+</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </VStack>
              <View style={styles.statDivider} />
              <VStack style={styles.statItem}>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statLabel}>Possibilities</Text>
              </VStack>
            </HStack>
          </LinearGradient>
        </Card>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {exerciseCategories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </View>

        {/* Bottom Tip Card */}
        <Card style={styles.tipCard}>
          <LinearGradient
            colors={['#2A2A2A', '#333']}
            style={styles.tipGradient}
          >
            <HStack space="md" style={styles.tipContent}>
              <View style={styles.tipIconContainer}>
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.tipIconGradient}
                >
                  <Ionicons name="bulb" size={20} color="#1E1E1E" />
                </LinearGradient>
              </View>
              <VStack space="xs" style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipText}>
                  Start with compound exercises that work multiple muscle groups for maximum efficiency!
                </Text>
              </VStack>
            </HStack>
          </LinearGradient>
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitleRow: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  statsCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGradient: {
    padding: 20,
    borderRadius: 16,
  },
  statsContent: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD20A',
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCardWrapper: {
    width: cardWidth,
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryCardGradient: {
    padding: 20,
    borderRadius: 16,
    minHeight: 140,
  },
  categoryCardContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  categoryImageGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  categoryImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    flex: 1,
  },
  categoryArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipGradient: {
    padding: 20,
    borderRadius: 16,
  },
  tipContent: {
    alignItems: 'flex-start',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tipIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tipText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
}); 