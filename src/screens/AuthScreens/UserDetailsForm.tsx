import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { auth } from '../../config/firebase'
import { BOTTOM_TABS, HOME } from '../../constants/screenNames';
import { Picker } from '@react-native-picker/picker';
import { setUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { createUser } from '../../utils/controllers/userController';

// Define the interface for the item
interface ListItem {
  id: string;
  name: string;
}

const FitnessGoals: ListItem[] = [
  { id: '1', name: 'Lose Wight' },
  { id: '2', name: 'Gain Wight' },
  { id: '3', name: 'Muscle Mass Gail' },
  { id: '4', name: 'Shape Body' },
  { id: '5', name: 'Others' },
];

export default function UserDetailsForm({ navigation }) {

  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: 'Madison Smith',
    email: auth.currentUser?.email,
    mobileNumber: '+123 567 89000',
    dateOfBirth: '01 / 04 / 199X',
    weight: 75,
    height: 1.65,
    isTrainer: false,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const dispatch = useDispatch();

  const renderOptionsItem = ({ item } : { item: ListItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectItem(item.id)}
    >
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>{selectedIds.includes(item.id) ? '✓' : ''}</Text>
    </TouchableOpacity>
  );

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = async () => {
    await createUser(userDetails, auth.currentUser?.uid);
    dispatch(setUser(userDetails));
    console.log('userDetails updated:', userDetails);
    navigation.navigate(BOTTOM_TABS, {screen: {HOME}});
  };

  const handleChange = (value: any, field: keyof UserDetails) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Setup Your Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3470076/pexels-photo-3470076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} // Replace with your image URL
            style={styles.profileImage}
          />
          <Ionicons name="pencil" size={20} color="#fff" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor:'grey', padding:5, borderRadius:20 }} />
        </View> 
        <View style={styles.infoContainer}>
          {/* <Text style={styles.name}>{userDetails.fullName}</Text> */}
          <Text style={styles.detailsText}>{auth.currentUser?.email}</Text>
          {/* <Text style={styles.detailsText}>Birthday: {userDetails.dateOfBirth}</Text> */}
        </View>
      </View>
      {/* <View style={styles.inputContainer}>
        {Object.keys(userDetails).map((key) => (
          <View key={key}>
            <Text style={styles.label}>{key}</Text>
            <TextInput
              key={key}
              style={styles.input}
              onChangeText={(text) => handleChange(text, key as keyof UserDetails)}
              value={userDetails[key as keyof UserDetails].toString()}
            />
          </View>
        ))}
      </View> */}
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
          value={userDetails['mobileNumber'].toString()}
        />
        <Text style={styles.label}>Date Of Birth</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'dateOfBirth')}
          value={userDetails['dateOfBirth'].toString()}
        />
        <Text style={styles.label}>Weight</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'weight')}
          value={userDetails['weight'].toString()}
        />
        <Text style={styles.label}>Height</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange(text, 'height')}
          value={userDetails['height'].toString()}
        />
        
        <Text style={styles.label}>Are you a Trainer?</Text>
        <Picker
          selectedValue={userDetails.isTrainer}
          onValueChange={(itemValue, itemIndex) => handleChange(itemValue, 'isTrainer')}
          style={styles.picker}
        >
          <Picker.Item label="Yes" value={true} />
          <Picker.Item label="No" value={false} />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Profile</Text>
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
    marginVertical: 30,
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
