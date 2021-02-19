import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class Apod {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  url!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  explanation!: string;

  @Column({ nullable: false, name: "media_type" })
  mediaType!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date;
}
