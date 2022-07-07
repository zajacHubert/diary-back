import { FieldPacket } from "mysql2";
import { NewTraining, TrainigToAdd } from "../types";
import { pool } from "../utils/db";
import { v4 as uuid } from 'uuid';
import { ValidationError } from "../utils/handleError";

type TrainingRecordResults = [TrainingRecord[], FieldPacket[]]

export class TrainingRecord implements TrainigToAdd {
    id: string;
    exerciseName: string;
    reps: string;
    weights: string;
    date: string;
    title: string;

    constructor(obj: NewTraining) {
        this.id = obj.id;
        this.exerciseName = obj.exerciseName;
        this.reps = obj.reps;
        this.weights = obj.weights;
        this.date = obj.date;
        this.title = obj.title;
    }

    static async getAll(): Promise<TrainingRecord[]> {
        const [results] = await pool.execute('SELECT DISTINCT `date`,`title` FROM `trainings` ORDER BY `date`') as TrainingRecordResults;
        return results.map(result => new TrainingRecord(result));
    }

    static async getOne(date: string, title: string): Promise<TrainingRecord[] | null> {

        const [results] = (await pool.execute("SELECT * FROM `trainings` WHERE `date`=:date AND  `title`=:title", {
            date,
            title,
        })) as TrainingRecordResults;
        return results.map(result => new TrainingRecord(result));
    }


    async insert() {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Takie treining już istnieje')
        }

        console.log('backend');


        await pool.execute('INSERT INTO `trainings` VALUES(:id, :title, :date, :exerciseName,:reps,:weights)', {
            id: this.id,
            title: this.title,
            date: this.date,
            exerciseName: this.exerciseName,
            reps: this.reps,
            weights: this.weights,
        })
    }

    async delete() {
        await pool.execute("DELETE FROM `trainings` WHERE `id`=:id", {
            id: this.id,
        })
    }
}


