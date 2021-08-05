import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'articles', schema: 'public' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'content_type' })
  contentType: string;

  constructor(title: string, content: string, id?: number) {
    super();
    this.id = id;
    this.title = title;
    this.content = content;
  }
}
