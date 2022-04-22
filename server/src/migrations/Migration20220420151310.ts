import { Migration } from '@mikro-orm/migrations';

export class Migration20220420151310 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "participant" ("uuid" varchar(255) not null, "email" varchar(255) not null, "type" text check ("type" in (\'client\', \'provider\')) not null, "name" varchar(255) not null);');
    this.addSql('alter table "participant" add constraint "participant_pkey" primary key ("uuid");');

    this.addSql('create table "event" ("_id" serial primary key, "id" varchar(255) not null, "start" timestamptz(0) not null, "title" varchar(255) not null, "end" timestamptz(0) not null, "provider_uuid" varchar(255) not null, "client_uuid" varchar(255) not null);');

    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "participant" ("uuid") on update cascade;');
    this.addSql('alter table "event" add constraint "event_client_uuid_foreign" foreign key ("client_uuid") references "participant" ("uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');

    this.addSql('alter table "event" drop constraint "event_client_uuid_foreign";');

    this.addSql('drop table if exists "participant" cascade;');

    this.addSql('drop table if exists "event" cascade;');
  }

}
