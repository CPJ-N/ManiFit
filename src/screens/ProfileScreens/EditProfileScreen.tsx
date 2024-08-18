import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';


const EditProfileScreen = ({navigation}) => {

  const dispatch = useDispatch(); // Initialize useDispatch
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [profile, setProfile] = useState<UserDetails>({
    fullName: userInfo?.fullName,
    email: userInfo?.email,
    mobileNumber: userInfo?.mobileNumber,
    dateOfBirth: userInfo?.dateOfBirth,
    weight: userInfo?.weight,
    height: userInfo?.height,
    isTrainer: userInfo?.isTrainer,
  });

  const handleUpdate = () => {
    console.log('userDetails updated:', profile);
    // Dispatch setUser action with userDetails
    dispatch(setUser(profile));
    console.log('Profile updated:', profile);
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3470076/pexels-photo-3470076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} // Replace with your image URL
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.detailsText}>{profile.email}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#FFD20A',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
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
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
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

export default EditProfileScreen;
