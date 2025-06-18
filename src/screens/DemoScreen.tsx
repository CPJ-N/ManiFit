import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';

export default function DemoScreen() {
  return (
    <ScrollView className="flex-1 bg-background-0">
      <VStack className="p-4 space-y-6">
        {/* Header */}
        <VStack className="items-center space-y-2">
          <Heading size="2xl" className="text-typography-900 font-bold">
            ManiFit - Gluestack UI Demo
          </Heading>
          <Text size="md" className="text-typography-600 text-center">
            Showcasing the new improved design system
          </Text>
        </VStack>

        {/* Buttons Section */}
        <Card className="p-4">
          <VStack className="space-y-4">
            <Heading size="lg" className="text-typography-900">
              Buttons
            </Heading>
            <HStack className="space-x-3 flex-wrap">
              <Button action="primary" size="md">
                <ButtonText>Primary</ButtonText>
              </Button>
              <Button action="secondary" variant="outline" size="md">
                <ButtonText>Secondary</ButtonText>
              </Button>
              <Button action="positive" size="md">
                <ButtonText>Success</ButtonText>
              </Button>
              <Button action="negative" size="md">
                <ButtonText>Error</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>

        {/* Badges Section */}
        <Card className="p-4">
          <VStack className="space-y-4">
            <Heading size="lg" className="text-typography-900">
              Badges
            </Heading>
            <HStack className="space-x-2 flex-wrap">
              <Badge action="success" variant="solid">
                <Text size="xs" className="text-typography-0">Completed</Text>
              </Badge>
              <Badge action="warning" variant="outline">
                <Text size="xs" className="text-typography-700">In Progress</Text>
              </Badge>
              <Badge action="info" variant="outline">
                <Text size="xs" className="text-typography-700">30 mins</Text>
              </Badge>
              <Badge action="muted" variant="outline">
                <Text size="xs" className="text-typography-700">5 sets</Text>
              </Badge>
            </HStack>
          </VStack>
        </Card>

        {/* Exercise Card Example */}
        <Card className="p-4">
          <VStack className="space-y-4">
            <Heading size="lg" className="text-typography-900">
              Exercise Card (New Design)
            </Heading>
            <Card className="shadow-sm">
              <HStack className="p-4 space-x-4">
                <Avatar size="lg" className="bg-primary-500">
                  <AvatarFallbackText className="text-typography-0">EX</AvatarFallbackText>
                </Avatar>
                
                <VStack className="flex-1 space-y-2">
                  <Heading size="md" className="text-typography-900">
                    Push-ups
                  </Heading>
                  
                  <HStack className="space-x-2 flex-wrap">
                    <Badge action="info" variant="outline" size="sm">
                      <Text size="xs" className="text-typography-700">15 mins</Text>
                    </Badge>
                    <Badge action="success" variant="outline" size="sm">
                      <Text size="xs" className="text-typography-700">3 sets</Text>
                    </Badge>
                    <Badge action="warning" variant="outline" size="sm">
                      <Text size="xs" className="text-typography-700">12 reps</Text>
                    </Badge>
                  </HStack>
                  
                  <Text size="xs" className="text-typography-600 italic">
                    Keep your body straight and engage your core
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>
        </Card>

        {/* Typography Section */}
        <Card className="p-4">
          <VStack className="space-y-4">
            <Heading size="lg" className="text-typography-900">
              Typography
            </Heading>
            <VStack className="space-y-2">
              <Heading size="2xl" className="text-typography-900">
                Heading 2XL
              </Heading>
              <Heading size="xl" className="text-typography-900">
                Heading XL
              </Heading>
              <Heading size="lg" className="text-typography-900">
                Heading LG
              </Heading>
              <Text size="lg" className="text-typography-700">
                Large text for important content
              </Text>
              <Text size="md" className="text-typography-600">
                Medium text for regular content
              </Text>
              <Text size="sm" className="text-typography-500">
                Small text for secondary information
              </Text>
            </VStack>
          </VStack>
        </Card>

        {/* Color Palette */}
        <Card className="p-4">
          <VStack className="space-y-4">
            <Heading size="lg" className="text-typography-900">
              Color System
            </Heading>
            <VStack className="space-y-3">
              <HStack className="space-x-2">
                <Box className="w-8 h-8 bg-primary-500 rounded-full" />
                <Text size="sm" className="text-typography-700">Primary</Text>
              </HStack>
              <HStack className="space-x-2">
                <Box className="w-8 h-8 bg-secondary-500 rounded-full" />
                <Text size="sm" className="text-typography-700">Secondary</Text>
              </HStack>
              <HStack className="space-x-2">
                <Box className="w-8 h-8 bg-success-500 rounded-full" />
                <Text size="sm" className="text-typography-700">Success</Text>
              </HStack>
              <HStack className="space-x-2">
                <Box className="w-8 h-8 bg-error-500 rounded-full" />
                <Text size="sm" className="text-typography-700">Error</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Benefits */}
        <Card className="p-4 bg-primary-50 border-primary-200">
          <VStack className="space-y-3">
            <Heading size="lg" className="text-primary-900">
              Benefits of Gluestack UI
            </Heading>
            <VStack className="space-y-2">
              <Text size="sm" className="text-primary-800">
                ✅ Consistent design system across all components
              </Text>
              <Text size="sm" className="text-primary-800">
                ✅ Built-in accessibility features
              </Text>
              <Text size="sm" className="text-primary-800">
                ✅ Tailwind CSS utility classes for easy customization
              </Text>
              <Text size="sm" className="text-primary-800">
                ✅ Dark mode support out of the box
              </Text>
              <Text size="sm" className="text-primary-800">
                ✅ Reduced bundle size with tree-shaking
              </Text>
              <Text size="sm" className="text-primary-800">
                ✅ Better performance with optimized components
              </Text>
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
} 