import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';
import { updateUser } from '../../utils/controllers/userController';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../../config/firebase';
import { getImageUrl, uploadImage } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';
import { pickImage } from '../../utils/imageHelpers/imagePicker';


export default function EditProfileScreen({navigation}) {

  const dispatch = useDispatch(); // Initialize useDispatch
  const {userInfo, userImageUrl} = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<Partial<UserDetails>>({
    fullName: userInfo?.fullName,
    mobileNumber: userInfo?.mobileNumber,
    dateOfBirth: userInfo?.dateOfBirth,
    weight: userInfo?.weight,
    height: userInfo?.height,
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageUpload = async () => {
    setIsUploading(true);
    const imageUri = await pickImage();
    if (imageUri) {
      setSelectedImage(imageUri);
      await uploadImage(imageUri).then(async (result) => {
        const updateProfileInfo: UserDetails = { ...userInfo, profilePhotoName: result.metadata.name };
        await updateUser(auth.currentUser?.uid, updateProfileInfo)
        dispatch(setUser(updateProfileInfo))
        const uploadedImageUrl = await getImageUrl(firebaseBucketName.userImages, updateProfileInfo.profilePhotoName);
        dispatch(setUserImageUrl(uploadedImageUrl));
        setSelectedImage('')
        console.log('Image URL:', uploadedImageUrl);
      }).catch((error) => {
        console.log('Error uploading image:', error);
      })
    } else {
      console.log("No image picked");
    }

    setIsUploading(false);
    setUploadSuccess(true); // Assuming the upload is always successful
  };

  const handleUpdate = async () => {
    const updateProfileInfo: UserDetails = {...userInfo, ...profile} as UserDetails;
    await updateUser(auth.currentUser?.uid, updateProfileInfo).then(() => {
      dispatch(setUser(updateProfileInfo));
      console.log('Profile updated:', updateProfileInfo);
    }).catch((error) => {
      console.log('Error updating profile:', error);
    });
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setProfile({ ...profile, [field]: value });
  };

  useEffect(() => {
    if (userInfo.profilePhotoName) {
      getImageUrl(firebaseBucketName.userImages, userInfo.profilePhotoName).then((url) => {
        console.log(`Image name: ${userInfo.profilePhotoName} \n Image URL: ${url}`);
        dispatch(setUserImageUrl(url));
      }).catch((error) => {
        console.error('Error fetching user image:', error)});
    }
  }, [])

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
          {userImageUrl ? 
          <Image
            source={{ uri: userImageUrl }}
            style={styles.profileImage}
          /> :
          <Image
            source={{ 
              uri: selectedImage ? 
              selectedImage : 
              'https://images.pexels.com/photos/3470076/pexels-photo-3470076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }} 
            style={styles.profileImage}
          />}
          <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload} >
            {isUploading ? 
              (<ActivityIndicator size="small" color="#ffd20a" />) : 
              (<Ionicons name="camera" size={24} color="#ffd20a"/>)
            }
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
          key !== 'profilePhotoUrl' && (
            <TextInput
            key={key}
            style={styles.input}
            onChangeText={(text) => handleChange(text, key as keyof UserDetails)}
            value={(profile[key as keyof UserDetails] ?? '').toString()}
          />)
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
