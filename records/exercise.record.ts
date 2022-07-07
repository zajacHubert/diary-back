import { FieldPacket } from "mysql2/promise";
import { ExerciseToAddToList, NewExercise, RemoveExerciseResponse } from "../types";
import { pool } from "../utils/db";
import { ValidationError } from "../utils/handleError";
import { v4 as uuid } from 'uuid';


type ExerciseRecordResults = [ExerciseRecord[], FieldPacket[]]

export class ExerciseRecord implements ExerciseToAddToList {
    id: string;
    exerciseName: string;

    constructor(obj: NewExercise) {
        if (!obj.exerciseName || obj.exerciseName.length > 50) {
            throw new ValidationError('Nazwa ćwiczenia nie może być pusta ani przekraczać 50 znaków');
        }
        this.id = obj.id;
        this.exerciseName = obj.exerciseName;
    }

    static async getAll(): Promise<ExerciseRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `exercises` ORDER BY `exerciseName`') as ExerciseRecordResults;
        return results.map(result => new ExerciseRecord(result));
    }

    static async getOne(id: string): Promise<ExerciseRecord | null> {
        const [results] = await pool.execute('SELECT * FROM `exercises` WHERE `id`=:id', {
            id,
        }) as ExerciseRecordResults;
        return results.length === 1 ? new ExerciseRecord(results[0]) : null;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Takie ćwiczenie już istnieje')
        }

        await pool.execute('INSERT INTO `exercises` VALUES(:id,:exerciseName)', {
            id: this.id,
            exerciseName: this.exerciseName,
        });

        return this.id;
    }

    async delete(): Promise<RemoveExerciseResponse> {
        if (!this.id) {
            throw new ValidationError('Nie ma ćwiczenia o podanym id')
        }

        await pool.execute('DELETE FROM `exercises` WHERE `id`=:id', {
            id: this.id,
        });

        return {
            isSuccess: true,
        }
    }
}