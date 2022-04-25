import { Migration } from '@mikro-orm/migrations';

export class Migration20220425180623 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" add column "meta" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop column "meta";');
  }

}
