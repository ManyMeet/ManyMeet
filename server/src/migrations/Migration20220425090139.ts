import { Migration } from '@mikro-orm/migrations';

export class Migration20220425090139 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" add column "min_hour" varchar(255), add column "max_hour" varchar(255);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" drop column "min_hour";');
    this.addSql('alter table "calendar" drop column "max_hour";');
  }

}
