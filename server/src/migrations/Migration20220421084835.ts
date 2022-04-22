import { Migration } from '@mikro-orm/migrations';

export class Migration20220421084835 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "participant" add column "calendar_uuid" varchar(255) not null;');
    this.addSql('alter table "participant" add constraint "participant_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "participant" drop constraint "participant_calendar_uuid_foreign";');

    this.addSql('alter table "participant" drop column "calendar_uuid";');
  }

}
