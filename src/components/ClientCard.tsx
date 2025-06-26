import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { getImageUrl } from '../utils/controllers/imageController';
import { firebaseBucketName } from '../constants/firebaseContant';

interface ClientCardProps {
  client: {
    uid: string;
    fullName: string;
    profilePhotoName?: string;
    email: string;
    lastActive?: string;
  };
  onAssignRoutine: (clientId: string) => void;
  onViewProgress: (clientId: string) => void;
}

export default function ClientCard({ client, onAssignRoutine, onViewProgress }: ClientCardProps) {
  const [clientImageUrl, setClientImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (client.profilePhotoName) {
      getImageUrl(firebaseBucketName.userImages, client.profilePhotoName)
        .then((url) => setClientImageUrl(url))
        .catch((error) => console.error('Error fetching client image:', error));
    }
  }, [client.profilePhotoName]);

  const getLastActiveText = () => {
    if (!client.lastActive) return 'Never active';
    
    const lastActiveDate = new Date(client.lastActive);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Active today';
    if (diffInDays === 1) return 'Active yesterday';
    if (diffInDays < 7) return `Active ${diffInDays} days ago`;
    return 'Inactive';
  };

  const getStatusColor = () => {
    if (!client.lastActive) return '#666';
    
    const diffInDays = Math.floor((new Date().getTime() - new Date(client.lastActive).getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays <= 1) return '#4CAF50'; // Green - Active
    if (diffInDays <= 7) return '#FFD20A'; // Yellow - Recent
    return '#FF6B6B'; // Red - Inactive
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }}
      activeOpacity={0.8}
      onPress={() => onViewProgress(client.uid)}
    >
      <HStack className="items-center space-x-3">
        {/* Client Avatar */}
        <Avatar size="lg" style={{ width: 60, height: 60 }}>
          {clientImageUrl ? (
            <AvatarImage 
              source={{ uri: clientImageUrl }}
              alt="Client"
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          ) : (
            <View
              style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#FFD20A',
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              <AvatarFallbackText 
                className="font-bold"
                style={{ color: '#1E1E1E', fontSize: 18 }}
              >
                {client.fullName?.split(' ').map(name => name[0]).join('') || 'C'}
              </AvatarFallbackText>
            </View>
          )}
        </Avatar>

        {/* Client Info */}
        <VStack className="flex-1 space-y-1">
          <Text 
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
              lineHeight: 20,
            }}
            numberOfLines={1}
          >
            {client.fullName}
          </Text>
          
          <Text 
            style={{
              color: '#888',
              fontSize: 12,
              lineHeight: 16,
            }}
            numberOfLines={1}
          >
            {client.email}
          </Text>

          <HStack className="items-center space-x-1">
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getStatusColor(),
              }}
            />
            <Text 
              style={{
                color: getStatusColor(),
                fontSize: 11,
                fontWeight: '500',
              }}
            >
              {getLastActiveText()}
            </Text>
          </HStack>
        </VStack>

        {/* Action Buttons */}
        <VStack className="space-y-2">
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 210, 10, 0.2)',
              borderRadius: 12,
              padding: 8,
              alignItems: 'center',
              minWidth: 80,
            }}
            onPress={() => onAssignRoutine(client.uid)}
            activeOpacity={0.7}
          >
            <Ionicons name="barbell" size={16} color="#FFD20A" />
            <Text 
              style={{
                color: '#FFD20A',
                fontSize: 10,
                fontWeight: '600',
                marginTop: 2,
              }}
            >
              Assign
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(75, 175, 80, 0.2)',
              borderRadius: 12,
              padding: 8,
              alignItems: 'center',
              minWidth: 80,
            }}
            onPress={() => onViewProgress(client.uid)}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart" size={16} color="#4CAF50" />
            <Text 
              style={{
                color: '#4CAF50',
                fontSize: 10,
                fontWeight: '600',
                marginTop: 2,
              }}
            >
              Progress
            </Text>
          </TouchableOpacity>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
} 