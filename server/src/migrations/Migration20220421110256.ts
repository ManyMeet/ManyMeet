import { Migration } from '@mikro-orm/migrations';

export class Migration20220421110256 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');
    this.addSql('alter table "event" drop constraint "event_client_uuid_foreign";');

    this.addSql('alter table "event" alter column "provider_uuid" type varchar(255) using ("provider_uuid"::varchar(255));');
    this.addSql('alter table "event" alter column "provider_uuid" drop not null;');
    this.addSql('alter table "event" alter column "client_uuid" type varchar(255) using ("client_uuid"::varchar(255));');
    this.addSql('alter table "event" alter column "client_uuid" drop not null;');
    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "participant" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_client_uuid_foreign" foreign key ("client_uuid") references "participant" ("uuid") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');
    this.addSql('alter table "event" drop constraint "event_client_uuid_foreign";');

    this.addSql('alter table "event" alter column "provider_uuid" type varchar(255) using ("provider_uuid"::varchar(255));');
    this.addSql('alter table "event" alter column "provider_uuid" set not null;');
    this.addSql('alter table "event" alter column "client_uuid" type varchar(255) using ("client_uuid"::varchar(255));');
    this.addSql('alter table "event" alter column "client_uuid" set not null;');
    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "participant" ("uuid") on update cascade;');
    this.addSql('alter table "event" add constraint "event_client_uuid_foreign" foreign key ("client_uuid") references "participant" ("uuid") on update cascade;');
  }

}
