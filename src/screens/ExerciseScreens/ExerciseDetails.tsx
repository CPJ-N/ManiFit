import { useRoute } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar as RNStatusBar,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Exercise, ExerciseDetails } from '../../constants/dataModels/exercise.model';
import { EXERCISE_EDIT } from '../../constants/screenNames';
import { Ionicons } from '@expo/vector-icons'; 
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

const { width, height } = Dimensions.get('window');

// Enhanced Stat Card Component
const StatCard = ({ 
  icon, 
  value, 
  label,
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
}: {
  icon: string;
  value: string | number;
  label: string;
  gradient?: [string, string, ...string[]];
}) => (
  <Box style={{ flex: 1, margin: 6 }}>
    <View 
      style={{
        borderRadius: 16,
        backgroundColor: '#FFD20A', // Solid background for shadow optimization
        shadowColor: '#FFD20A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={gradient}
        style={{
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          minHeight: 80,
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon as any} size={20} color="#1E1E1E" style={{ marginBottom: 6 }} />
        <Text 
          style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: '#1E1E1E',
            marginBottom: 2,
          }}
        >
          {value}
        </Text>
        <Text 
          style={{ 
            fontSize: 11, 
            color: '#1E1E1E', 
            opacity: 0.8,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </View>
  </Box>
);

// Section Card Component
const SectionCard = ({ 
  title, 
  children, 
  icon 
}: {
  title: string;
  children: React.ReactNode;
  icon: string;
}) => (
  <Box className="px-4 py-4">
    <HStack className="items-center mb-4" style={{ paddingHorizontal: 8 }}>
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(255, 210, 10, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon as any} size={16} color="#FFD20A" />
      </Box>
      <Heading size="lg" className="font-bold" style={{ color: '#FFFFFF' }}>
        {title}
      </Heading>
    </HStack>
    <Card 
      className="p-0" 
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Box className="p-5">
        {children}
      </Box>
    </Card>
  </Box>
);

// Instruction Step Component
const InstructionStep = ({ step, index }: { step: string; index: number }) => (
  <HStack className="mb-4 items-start">
    <LinearGradient
      colors={['#FFD20A', '#FFA500']}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E1E1E' }}>
        {index + 1}
      </Text>
    </LinearGradient>
    <Text
      style={{
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 22,
        fontWeight: '400',
      }}
    >
      {step}
    </Text>
  </HStack>
);

// Muscle Tag Component
const MuscleTag = ({ muscle }: { muscle: string }) => (
  <LinearGradient
    colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 210, 10, 0.3)',
    }}
  >
    <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFD20A' }}>
      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
    </Text>
  </LinearGradient>
);

export default function ExcerciseDetails ({route, navigation} : {route: any, navigation: any}) {
  const exerciseInfo = (route.params as { exerciseInfo?: Exercise & Partial<ExerciseDetails> })?.exerciseInfo;
  const [imageNum, setImageNum] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleImageNum = () => {
    setImageNum(prevNum => prevNum === 0 ? 1 : 0);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEdit = (exerciseInfo: Exercise & Partial<ExerciseDetails>) => {
    navigation.navigate(EXERCISE_EDIT, { exerciseInfo });
    console.log(`Edit Exercise: ${exerciseInfo.id}`);
  };
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background that covers safe area */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 210, 10, 0.05)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 10,
          paddingBottom: 20,
        }}
      >
        <Box className="px-6 py-4">
          <HStack className="items-center justify-between">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#2A2A2A', // Solid background for shadow
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                borderWidth: 1,
                borderColor: 'rgba(255, 210, 10, 0.4)',
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            
            <VStack className="flex-1" style={{ marginLeft: 16 }}>
              <Heading 
                size="xl" 
                className="font-bold" 
                style={{ color: '#FFFFFF', fontSize: 20, lineHeight: 24 }}
                numberOfLines={2}
              >
                {exerciseInfo?.name || 'Exercise Details'}
              </Heading>
              <Text style={{ color: '#B0B0B0', fontSize: 14, marginTop: 2 }}>
                Exercise Information
              </Text>
            </VStack>

            {/* Action Buttons */}
            <HStack space="sm">
              {exerciseInfo?.images && exerciseInfo.images.length > 1 && (
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 210, 10, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={toggleImageNum}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFD20A' }}>
                    {imageNum + 1}/{exerciseInfo.images.length}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255, 210, 10, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="heart-outline" size={20} color="#FFD20A" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </Box>
      </LinearGradient>

      <ScrollView 
        style={{ backgroundColor: '#1E1E1E' }}
        contentContainerStyle={{ 
          backgroundColor: '#1E1E1E',
          flexGrow: 1,
          paddingBottom: insets.bottom + 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise Image */}
        {exerciseInfo?.images && (
          <Box className="px-4 py-4">
            <TouchableOpacity 
              onPress={toggleImageNum}
              activeOpacity={0.9}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#2A2A2A', // Solid background for shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Image 
                source={{ 
                  uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${exerciseInfo.images[imageNum]}`
                }} 
                style={{ 
                  width: '100%', 
                  height: 280,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
              
              {/* Image Overlay */}
              {exerciseInfo.images.length > 1 && (
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 12,
                  }}
                >
                  <HStack className="items-center">
                    <Ionicons name="images" size={16} color="#FFD20A" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#FFD20A', fontSize: 12, fontWeight: '600' }}>
                      Tap to switch view
                    </Text>
                  </HStack>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </Box>
        )}

        {/* Exercise Stats */}
        {exerciseInfo && (exerciseInfo.duration || exerciseInfo.weight || exerciseInfo.sets || exerciseInfo.repetitions) && (
          <Box className="px-4 py-2">
            <Heading size="lg" className="font-bold mb-4" style={{ color: 'white', paddingHorizontal: 8 }}>
              Workout Details
            </Heading>
            <VStack space="md">
              <HStack space="sm">
                {exerciseInfo.duration && (
                  <StatCard 
                    icon="time-outline" 
                    value={exerciseInfo.duration} 
                    label="Minutes"
                    gradient={['#FFD20A', '#FFA500']}
                  />
                )}
                {exerciseInfo.weight && (
                  <StatCard 
                    icon="barbell-outline" 
                    value={exerciseInfo.weight} 
                    label="kg"
                    gradient={['#4CAF50', '#2E7D32']}
                  />
                )}
              </HStack>
              <HStack space="sm">
                {exerciseInfo.sets && (
                  <StatCard 
                    icon="repeat-outline" 
                    value={exerciseInfo.sets} 
                    label="Sets"
                    gradient={['#FF6B6B', '#E53E3E']}
                  />
                )}
                {exerciseInfo.repetitions && (
                  <StatCard 
                    icon="fitness-outline" 
                    value={exerciseInfo.repetitions} 
                    label="Reps"
                    gradient={['#6366F1', '#4F46E5']}
                  />
                )}
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Description Section */}
        {exerciseInfo?.description && (
          <SectionCard title="About This Exercise" icon="information-circle">
            <Text
              style={{
                fontSize: 15,
                color: '#FFFFFF',
                lineHeight: 24,
                fontWeight: '400',
              }}
            >
              {exerciseInfo.description}
            </Text>
          </SectionCard>
        )}
        
        {/* Instructions Section */}
        {exerciseInfo?.instructions && Array.isArray(exerciseInfo.instructions) && exerciseInfo.instructions.length > 0 && (
          <SectionCard title="How To Perform" icon="list">
            <VStack space="sm">
              {exerciseInfo.instructions.map((instruction: string, index: number) => (
                <InstructionStep key={index} step={instruction} index={index} />
              ))}
            </VStack>
          </SectionCard>
        )}

        {/* Target Muscles Section */}
        {(exerciseInfo as any)?.primaryMuscles && Array.isArray((exerciseInfo as any).primaryMuscles) && (exerciseInfo as any).primaryMuscles.length > 0 && (
          <SectionCard title="Target Muscles" icon="fitness">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {(exerciseInfo as any).primaryMuscles.map((muscle: string, index: number) => (
                <MuscleTag key={index} muscle={muscle} />
              ))}
            </View>
          </SectionCard>
        )}

        {/* Equipment Section */}
        {(exerciseInfo as any)?.equipment && Array.isArray((exerciseInfo as any).equipment) && (exerciseInfo as any).equipment.length > 0 && (
          <SectionCard title="Equipment Needed" icon="construct">
            <VStack space="sm">
              {(exerciseInfo as any).equipment.map((item: string, index: number) => (
                <HStack key={index} className="items-center">
                  <Box
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: 'rgba(255, 210, 10, 0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="checkmark" size={14} color="#FFD20A" />
                  </Box>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#FFFFFF',
                      fontWeight: '500',
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </SectionCard>
        )}

        {/* Footer CTA */}
        <Box className="px-6 py-6">
          <LinearGradient
            colors={['#FFD20A', '#FFA500']}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Ionicons name="play-circle" size={32} color="#1E1E1E" style={{ marginBottom: 8 }} />
            <Heading size="md" className="font-bold text-center mb-2" style={{ color: '#1E1E1E' }}>
              Ready to Start?
            </Heading>
                         <Text 
               style={{ color: '#1E1E1E', opacity: 0.8, lineHeight: 20, textAlign: 'center', marginBottom: 16, fontSize: 14 }}
             >
              Add this exercise to your routine and track your progress
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.2)',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#1E1E1E', fontWeight: '600', fontSize: 14 }}>
                Add to Routine
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Box>
      </ScrollView>
    </View>
  );
};
