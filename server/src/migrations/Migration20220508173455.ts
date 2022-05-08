import { Migration } from '@mikro-orm/migrations';

export class Migration20220508173455 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "refresh_token" varchar(255) null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "calendar" ("uuid" varchar(255) not null, "title" varchar(255) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "min_hour" varchar(255) not null, "max_hour" varchar(255) not null, "default_title" varchar(255) null, "default_duration" int null, "default_location" varchar(255) null, "default_description" varchar(255) null);');
    this.addSql('alter table "calendar" add constraint "calendar_pkey" primary key ("uuid");');

    this.addSql('create table "user_calendars" ("user_id" varchar(255) not null, "calendar_uuid" varchar(255) not null);');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_pkey" primary key ("user_id", "calendar_uuid");');

    this.addSql('create table "participant" ("id" varchar(255) not null, "email" varchar(255) not null, "type" text check ("type" in (\'client\', \'provider\')) not null, "name" varchar(255) not null, "description" varchar(255) null, "subject" varchar(255) not null, "message" varchar(255) not null, "email_sent" boolean not null, "calendar_uuid" varchar(255) not null);');
    this.addSql('alter table "participant" add constraint "participant_pkey" primary key ("id");');

    this.addSql('create table "event" ("_id" serial primary key, "id" varchar(255) not null, "start" timestamptz(0) not null, "title" varchar(255) not null, "end" timestamptz(0) not null, "meta" text null, "calendar_uuid" varchar(255) not null, "provider_id" varchar(255) null, "client_id" varchar(255) null);');

    this.addSql('alter table "user_calendars" add constraint "user_calendars_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "participant" add constraint "participant_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');

    this.addSql('alter table "event" add constraint "event_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');
    this.addSql('alter table "event" add constraint "event_provider_id_foreign" foreign key ("provider_id") references "participant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_client_id_foreign" foreign key ("client_id") references "participant" ("id") on update cascade on delete set null;');
  }

}
