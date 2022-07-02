import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('class_functionality')
export class ClassFunctionality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    public constructor(data?: ClassFunctionality) {
        if (data) {
            this.name = data.name;
        }
    }
}
