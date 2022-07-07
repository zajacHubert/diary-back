export interface ExerciseToAddToTraining {
    exerciseName: string;
    reps: string;
    weights: string;
}

export interface ExerciseToAddToList {
    id: string;
    exerciseName: string;
}
export interface NewExercise extends Omit<ExerciseToAddToList, 'id'> {
    id?: string;
}

export interface RemoveExerciseResponse {
    isSuccess: true,
}

