import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { auth } from '../../config/firebase'
import { BOTTOM_TABS, HOME } from '../../constants/screenNames';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../utils/controllers/userController';
import { getImageUrl, uploadImage } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';
import { pickImage } from '../../utils/imageHelpers/imagePicker';

const FitnessGoals = [
  { id: '1', name: 'Lose Wight' },
  { id: '2', name: 'Gain Wight' },
  { id: '3', name: 'Muscle Mass Gail' },
  { id: '4', name: 'Shape Body' },
  { id: '5', name: 'Others' },
];

export default function UserDetailsForm({navigation} : {navigation: any}) {

  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: '',
    email: auth.currentUser?.email ?? '',
    mobileNumber: '',
    dateOfBirth: '',
    weight: 0,
    height: 0,
    isTrainer: false,
    profilePhotoName: '',
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const dispatch = useDispatch();

  const handleImageUpload = async () => {
    setIsUploading(true);
    const imageUri = await pickImage();
    if (imageUri) {
      setSelectedImage(imageUri);
      await uploadImage(imageUri).then(async (result) => {
        userDetails.profilePhotoName = result?.metadata.name;
        const uploadedImageUrl = await getImageUrl(firebaseBucketName.userImages, userDetails.profilePhotoName || '');
        setSelectedImage(uploadedImageUrl);
      }).catch((error) => {
        console.log('Error uploading image:', error);
      })
    } else {
      console.log("No image picked");
    }

    setIsUploading(false);
    setUploadSuccess(true); // Assuming the upload is always successful
  };

  const handleSubmit = async () => {
    await createUser(userDetails, auth.currentUser?.uid ?? '');
    dispatch(setUser(userDetails));
    console.log('userDetails updated:', userDetails);
    navigation.navigate(BOTTOM_TABS, {screen: {HOME}});
  };

  const handleChange = (value: any, field: keyof UserDetails) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFD20A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Your Profile</Text>
      </View>
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={{ position: 'relative', flex: 0 }}>
          <Image
            source={{ uri: selectedImage ? selectedImage :
              'https://images.pexels.com/photos/3470076/pexels-photo-3470076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} // Replace with your image URL
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload}>
            {isUploading ? 
              (<ActivityIndicator size="small" color="#ffd20a" />) : 
              (<Ionicons name="camera" size={24} color="#ffd20a" style={{padding:3}}/>)
            }
          </TouchableOpacity>
        </View> 
        <View style={styles.infoContainer}>
          {/* <Text style={styles.name}>{userDetails.fullName}</Text> */}
          <Text style={styles.detailsText}>{auth.currentUser?.email}</Text>
          {/* <Text style={styles.detailsText}>Birthday: {userDetails.dateOfBirth}</Text> */}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'fullName')}
          value={userDetails['fullName'].toString()}
          placeholderTextColor='grey'
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'mobileNumber')}
          value={userDetails['mobileNumber']?.toString() || ''}
        />
        <Text style={styles.label}>Date Of Birth</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'dateOfBirth')}
          value={userDetails['dateOfBirth']?.toString() || ''}
        />
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'weight')}
          value={userDetails['weight']?.toString() || ''}
        />
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'height')}
          value={userDetails['height']?.toString() || ''}
        />
        
        {/* <Text style={styles.label}>Are you a Trainer?</Text> */}
        {/* <Picker
          selectedValue={userDetails.isTrainer}
          onValueChange={(itemValue, itemIndex) => handleChange(itemValue, 'isTrainer')}
          style={styles.picker}
        >
          <Picker.Item label="Yes" value={true} />
          <Picker.Item label="No" value={false} />
        </Picker> */}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Profile</Text>
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
  // header: {
  //   padding: 20,
  //   paddingTop: 70,
  //   backgroundColor: '#FFD20A',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   borderBottomRightRadius: 15,
  //   borderBottomLeftRadius: 15,
  // },
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
  // headerText: {
  //   fontSize: 24,
  //   color: '#333',
  //   fontWeight: 'bold',
  // },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFD20A',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  infoContainer: {
    paddingTop: 5,
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    padding: 5, 
    backgroundColor: '#1e1e1e',
    borderRadius: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 5,
    color: '#FFD20A',
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  detailsText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'semibold',
    marginVertical: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#fff',
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
});
