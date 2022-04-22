import { Migration } from '@mikro-orm/migrations';

export class Migration20220418195749 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "refresh_token" type varchar(255) using ("refresh_token"::varchar(255));');
    this.addSql('alter table "user" alter column "refresh_token" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "refresh_token" type varchar(255) using ("refresh_token"::varchar(255));');
    this.addSql('alter table "user" alter column "refresh_token" set not null;');
  }

}
