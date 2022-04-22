import { Migration } from '@mikro-orm/migrations';

export class Migration20220420151851 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" add column "title" varchar(255) not null, add column "start" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" drop column "title";');
    this.addSql('alter table "calendar" drop column "start";');
  }

}
