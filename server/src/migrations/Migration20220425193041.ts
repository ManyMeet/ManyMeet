import { Migration } from '@mikro-orm/migrations';

export class Migration20220425193041 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "calendar" rename column "default" to "default_description";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar" rename column "default_description" to "default";');
  }

}
