-- public.vendors definition

-- Drop table

-- DROP TABLE public.vendors;

CREATE TABLE public.vendors (
	id bigserial NOT NULL,
	name varchar(128) NOT NULL,
	description text NULL,
	icon varchar(128) NULL,
	status int8 DEFAULT 1 NULL,
	created_time int8 NULL,
	updated_time int8 NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT vendors_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_vendors_deleted_at ON public.vendors USING btree (deleted_at);
CREATE UNIQUE INDEX uk_vendor_name_delete_at ON public.vendors USING btree (name, deleted_at);


-- public.models definition

-- Drop table

-- DROP TABLE public.models;

CREATE TABLE public.models (
	id bigserial NOT NULL,
	model_name varchar(128) NOT NULL,
	description text NULL,
	icon varchar(128) NULL,
	tags varchar(255) NULL,
	vendor_id int8 NULL,
	endpoints text NULL,
	status int8 DEFAULT 1 NULL,
	sync_official int8 DEFAULT 1 NULL,
	created_time int8 NULL,
	updated_time int8 NULL,
	deleted_at timestamptz NULL,
	name_rule int8 DEFAULT 0 NULL,
	CONSTRAINT models_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_models_deleted_at ON public.models USING btree (deleted_at);
CREATE INDEX idx_models_vendor_id ON public.models USING btree (vendor_id);
CREATE UNIQUE INDEX uk_model_name_delete_at ON public.models USING btree (model_name, deleted_at);


-- public.channels definition

-- Drop table

-- DROP TABLE public.channels;

CREATE TABLE public.channels (
	id bigserial NOT NULL,
	"type" int8 DEFAULT 0 NULL,
	"key" text NOT NULL,
	open_ai_organization text NULL,
	test_model text NULL,
	status int8 DEFAULT 1 NULL,
	"name" text NULL,
	weight int8 DEFAULT 0 NULL,
	created_time int8 NULL,
	test_time int8 NULL,
	response_time int8 NULL,
	base_url text DEFAULT ''::text NULL,
	other text NULL,
	balance numeric NULL,
	balance_updated_time int8 NULL,
	models text NULL,
	"group" varchar(64) DEFAULT 'default'::character varying NULL,
	used_quota int8 DEFAULT 0 NULL,
	model_mapping text NULL,
	status_code_mapping varchar(1024) DEFAULT ''::character varying NULL,
	priority int8 DEFAULT 0 NULL,
	auto_ban int8 DEFAULT 1 NULL,
	other_info text NULL,
	tag text NULL,
	setting text NULL,
	param_override text NULL,
	header_override text NULL,
	remark varchar(255) NULL,
	channel_info json NULL,
	settings text NULL,
	CONSTRAINT channels_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_channels_name ON public.channels USING btree (name);
CREATE INDEX idx_channels_tag ON public.channels USING btree (tag);