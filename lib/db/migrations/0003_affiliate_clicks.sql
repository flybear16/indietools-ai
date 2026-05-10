--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_id" uuid NOT NULL,
	"referrer" varchar(500),
	"user_agent" text,
	"country" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clicks_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clicks_tool_id_idx" ON "clicks"("tool_id");
CREATE INDEX IF NOT EXISTS "clicks_created_at_idx" ON "clicks"("created_at");
