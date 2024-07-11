import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../constants/dataModels/excercise.model'; // Import the Exercise interface
import { getAllExercises } from '../utils/exerciseController'; // Import the API function to get all exercises

const ExerciseList = () => {
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

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={handleSearch}
            />
            <FlatList
                data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem}>
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text style={styles.exerciseDetail}>{item.description}</Text>
                        {/* Add more details if necessary */}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchInput: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    },
    listItem: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    exerciseDetail: {
        fontSize: 14,
        color: '#666',
    },
});

export default ExerciseList;