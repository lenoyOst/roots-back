import { getRepository, In, IsNull } from 'typeorm';
import { ClassFunctionality } from '../entities/ClassFunctionality';

export class ClassFunctionalityBL {
    public static async getAll() {
        const classFunctionalityRepository = getRepository(ClassFunctionality);

        return await classFunctionalityRepository.find();
    }
}
