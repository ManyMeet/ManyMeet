import { Migration } from '@mikro-orm/migrations';

export class Migration20220508173826 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "participant" add column "access_token" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "participant" drop column "access_token";');
  }

}
