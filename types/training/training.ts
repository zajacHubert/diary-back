export interface TrainigToAdd {
    id: string;
    exerciseName: string;
    reps: string;
    weights: string;
    date: string;
    title: string;
}

export interface NewTraining extends Omit<TrainigToAdd, 'id'> {
    id?: string;
}

