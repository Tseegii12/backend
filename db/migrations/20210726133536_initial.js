exports.up = async function (knex) {
  return knex.schema.raw(schema)
}

exports.down = async function (knex) {}

const schema = `
--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17 (Ubuntu 10.17-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.17 (Ubuntu 10.17-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
--

CREATE FUNCTION public.get_baraa_uldegdel(material_id_in integer, project_id_in integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
   ashiglasan_too integer;
   aguulah_uldegdel integer;
begin
   select sum(material_too) into ashiglasan_too from nyagtlan_material where material_id = material_id_in;
   if ashiglasan_too is null then ashiglasan_too = 0;
   end if;
   select sum(material_too) into aguulah_uldegdel from aguulah where material_id = material_id_in 
      and is_checked=true and project_id = project_id_in;
   if aguulah_uldegdel is null then aguulah_uldegdel = 0;
   end if;
   return aguulah_uldegdel-ashiglasan_too;
end;
$$;


--
--

CREATE FUNCTION public.getbaraauldegdel(project_id_in integer, material_id_in integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
   uldegdel integer;
   aguulah_niit integer;
   ajil_niit integer;
begin
   select sum(material_too) into aguulah_niit from material_ware where material_id = material_id_in and project_id = project_id_in;
   SELECT sum(work_material.material_too) into ajil_niit FROM work_material
INNER JOIN (
  SELECT field_work.*, pj_block_field.name AS field_name, pj_block_field.block_name, 
  pj_block_field.pj_name, pj_block_field.pj_id, room_plus.name AS room_name,
  room_plus.field_name as field_name1, room_plus.block_name as block_name1, 
  room_plus.pj_name as pj_name1, room_plus.pj_id1 FROM field_work
  LEFT JOIN ( 
        SELECT field.*, block.name AS block_name, project.name AS pj_name, project.id as pj_id FROM field
        INNER JOIN block ON field.block_id = block.id
        INNER JOIN project ON block.project_id = project.id) AS pj_block_field ON field_work.field_id = pj_block_field.id
  LEFT JOIN (
        SELECT field_room.*, field.name AS field_name, block.name AS block_name, project.name AS pj_name,
        project.id as pj_id1 FROM field_room
        INNER JOIN field ON field_room.field_id = field.id
        INNER JOIN block ON field.block_id = block.id
        INNER JOIN project ON block.project_id = project.id) AS room_plus ON field_work.field_room_id = room_plus.id
  ) AS table1 ON work_material.field_work_id = table1.id
  WHERE (table1.pj_id = project_id_in OR table1.pj_id1 = project_id_in) AND work_material.material_id = material_id_in; 
   return aguulah_niit-ajil_niit;
end;
$$;


--
--

CREATE FUNCTION public.new_material_code() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  newCode integer;
  start_number integer := 10000;
  last_number integer := 99999;
  begin 
    while start_number <= last_number loop
      if (select code from material where code = cast(start_number as text)) is null then
        return start_number;
        exit;
      end if;
        
      start_number := start_number + 1;
    end loop;
  END;
$$;


--
--

CREATE FUNCTION public.random_huruu_hee() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
   random_number integer;
   selected_worker worker%rowtype;
begin
   select floor(random() * 7000 + 3000)::int into random_number;
   select * from worker into selected_worker where huruu_hee = random_number::text;
   while found loop
      select floor(random() * 7000 + 3000)::int into random_number;
    select * from worker into selected_worker where huruu_hee = random_number::text;
   end loop;
   return random_number;
end;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_name text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    type_id integer,
    project_id integer
);


--
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.users.id;


--
--

CREATE TABLE public.aguulah (
    material_id integer,
    material_too integer,
    material_une numeric,
    date date DEFAULT now(),
    id integer NOT NULL,
    project_id integer,
    nyarav_id integer,
    buy_place_id integer,
    is_checked boolean DEFAULT false,
    padan_dugaar text
);



--
--

CREATE TABLE public.aguulah_log (
    material_id integer,
    nyarav_id integer,
    manager_id integer,
    nayrav_date timestamp with time zone,
    manager_date timestamp with time zone,
    manager_too integer,
    nyarav_too integer,
    pj_id integer,
    process_work_id integer
);



--
--

CREATE TABLE public.aguulah_place (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.aguulah_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.aguulah_place_id_seq OWNED BY public.aguulah_place.id;


--
--

CREATE TABLE public.block (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.block_id_seq OWNED BY public.block.id;


--
--

CREATE TABLE public.buy_place (
    name text,
    id integer NOT NULL,
    aguulah_place_id integer
);



--
--

CREATE SEQUENCE public.buy_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.buy_place_id_seq OWNED BY public.buy_place.id;


--
--

CREATE TABLE public.field (
    name text,
    id integer NOT NULL
);



--
--

CREATE TABLE public.field_material (
    work_id integer,
    material_id integer,
    field_id integer,
    zagvar_id integer,
    material_too integer,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.field_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.field_material_id_seq OWNED BY public.field_material.id;


--
--

CREATE SEQUENCE public.field_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.field_room_id_seq OWNED BY public.field.id;


--
--

CREATE TABLE public.zagvar (
    name text,
    id integer NOT NULL,
    zagvar_turul_id integer
);



--
--

CREATE SEQUENCE public.field_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.field_type_id_seq OWNED BY public.zagvar.id;


--
--

CREATE TABLE public.field_work (
    zagvar_id integer,
    work_id integer,
    field_id integer,
    id integer NOT NULL,
    hemjee numeric,
    hemjih_negj_id integer
);



--
--

CREATE TABLE public.floor (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.floor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.floor_id_seq OWNED BY public.floor.id;


--
--

CREATE TABLE public.hemjee (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.hemjee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.hemjee_id_seq OWNED BY public.hemjee.id;


--
--

CREATE TABLE public.user_type (
    id integer NOT NULL,
    name text NOT NULL
);



--
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.user_type.id;


--
--

CREATE TABLE public.irts (
    worker_id integer,
    date date DEFAULT CURRENT_DATE,
    id integer NOT NULL,
    tuluv_id integer,
    tsalin numeric,
    in_time timestamp without time zone,
    out_time timestamp without time zone,
    huruu_hee text
);



--
--

CREATE TABLE public.irts_date (
    manager_id integer,
    manager_name text,
    pj_name text,
    irsen text,
    uvchtei text,
    tasalsan text,
    chuluutei text,
    date date,
    pj_id integer
);



--
--

CREATE SEQUENCE public.irts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.irts_id_seq OWNED BY public.irts.id;


--
--

CREATE TABLE public.irts_total (
    manager_id integer,
    manager_name text,
    pj_name text,
    irsen text,
    uvchtei text,
    tasalsan text,
    chuluutei text
);



--
--

CREATE TABLE public.irts_tuluv (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.irts_tuluv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.irts_tuluv_id_seq OWNED BY public.irts_tuluv.id;


--
--

CREATE TABLE public.material (
    name text,
    id integer NOT NULL,
    code text,
    material_type_id integer,
    material_unit integer
);



--
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
--

CREATE TABLE public.material_type (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.material_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.material_type_id_seq OWNED BY public.material_type.id;


--
--

CREATE SEQUENCE public.material_ware_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.material_ware_id_seq OWNED BY public.aguulah.id;


--
--

CREATE TABLE public.mssql_table (
    userid integer,
    checktime timestamp without time zone,
    name text
);



--
--

CREATE TABLE public.nyagtlan_material (
    material_id integer,
    material_too integer,
    nyarav_id integer,
    date date,
    process_work_id integer,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.nyagtlan_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.nyagtlan_material_id_seq OWNED BY public.nyagtlan_material.id;


--
--

CREATE TABLE public.work_type (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.process_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.process_id_seq OWNED BY public.work_type.id;


--
--

CREATE TABLE public.process_img (
    process_id integer,
    id integer NOT NULL,
    img_url text
);



--
--

CREATE TABLE public.process_material (
    process_work_id integer,
    date date DEFAULT now(),
    material_too integer,
    id integer NOT NULL,
    material_id integer,
    is_action boolean DEFAULT false
);



--
--

CREATE TABLE public.process_work (
    comment text,
    id integer NOT NULL,
    field_work_id integer,
    is_done_2_admin boolean DEFAULT false,
    is_done_1_admin boolean DEFAULT false,
    is_start_2_admin boolean DEFAULT false,
    is_start_1_admin boolean DEFAULT false,
    start_date_manager date,
    finish_date_manager date,
    start_date1_admin date,
    finish_date1_admin date,
    start_date2_admin date,
    finish_date2_admin date,
    admin_id integer,
    manager_id integer,
    unit_id integer
);



--
--

CREATE TABLE public.project (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
--

CREATE TABLE public.request_replies (
    id integer NOT NULL,
    content text NOT NULL,
    creator json NOT NULL,
    request_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
--

CREATE SEQUENCE public.request_replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.request_replies_id_seq OWNED BY public.request_replies.id;


--
--

CREATE TABLE public.request_users (
    request_id integer NOT NULL,
    user_id integer NOT NULL
);



--
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    content text NOT NULL,
    creator json NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
--

CREATE TABLE public.unit (
    block_id integer,
    id integer NOT NULL,
    zagvar_id integer,
    floor_id integer,
    m2 text,
    project_id integer,
    name text
);



--
--

CREATE SEQUENCE public.room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.room_id_seq OWNED BY public.unit.id;


--
--

CREATE SEQUENCE public.room_work_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.room_work_id_seq OWNED BY public.field_work.id;


--
--

CREATE SEQUENCE public.tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.tools_id_seq OWNED BY public.process_work.id;


--
--

CREATE TABLE public.total_irts (
);



--
--

CREATE TABLE public.work (
    name text,
    work_type_id integer,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.work_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.work_id_seq OWNED BY public.work.id;


--
--

CREATE SEQUENCE public.work_material_add_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.work_material_add_id_seq OWNED BY public.process_material.id;


--
--

CREATE SEQUENCE public.work_material_tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.work_material_tool_id_seq OWNED BY public.process_img.id;


--
--

CREATE TABLE public.worker (
    ovog text,
    ner text,
    register text,
    utas_dugaar text,
    alban_tushaal text,
    manager_id integer,
    udur_tsalin numeric,
    ajild_orson_ognoo timestamp with time zone,
    comment text,
    id integer NOT NULL,
    tuluv_id integer,
    niigmiin_daatgal boolean,
    eruul_mend_daatgal boolean,
    huruu_hee character varying(4),
    is_active boolean DEFAULT true
);



--
--

CREATE SEQUENCE public.worker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.worker_id_seq OWNED BY public.worker.id;


--
--

CREATE TABLE public.zagvar_field (
    zagvar_id integer,
    field_id integer,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.zagvar_field_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.zagvar_field_id_seq OWNED BY public.zagvar_field.id;


--
--

CREATE TABLE public.zagvar_turul (
    name text,
    id integer NOT NULL
);



--
--

CREATE SEQUENCE public.zagvar_turul_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE public.zagvar_turul_id_seq OWNED BY public.zagvar_turul.id;


--
--

ALTER TABLE ONLY public.aguulah ALTER COLUMN id SET DEFAULT nextval('public.material_ware_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.aguulah_place ALTER COLUMN id SET DEFAULT nextval('public.aguulah_place_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.block ALTER COLUMN id SET DEFAULT nextval('public.block_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.buy_place ALTER COLUMN id SET DEFAULT nextval('public.buy_place_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.field ALTER COLUMN id SET DEFAULT nextval('public.field_room_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.field_material ALTER COLUMN id SET DEFAULT nextval('public.field_material_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.field_work ALTER COLUMN id SET DEFAULT nextval('public.room_work_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.floor ALTER COLUMN id SET DEFAULT nextval('public.floor_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.hemjee ALTER COLUMN id SET DEFAULT nextval('public.hemjee_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.irts ALTER COLUMN id SET DEFAULT nextval('public.irts_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.irts_tuluv ALTER COLUMN id SET DEFAULT nextval('public.irts_tuluv_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.material_type ALTER COLUMN id SET DEFAULT nextval('public.material_type_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.nyagtlan_material ALTER COLUMN id SET DEFAULT nextval('public.nyagtlan_material_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.process_img ALTER COLUMN id SET DEFAULT nextval('public.work_material_tool_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.process_material ALTER COLUMN id SET DEFAULT nextval('public.work_material_add_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.process_work ALTER COLUMN id SET DEFAULT nextval('public.tools_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.request_replies ALTER COLUMN id SET DEFAULT nextval('public.request_replies_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.unit ALTER COLUMN id SET DEFAULT nextval('public.room_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.work ALTER COLUMN id SET DEFAULT nextval('public.work_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.work_type ALTER COLUMN id SET DEFAULT nextval('public.process_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.worker ALTER COLUMN id SET DEFAULT nextval('public.worker_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.zagvar ALTER COLUMN id SET DEFAULT nextval('public.field_type_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.zagvar_field ALTER COLUMN id SET DEFAULT nextval('public.zagvar_field_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.zagvar_turul ALTER COLUMN id SET DEFAULT nextval('public.zagvar_turul_id_seq'::regclass);


--
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT accounts_email_key UNIQUE (name);


--
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.aguulah_place
    ADD CONSTRAINT aguulah_place_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.block
    ADD CONSTRAINT block_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.buy_place
    ADD CONSTRAINT buy_place_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT field_material_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.field
    ADD CONSTRAINT field_room_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.zagvar
    ADD CONSTRAINT field_type_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.floor
    ADD CONSTRAINT floor_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.hemjee
    ADD CONSTRAINT hemjee_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT irts_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.irts_tuluv
    ADD CONSTRAINT irts_tuluv_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.material_type
    ADD CONSTRAINT material_type_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT material_ware_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT nyagtlan_material_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.work_type
    ADD CONSTRAINT process_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.request_replies
    ADD CONSTRAINT request_replies_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT room_work_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT tools_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT work_material_add_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.process_img
    ADD CONSTRAINT work_material_tool_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.work
    ADD CONSTRAINT work_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT worker_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT zagvar_field_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.zagvar_turul
    ADD CONSTRAINT zagvar_turul_pkey PRIMARY KEY (id);


--
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT admin_constraint FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.buy_place
    ADD CONSTRAINT aguulah_place_constraint FOREIGN KEY (aguulah_place_id) REFERENCES public.aguulah_place(id);


--
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT block_constraint FOREIGN KEY (block_id) REFERENCES public.block(id);


--
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT buy_place_constraint FOREIGN KEY (buy_place_id) REFERENCES public.buy_place(id);


--
--

ALTER TABLE ONLY public.work
    ADD CONSTRAINT constraint_name FOREIGN KEY (work_type_id) REFERENCES public.work_type(id);


--
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT field_work_constraint FOREIGN KEY (field_work_id) REFERENCES public.field_work(id);


--
--

ALTER TABLE ONLY public.request_users
    ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
--

ALTER TABLE ONLY public.request_replies
    ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES public.requests(id);


--
--

ALTER TABLE ONLY public.request_users
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT floor_constraint FOREIGN KEY (floor_id) REFERENCES public.floor(id);


--
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT hemjee_constraint FOREIGN KEY (hemjih_negj_id) REFERENCES public.hemjee(id);


--
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT manager_constraint FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT manager_constraint FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_type FOREIGN KEY (material_type_id) REFERENCES public.material_type(id);


--
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_unit_constraint FOREIGN KEY (material_unit) REFERENCES public.hemjee(id);


--
--

ALTER TABLE ONLY public.process_img
    ADD CONSTRAINT process_constraint FOREIGN KEY (process_id) REFERENCES public.process_work(id);


--
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT process_work_constraint FOREIGN KEY (process_work_id) REFERENCES public.process_work(id);


--
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT process_work_constraint FOREIGN KEY (process_work_id) REFERENCES public.process_work(id);


--
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT tuluv_constraint FOREIGN KEY (tuluv_id) REFERENCES public.irts_tuluv(id);


--
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT tuluv_constraint FOREIGN KEY (tuluv_id) REFERENCES public.irts_tuluv(id);


--
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT type_constraint FOREIGN KEY (type_id) REFERENCES public.user_type(id);


--
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT unit_constraint FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT users_constraint FOREIGN KEY (nyarav_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT users_constraint FOREIGN KEY (nyarav_id) REFERENCES public.users(id);


--
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT work_constraint FOREIGN KEY (work_id) REFERENCES public.work(id);


--
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT work_constraint FOREIGN KEY (work_id) REFERENCES public.work(id);


--
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT worker_constraint FOREIGN KEY (worker_id) REFERENCES public.worker(id);


--
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
--

ALTER TABLE ONLY public.zagvar
    ADD CONSTRAINT zagvar_turul_constraint FOREIGN KEY (zagvar_turul_id) REFERENCES public.zagvar_turul(id);


--
-- PostgreSQL database dump complete
--

`
