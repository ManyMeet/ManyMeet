import { Migration } from '@mikro-orm/migrations';

export class Migration20220425193037 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" add column "default" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" drop column "default";');
  }

}
