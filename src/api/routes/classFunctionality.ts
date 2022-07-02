import { Router } from 'express';
import { ClassFunctionalityBL } from '../bl/ClassFunctionalityBL';

const route = Router();

route.get('/', async (req, res) => {
    try {
        const classTypes = await ClassFunctionalityBL.getAll();

        res.json(classTypes).end();
    } catch (e) {
        res.status(500).end();
    }
});

export default route;
