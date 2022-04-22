import { Migration } from '@mikro-orm/migrations';

export class Migration20220420153234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');

    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "calendar" ("uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');

    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "participant" ("uuid") on update cascade;');
  }

}
