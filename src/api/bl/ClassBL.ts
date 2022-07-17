import { getRepository } from 'typeorm';
import { Class } from '../entities/Class';
import { ClassAssign } from '../entities/ClassAssign';
import { Unit } from '../entities/Unit';
import { Utilities } from '../services/Utilities';

export class ClassBL {
  public static async getAvailableClasses(
    startDate: Date,
    endDate: Date,
    classTypeId: number,
    classFunctionalities: Array<string>,
    userGdudId: number
  ) {
    const classRepository = getRepository(Class);
    const qb = classRepository.createQueryBuilder('class');
    return await qb
      .select()
      .leftJoinAndSelect('class.owner', 'owner')
      .leftJoinAndSelect('class.type', 'type')
      .leftJoinAndSelect('class.functionality', 'functionality')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('unit.id')
          .from(Unit, 'unit')
          .leftJoin('unit.parent', 'parentUnit')
          .where('parentUnit.id = :gdudId')
          .getQuery();

        return `owner.id IN ${subQuery}`;
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('classAssign.assignedClass.id')
          .from(ClassAssign, 'classAssign')
          .leftJoin('classAssign.assignedClass', 'assignedClass')
          .leftJoin('assignedClass.type', 'type')
          .where('type.id = :classTypeId')
          .andWhere(
            'classAssign.startDate <= :endDate AND classAssign.endDate >= :startDate'
          )
          .getQuery();

        return `NOT (class.id IN ${subQuery})`;
      })
      .andWhere('type.id = :typeId', { typeId: classTypeId })
      .andWhere('functionality.id IN (:...functionalitiesIds)', { functionalitiesIds: classFunctionalities })
      .setParameter('gdudId', userGdudId)
      .setParameter('classTypeId', classTypeId)
      .setParameter('classFunctionalities', classFunctionalities)
      .setParameter(
        'startDate',
        Utilities.dateToTimestampWithoutTimezone(startDate)
      )
      .setParameter(
        'endDate',
        Utilities.dateToTimestampWithoutTimezone(endDate)
      )
      .getMany();
  }
}
