import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryColumn({ nullable: false, unique: true })
  id!: number;

  @Column({ nullable: false })
  firstName!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;
}
