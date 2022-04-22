import { Migration } from '@mikro-orm/migrations';

export class Migration20220420151858 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" add column "end" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" drop column "end";');
  }

}
