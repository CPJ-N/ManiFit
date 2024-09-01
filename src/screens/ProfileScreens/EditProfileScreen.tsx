import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';
import { updateUser } from '../../utils/controllers/userController';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../../config/firebase';


export default function EditProfileScreen({navigation}) {

  const dispatch = useDispatch(); // Initialize useDispatch
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [profile, setProfile] = useState<Partial<UserDetails>>({
    fullName: userInfo?.fullName,
    mobileNumber: userInfo?.mobileNumber,
    dateOfBirth: userInfo?.dateOfBirth,
    weight: userInfo?.weight,
    height: userInfo?.height,
  });

  const handleUpdate = async () => {
    console.log('userDetails updated:', profile);
    // Dispatch setUser action with userDetails
    const updateProffileInfo: UserDetails = {...userInfo, ...profile} as UserDetails;
    await updateUser(auth.currentUser?.uid, updateProffileInfo).then(() => {
      dispatch(setUser(updateProffileInfo));
      console.log('Profile updated:', updateProffileInfo);
    }).catch((error) => {
      console.log('Error updating profile:', error);
    });
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#FFD20A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
    </View>
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={{ position: 'relative', flex: 0 }}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3470076/pexels-photo-3470076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} // Replace with your image URL
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} >
            <Ionicons name="camera" size={24} color="#ffd20a"/>
          </TouchableOpacity>
        </View> 
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.detailsText}>{auth.currentUser?.email}</Text>
          <Text style={styles.detailsText}>Birthday: {profile.dateOfBirth}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        {Object.keys(profile).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            onChangeText={(text) => handleChange(text, key as keyof UserDetails)}
            value={(profile[key as keyof UserDetails] ?? '').toString()}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD20A',
    marginLeft: 16,
  },
  backButton: {
    paddingTop: 30,
    paddingLeft: 10,
    position: 'absolute',
    left: 10,
    top: 15,
  },
  headerText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFD20A',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 10,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute', 
    bottom: 10, 
    right: 10, 
    padding: 5, 
    backgroundColor: '#1e1e1e',
    borderRadius: 30,
  },
  infoContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    padding: 3,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    color: '#ddd',
  },
  button: {
    backgroundColor: '#FFD20A',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
