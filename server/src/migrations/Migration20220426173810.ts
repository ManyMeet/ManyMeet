import { Migration } from '@mikro-orm/migrations';

export class Migration20220426173810 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "participant" add column "description" varchar(255) null, add column "subject" varchar(255) not null, add column "message" varchar(255) not null, add column "email_sent" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "participant" drop column "description";');
    this.addSql('alter table "participant" drop column "subject";');
    this.addSql('alter table "participant" drop column "message";');
    this.addSql('alter table "participant" drop column "email_sent";');
  }

}
