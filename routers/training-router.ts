import { Router } from "express";
import { TrainingRecord } from "../records/training.record";


export const trainingRouter = Router();

trainingRouter
    .get('/', async (req, res) => {

        const trainings = await TrainingRecord.getAll();
        res.json(trainings);
    })
    .get('/:date/:title', async (req, res) => {

        const training = await TrainingRecord.getOne(req.params.date, req.params.title);
        console.log(training);

        res.json(training);
    })
    .post('/', async (req, res) => {
        const newTraining = new TrainingRecord(req.body);

        await newTraining.insert();
    })
    .delete('/:date/:title', async (req, res) => {

        const trainingsToRemove = await TrainingRecord.getOne(req.params.date, req.params.title);
        console.log(trainingsToRemove)
        Promise.all(
            trainingsToRemove.map(async training => {
                await training.delete()
            })
        )

        res.json({
            isSuccess: true,
        })
    })

