import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../config/firebase'
import { signOut } from 'firebase/auth'
import { AUTH_TABS, COMPLETE_EXERCISE_LIST, EDIT_PROFILE, EXERCISE_TABS, FAVORITE, LOGIN } from '../../constants/screenNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { StatusBar } from 'expo-status-bar';

// TODO: Add functionality to update user profile
// TODO: Add functionality to go to all menu options
// TODO: Add functionality to create user DOC for sign up

export default function ProfileScreen({navigation}) {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const menuItems = [
        { name: 'Profile', icon: 'person-circle-outline' },
        { name: 'Favorite', icon: 'heart-outline' },
        { name: 'Privacy Policy', icon: 'shield-checkmark-outline' },
        { name: 'Settings', icon: 'settings-outline' },
        { name: 'Help', icon: 'help-circle-outline' },
        { name: 'Logout', icon: 'log-out-outline' },
    ];

    const handlePress = (name: string) => {

        switch (name) {
            case "Profile":
                navigation.navigate(EDIT_PROFILE);
                break;
            case "Favorite":
                navigation.navigate(FAVORITE);
                break;
            case "Privacy Policy":
                console.log(auth.currentUser?.uid);
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
          navigation.navigate(AUTH_TABS, {screen: {LOGIN}})
          console.log('signed out')
        })
        .catch((error) => {
          console.log(error)
          alert(error.message)
        })
      }

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="dark" />
            {/* <View style={styles.header}>
                <Text style={styles.headerText}>My Profile</Text>
            </View> */}

            <View style={styles.userInfoSection}>
                <Image 
                    source={{ uri: 'https://images.pexels.com/photos/3806244/pexels-photo-3806244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
                    style={styles.profileImage} 
                />
                <Text style={styles.name}>{userInfo?.fullName}</Text>
                {/* <Text style={styles.email}>{auth.currentUser?.email}</Text> */}
                <Text style={styles.email}>{userInfo?.email}</Text>

                <Text style={styles.birthday}>Birthday: April 1st</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    header: {
        backgroundColor: '#ffd20a',
        padding: 12,
    },
    headerText: {
        color: '#1f1f1f',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userInfoSection: {
        backgroundColor: '#ffd20a',
        paddingTop: 40,
        paddingVertical: 40,
        alignItems: 'center',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,

    },
    profileImage: {
        width: 130,
        height: 130,
        padding: 10,
        borderRadius: 65,
        marginBottom: 10,
    },
    name: {
        color: '#1f1f1f',
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        color: '#3f381a',
    },
    birthday: {
        color: '#3f381a',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
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
