import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../config/firebase'
import { signOut } from 'firebase/auth'
import { AUTH_TABS, COMPLETE_EXERCISE_LIST, EDIT_PROFILE, EXERCISE_TABS, FAVORITE, LINK_TRAINEE, LINK_TRAINER, LOGIN, PRIVACY_POLICY, SETTINGS } from '../../constants/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { StatusBar } from 'expo-status-bar';
import { clearUser, clearUserImageUrl } from '../../store/userSlice';

// TODO: Add functionality to update user profile
// TODO: Add functionality to go to all menu options

export default function ProfileScreen({navigation}) {
    const {userInfo, userImageUrl} = useSelector((state: RootState) => state.user);
    const menuItems = [
        { name: 'Edit Profile', icon: 'person-circle-outline' },
        { name: 'Favorite', icon: 'heart-outline' },
        { name: 'Privacy Policy', icon: 'shield-checkmark-outline' },
        { name: 'Settings', icon: 'settings-outline' },
        { name: 'Help', icon: 'help-circle-outline' },
        { name: 'Logout', icon: 'log-out-outline' },
    ];
    const dispatch = useDispatch();

    const handlePress = (name: string) => {

        switch (name) {
            case "Profile":
                navigation.navigate(EDIT_PROFILE);
                break;
            case "Favorite":
                userInfo?.isTrainer ? navigation.navigate(LINK_TRAINEE) : navigation.navigate(LINK_TRAINER);
                break;
            case "Privacy Policy":
                console.log(auth.currentUser?.uid);
                console.log('Privacy Policy')
                navigation.navigate(PRIVACY_POLICY)
                break;
            case "Settings":
                navigation.navigate(SETTINGS)
                console.log('Settings');
                break; 
            case "Help":
                navigation.navigate(EXERCISE_TABS)
                console.log('Help');
                break;
            case "Logout":
                handleLogOut();
                break;
            default:
                console.log("Value is something else");
        }
    }
    

    const handleLogOut = () => {
        signOut(auth)
        .then((res) => {
          console.log(res)
          dispatch(clearUser(), clearUserImageUrl())
          navigation.navigate(AUTH_TABS, {screen: {LOGIN}})
          console.log('signed out')
        })
        .catch((error) => {
          console.log(error)
          alert(error.message)
        })
      }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
        <ScrollView  style={{backgroundColor: '#1E1E1E', flex: 1}}>
            <View style={styles.userInfoSection}>
                <Image 
                    source={{ uri: userImageUrl ?
                        userImageUrl :
                        'https://images.pexels.com/photos/3806244/pexels-photo-3806244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
                    }}
                    style={styles.profileImage} 
                />
                <View style={styles.subInfoSection}>
                    <Text style={styles.name}>{userInfo?.fullName}</Text>
                    <Text style={styles.email}>{userInfo?.email}</Text>
                    <Text style={styles.birthday}>Birthday: {userInfo?.dateOfBirth}</Text>
                </View>
            </View>
            <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{userInfo?.weight}</Text>
                        <Text style={styles.statLabel}>Weight</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>28</Text>
                        <Text style={styles.statLabel}>Years Old</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{userInfo?.height}</Text>
                        <Text style={styles.statLabel}>Height</Text>
                    </View>
                </View>

            <View style={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.menuItem} 
                        onPress={() => handlePress(item.name)}>
                        <Ionicons name={item.icon} size={24} color="#f4f4f4" />
                        <Text style={styles.menuItemText}>{item.name}</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="#f4f4f4" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffd20a',
    },
    userInfoSection: {
        backgroundColor: '#ffd20a',
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    subInfoSection: {
        marginLeft: 20,
    },
    profileImage: {
        width: 130,
        height: 130,
        paddingBottom: 15,
        borderRadius: 65,
        marginBottom: 10,
    },
    name: {
        color: '#1f1f1f',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    email: {
        color: '#3f381a',
        fontSize: 16,
        padding: 3,
    },
    birthday: {
        color: '#3f381a',
        marginBottom: 20,
    },
    statsContainer: {
        backgroundColor: '#ffd20a',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        paddingBottom: 30,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        color: '#1f1f1f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#3f381a',
    },
    menu: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 20,
        color: '#f4f4f4',
    },
});
