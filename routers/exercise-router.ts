import { Router } from "express";
import { ExerciseRecord } from "../records/exercise.record";


export const exerciseRouter = Router();

exerciseRouter
    .get('/', async (req, res) => {
        const exercises = await ExerciseRecord.getAll();
        res.json({
            exercises,
        });
    })
    .post('/', async (req, res) => {
        const exerciseToInsert = new ExerciseRecord(req.body);
        const newId = await exerciseToInsert.insert();
        res.json({
            newId,
        })
    })
    .delete('/:id', async (req, res) => {
        const exerciseToRemove = await ExerciseRecord.getOne(req.params.id);
        await exerciseToRemove.delete();
        res.json({
            isSuccess: true,
        })
    })

