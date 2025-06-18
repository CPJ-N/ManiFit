import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Exercise, ExerciseDetails } from '../constants/dataModels/exercise.model'
import { getExercise } from '../utils/controllers/exerciseController'
import { Card } from '@/components/ui/card'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { Image } from '@/components/ui/image'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

const ExerciseCard = ({viewDetails, exerciseDetails }: {  
  viewDetails: (exercise: Exercise) => void,
  exerciseDetails: ExerciseDetails}) => {

  const [exercise, setExercise] = useState<Exercise | null>(null);
    useEffect(() => {  
      const fetchExercises = async () => {
        const fetchedExercise = await getExercise(exerciseDetails.exerciseId);
        setExercise(fetchedExercise);
    };
    fetchExercises();
  }, []);

  const getImageSource = () => {
    if (exercise?.image) {
      return { uri: exercise.image };
    }
    if (exercise?.images) {
      return { uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${exercise.images[0]}` };
    }
    return null;
  };

  return (
    <TouchableOpacity onPress={() => exercise && viewDetails(exercise)}>
      <Card className="mx-3 mb-3 shadow-sm">
        <HStack className="p-4 space-x-4">
          {/* Exercise Image */}
          <Box className="flex-shrink-0">
            {getImageSource() && (
              <Image
                source={getImageSource()!}
                alt={exercise?.name || 'Exercise image'}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
            )}
          </Box>

          {/* Exercise Details */}
          <VStack className="flex-1 justify-center space-y-2">
            <Heading size="md" className="font-semibold text-typography-900 leading-tight">
              {exercise?.name}
            </Heading>
            
            <VStack className="space-y-1">
              {exerciseDetails.duration && (
                <HStack className="items-center space-x-2">
                  <Badge variant="outline" action="info" size="sm" className="px-2 py-1">
                    <Text size="xs" className="font-medium text-typography-700">
                      {exerciseDetails.duration} mins
                    </Text>
                  </Badge>
                </HStack>
              )}
              
              {exerciseDetails.weight && (
                <HStack className="items-center space-x-2">
                  <Badge variant="outline" action="success" size="sm" className="px-2 py-1">
                    <Text size="xs" className="font-medium text-typography-700">
                      {exerciseDetails.weight} kg
                    </Text>
                  </Badge>
                </HStack>
              )}
              
              {exerciseDetails.sets && (
                <HStack className="items-center space-x-2">
                  <Badge variant="outline" action="warning" size="sm" className="px-2 py-1">
                    <Text size="xs" className="font-medium text-typography-700">
                      {exerciseDetails.sets} sets
                    </Text>
                  </Badge>
                </HStack>
              )}
              
              {exerciseDetails.repetitions && (
                <HStack className="items-center space-x-2">
                  <Badge variant="outline" action="muted" size="sm" className="px-2 py-1">
                    <Text size="xs" className="font-medium text-typography-700">
                      {exerciseDetails.repetitions} reps
                    </Text>
                  </Badge>
                </HStack>
              )}
            </VStack>
            
            {exerciseDetails.specialInstructions && (
              <Box className="mt-2 p-2 bg-background-50 rounded-md">
                <Text size="xs" className="text-typography-600 italic">
                  Note: {exerciseDetails.specialInstructions}
                </Text>
              </Box>
            )}
          </VStack>
        </HStack>
      </Card>
    </TouchableOpacity>
  )
}

export default ExerciseCard