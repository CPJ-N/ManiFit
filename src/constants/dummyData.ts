import { Exercise } from "./dataModels/exercise.model";

const exercises: Exercise[] = [
    {
      id: "ex1",
      name: "Push-ups",
      description: "Standard push-ups exercise to strengthen the chest, shoulders, and triceps.",
      repetitions: 20,
      sets: 3,
      trainerId: "trainer123",
      category: "Strength",
      image: "https://example.com/images/push-ups.jpg",
      video: "https://example.com/videos/push-ups.mp4"
    },
    {
      id: "ex2",
      name: "Squats",
      description: "Squats help build leg muscles including your quadriceps, hamstrings, and calves.",
      repetitions: 15,
      sets: 3,
      weight: 40, // assuming weight is in kilograms
      trainerId: "trainer456",
      category: "Strength",
      image: "https://example.com/images/squats.jpg",
      video: "https://example.com/videos/squats.mp4"
    },
    {
      id: "ex3",
      name: "Plank",
      description: "The plank helps develop strength in the core, shoulders, arms, and glutes.",
      duration: 90, // duration in seconds
      trainerId: "trainer789",
      category: "Endurance",
      image: "https://example.com/images/plank.jpg",
      video: "https://example.com/videos/plank.mp4"
    },
    {
      id: "ex4",
      name: "Bicep Curls",
      description: "Bicep curls primarily work the biceps, brachialis, and forearm muscles.",
      repetitions: 12,
      sets: 4,
      weight: 15, // assuming weight is in kilograms
      trainerId: "trainer123",
      category: "Strength",
      image: "https://example.com/images/bicep-curls.jpg",
      video: "https://example.com/videos/bicep-curls.mp4"
    }
  ];
  
  export default exercises;