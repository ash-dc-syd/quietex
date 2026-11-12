import { Migration } from "@medusajs/framework/mikro-orm/migrations"
export class Migration20261112090000 extends Migration {
 async up():Promise<void>{this.addSql(`alter table "quietex_enquiry" add column if not exists "kind" text not null default 'enquiry', add column if not exists "room_photos" jsonb null, add column if not exists "consent_at" timestamptz null;`)}
 async down():Promise<void>{this.addSql(`alter table "quietex_enquiry" drop column if exists "kind", drop column if exists "room_photos", drop column if exists "consent_at";`)}
}
