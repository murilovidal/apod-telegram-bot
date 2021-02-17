import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user" })
export class User {
  id(id: any, messageToUser: string) {
    throw new Error("Method not implemented.");
  }
  @PrimaryColumn({ name: "telegram_id", nullable: false, unique: true })
  telegramId!: number;

  @Column({ name: "first_name", nullable: false })
  firstName!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;
}
