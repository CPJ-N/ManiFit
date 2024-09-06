import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { Exercise } from '../../constants/dataModels/exercise.model'; // Import the Exercise interface
import { EXERCISE_DETAILS, EXERCISE_EDIT, EXERCISE_FORM } from '../../constants/screenNames';
import { deleteExercise, getAllExercises } from '../../utils/controllers/exerciseController';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import ExerciseItem from '../../components/ExerciseItem';
import { Ionicons } from '@expo/vector-icons'; 

export default function CompleteExerciseList({navigation}) {

    const allExercises = useSelector((state: RootState) => state.exercises.allExercises);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        // Add functionality to filter exercises based on search term
    };

    const viewDetails = (exerciseInfo: Exercise) => {
        navigation.navigate(EXERCISE_DETAILS, { exerciseInfo });
        console.log(`View Exercise Details: ${exerciseInfo.id}`);
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Exercises</Text>
        </View>
        <View style={styles.searchBar}>
          <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={handleSearch}
            />
          {/* <View style={styles.icons}>
            <Ionicons name="add" type="feather" color="#fff" size={25} onPress={() => navigation.navigate(EXERCISE_FORM)}/>
          </View> */}
        </View>
        <ScrollView contentContainerStyle={styles.videoGrid}>
        {allExercises.map((exercise, index) => (
            <ExerciseItem
                key={index}
                exercise={exercise}
                viewDetails={() => viewDetails(exercise)}
            />
        ))}
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#1e1e1e',
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
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
      },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    videoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 8,
      },
    icons: {
        flexDirection: 'row',
        marginLeft: 10,
    }
});