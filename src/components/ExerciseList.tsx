import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Exercise, ExerciseDetails } from '../constants/dataModels/exercise.model'; // Import the Exercise interface
import { EXERCISE_DETAILS, EXERCISE_EDIT, EXERCISE_FORM } from '../constants/screenNames';
import ExerciseCard from './ExerciseCard';
import { useRoute } from '@react-navigation/native';
import { deleteExercise, getExercise } from '../utils/controllers/exerciseController';
import { Routine } from '../constants/dataModels/routine.model';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';
import { StatusBar } from 'expo-status-bar';



function ExerciseList({navigation} : {navigation: any}) {
    const route = useRoute();

    const { routine } = (route.params as { routine: Routine }) || { routine: { name: '', description: '', exercises: [], createdBy: '' } };
    const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetails[]>();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log(routine);
        if (routine) {
            setExerciseDetails(routine.exercises);
        }
    }, [routine]);


    const handleSearch = (text: string) => {
        setSearchTerm(text);
    };


    const handleEdit = (exerciseInfo: Exercise) => {
        navigation.navigate(EXERCISE_EDIT, { exerciseInfo });
        console.log(`Edit Exercise: ${exerciseInfo.id}`);
    };

    const handleDelete = (exerciseId: string) => {
        deleteExercise(exerciseId);
        console.log(`Delete Exercise: ${exerciseId}`);
    };

    // const findExerciseById = (exerciseId: string) => {
    //     return exercises?.find(exercise => exercise.id === exerciseId);
    // };

    const viewDetails = (exerciseInfo: Exercise) => {
        navigation.navigate(EXERCISE_DETAILS, { exerciseInfo });
        console.log(`View Exercise Details: ${exerciseInfo.id}`);
    }

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{routine.name}</Text>
        </View>
        <View style={styles.header}>

          <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={handleSearch}
            />
          {/* {userInfo?.isTrainer && <View style={styles.icons}>
            <Icon name="plus" type="feather" color="#fff" size={25} onPress={() => navigation.navigate(EXERCISE_FORM)}/>
          </View>} */}
        </View>
        <FlatList
            // data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            data={exerciseDetails}
            keyExtractor={(item) => item.exerciseId}
            renderItem={({ item }) => (
                <ExerciseCard
                    viewDetails={viewDetails}
                    exerciseDetails={item}
                />
                )}
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        padding: 5,
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
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    icons: {
        flexDirection: 'row',
        marginLeft: 10,
    }
});

export default ExerciseList;