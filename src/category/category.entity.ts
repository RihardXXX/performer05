import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: 'categories'})
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}
