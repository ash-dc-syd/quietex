import { Migration } from "@medusajs/framework/mikro-orm/migrations"
export class Migration20261106050000 extends Migration {
 async up():Promise<void>{
 this.addSql(`create table if not exists "quietex_enquiry" (
 "id" text not null, "name" text not null, "email" text not null,
 "phone" text not null default '', "postcode" text not null,
 "product" text not null default '', "finish" text not null default '', "quantity" integer null,
 "message" text not null default '', "subject" text not null default '', "submission_key" text not null,
 "status" text check ("status" in ('new','contacted','closed')) not null default 'new',
 "email_status" text check ("email_status" in ('pending','sent','failed')) not null default 'pending',
 "email_attempts" integer not null default 0, "emailed_at" timestamptz null,
 "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null,
 constraint "quietex_enquiry_pkey" primary key ("id"));`)
 this.addSql(`create unique index if not exists "IDX_quietex_enquiry_submission_key_unique" on "quietex_enquiry" ("submission_key") where "deleted_at" is null;`)
 this.addSql(`create index if not exists "IDX_quietex_enquiry_deleted_at" on "quietex_enquiry" ("deleted_at") where "deleted_at" is null;`)
 }
 async down():Promise<void>{this.addSql('drop table if exists "quietex_enquiry" cascade;')}
}
