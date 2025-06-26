import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';

// Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ClientCard from '../../components/ClientCard';

// Controllers
import { getTrainerClients, ClientData } from '../../utils/controllers/clientController';

// Screen Names
import { LINK_TRAINEE } from '../../constants/screenNames';

export default function ClientListScreen({ navigation }: { navigation: any }) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const fetchClients = useCallback(async () => {
    try {
      if (!auth.currentUser?.uid) return;
      
      const clients = await getTrainerClients(auth.currentUser.uid);
      setClients(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      Alert.alert('Error', 'Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClients();
  }, [fetchClients]);

  const handleAssignRoutine = (clientId: string) => {
    // Navigate to assign routine screen with pre-selected client
    Alert.alert('Assign Routine', `Assigning routine to client: ${clientId}`);
    // TODO: Navigate to AssignRoutineScreen with clientId pre-selected
  };

  const handleViewProgress = (clientId: string) => {
    // Navigate to client progress screen
    Alert.alert('View Progress', `Viewing progress for client: ${clientId}`);
    // TODO: Navigate to ClientProgressScreen
  };

  const handleAddClient = () => {
    navigation.navigate(LINK_TRAINEE);
  };

  const renderEmptyState = () => (
    <Box className="flex-1 justify-center items-center px-6">
      <Box
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'rgba(255, 210, 10, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Ionicons name="people-outline" size={40} color="#FFD20A" />
      </Box>
      
      <Heading 
        size="lg" 
        className="font-bold text-center mb-3" 
        style={{ color: '#FFFFFF' }}
      >
        No Clients Yet
      </Heading>
      
      <Text 
        className="text-center mb-6" 
        style={{ color: '#B0B0B0', lineHeight: 22, maxWidth: 280 }}
      >
        Start building your client base by adding your first trainee
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#FFD20A',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 25,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
        onPress={handleAddClient}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={20} color="#1E1E1E" />
        <Text style={{ color: '#1E1E1E', fontWeight: '600', fontSize: 16 }}>
          Add First Client
        </Text>
      </TouchableOpacity>
    </Box>
  );

  const renderClientItem = ({ item }: { item: ClientData }) => (
    <ClientCard
      client={item}
      onAssignRoutine={handleAssignRoutine}
      onViewProgress={handleViewProgress}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <Box
        style={{
          backgroundColor: 'rgba(255, 210, 10, 0.05)',
          paddingTop: insets.top + 10,
          paddingBottom: 20,
        }}
      >
        <Box className="px-6">
          <HStack className="justify-between items-center">
            <VStack className="flex-1">
              <Heading 
                size="xl" 
                className="font-bold" 
                style={{ color: '#FFFFFF', fontSize: 24 }}
              >
                My Clients
              </Heading>
              <Text style={{ color: '#B0B0B0', fontSize: 14, marginTop: 2 }}>
                {clients.length} {clients.length === 1 ? 'client' : 'clients'} in your program
              </Text>
            </VStack>
            
            {clients.length > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255, 210, 10, 0.2)',
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleAddClient}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={22} color="#FFD20A" />
              </TouchableOpacity>
            )}
          </HStack>
        </Box>
      </Box>

      {/* Client List */}
      <Box className="flex-1" style={{ backgroundColor: '#1E1E1E' }}>
        {loading ? (
          <Box className="flex-1 justify-center items-center">
            <Text style={{ color: '#B0B0B0' }}>Loading clients...</Text>
          </Box>
        ) : clients.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={clients}
            renderItem={renderClientItem}
            keyExtractor={(item) => item.uid}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: insets.bottom + 20,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFD20A"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
    </SafeAreaView>
  );
} 