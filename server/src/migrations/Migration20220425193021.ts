import { Migration } from '@mikro-orm/migrations';

export class Migration20220425193021 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" rename column "default" to "default_location";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" rename column "default_location" to "default";');
  }

}
