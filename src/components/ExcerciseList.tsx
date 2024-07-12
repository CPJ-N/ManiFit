import React, { useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Exercise } from '../constants/dataModels/excercise.model'; // Import the Exercise interface
import { getAllExercises } from '../utils/exerciseController'; // Import the API function to get all exercises
import { EXERCISE_FORM } from '../constants/screenNames';
import ExerciseItem from './ExerciseItem';

function ExerciseList({navigation}) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchExercises = async () => {
            const fetchedExercises = await getAllExercises();
            console.log(fetchedExercises);
            setExercises(fetchedExercises);
        };
        fetchExercises();
    }, []);

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        // Add functionality to filter exercises based on search term
    };

    const handleEdit = (id: string) => {
        console.log('Edit:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete:', id);
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.greeting}>Hi, Madison</Text> */}
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
        <FlatList
            data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ExerciseItem
                    exercise={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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