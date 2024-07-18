import React, { useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Exercise } from '../constants/dataModels/exercise.model'; // Import the Exercise interface
import { getAllExercises } from '../utils/exerciseController'; // Import the API function to get all exercises
import { EXERCISE_DETAILS, EXERCISE_EDIT, EXERCISE_FORM } from '../constants/screenNames';
import ExerciseItem from './ExerciseItem';
import { deleteExercise } from '../utils/exerciseController';
import ExerciseCard from './ExerciseCard';
import { useRoute } from '@react-navigation/native';


function ExerciseList({navigation}) {
    const route = useRoute();

    // Assuming the data you want is passed as a parameter named 'exerciseData'
    const routineExerciseIds = (route.params as { exercises: string[] }).exercises;

    const [exerciseIds, setExerciseIds] = useState<string[]>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     const fetchExercises = async () => {
    //         const fetchedExercises = await getAllExercises();
    //         // console.log(fetchedExercises);
    //         setExercises(fetchedExercises);
    //     };
    //     fetchExercises();
    // }, []);

    useEffect(() => {
        setExerciseIds(routineExerciseIds);
    }, [routineExerciseIds]);

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        // Add functionality to filter exercises based on search term
    };


    const handleEdit = (exerciseInfo: Exercise) => {
        navigation.navigate(EXERCISE_EDIT, { exerciseInfo });
        console.log(`Edit Exercise: ${exerciseInfo.id}`);
    };

    const handleDelete = (exerciseId: string) => {
        deleteExercise(exerciseId);
        console.log(`Delete Exercise: ${exerciseId}`);
    };

    const viewDetails = (exerciseInfo: Exercise) => {
        navigation.navigate(EXERCISE_DETAILS, { exerciseInfo });
        console.log(`View Exercise Details: ${exerciseInfo.id}`);
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={handleSearch}
            />
          <View style={styles.icons}>
            <Icon name="plus" type="feather" color="#fff" size={25} onPress={() => navigation.navigate(EXERCISE_FORM)}/>
          </View>
        </View>
        {/* <FlatList
            data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ExerciseItem
                    exercise={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                />
                // <ExerciseItem
                //     exercise={item}
                // />
                )}
        /> */}
        <FlatList
            // data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            data={exerciseIds}
            keyExtractor={item => item}
            renderItem={({ item }) => (
                <ExerciseCard
                    exerciseId={item}
                    viewDetails={viewDetails}
                />
                )}
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
    },
    header: {
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
    icons: {
        flexDirection: 'row',
        marginLeft: 10,
    }
});

export default ExerciseList;