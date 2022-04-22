import { Migration } from '@mikro-orm/migrations';

export class Migration20220421153751 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_uuid_foreign";');
    this.addSql('alter table "event" drop constraint "event_client_uuid_foreign";');

    this.addSql('alter table "participant" drop constraint "participant_pkey";');
    this.addSql('alter table "participant" rename column "uuid" to "id";');
    this.addSql('alter table "participant" add constraint "participant_pkey" primary key ("id");');

    this.addSql('alter table "event" add column "provider_id" varchar(255) null, add column "client_id" varchar(255) null;');
    this.addSql('alter table "event" add constraint "event_provider_id_foreign" foreign key ("provider_id") references "participant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_client_id_foreign" foreign key ("client_id") references "participant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" drop column "provider_uuid";');
    this.addSql('alter table "event" drop column "client_uuid";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_provider_id_foreign";');
    this.addSql('alter table "event" drop constraint "event_client_id_foreign";');

    this.addSql('alter table "participant" drop constraint "participant_pkey";');
    this.addSql('alter table "participant" rename column "id" to "uuid";');
    this.addSql('alter table "participant" add constraint "participant_pkey" primary key ("uuid");');

    this.addSql('alter table "event" add column "provider_uuid" varchar(255) null, add column "client_uuid" varchar(255) null;');
    this.addSql('alter table "event" add constraint "event_provider_uuid_foreign" foreign key ("provider_uuid") references "participant" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_client_uuid_foreign" foreign key ("client_uuid") references "participant" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "event" drop column "provider_id";');
    this.addSql('alter table "event" drop column "client_id";');
  }

}
