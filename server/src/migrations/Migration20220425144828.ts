import { Migration } from '@mikro-orm/migrations';

export class Migration20220425144828 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" alter column "default_duration" type int using ("default_duration"::int);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" alter column "default_duration" type varchar(255) using ("default_duration"::varchar(255));');
  }

}
