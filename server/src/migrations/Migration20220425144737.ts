import { Migration } from '@mikro-orm/migrations';

export class Migration20220425144737 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" add column "default_title" varchar(255) null, add column "default_duration" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" drop column "default_title";');
    this.addSql('alter table "calendar" drop column "default_duration";');
  }

}
