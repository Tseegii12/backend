exports.up = function (knex) {
  knex.schema.raw(schema)
}

exports.down = function (knex) {}

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
-- Name: get_baraa_uldegdel(integer, integer); Type: FUNCTION; Schema: public; Owner: node_user
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


ALTER FUNCTION public.get_baraa_uldegdel(material_id_in integer, project_id_in integer) OWNER TO node_user;

--
-- Name: getbaraauldegdel(integer, integer); Type: FUNCTION; Schema: public; Owner: node_user
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


ALTER FUNCTION public.getbaraauldegdel(project_id_in integer, material_id_in integer) OWNER TO node_user;

--
-- Name: new_material_code(); Type: FUNCTION; Schema: public; Owner: node_user
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


ALTER FUNCTION public.new_material_code() OWNER TO node_user;

--
-- Name: random_huruu_hee(); Type: FUNCTION; Schema: public; Owner: node_user
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


ALTER FUNCTION public.random_huruu_hee() OWNER TO node_user;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_name text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    type_id integer,
    project_id integer
);


ALTER TABLE public.users OWNER TO node_user;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO node_user;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.users.id;


--
-- Name: aguulah; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.aguulah OWNER TO node_user;

--
-- Name: aguulah_log; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.aguulah_log OWNER TO node_user;

--
-- Name: aguulah_place; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.aguulah_place (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.aguulah_place OWNER TO node_user;

--
-- Name: aguulah_place_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.aguulah_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aguulah_place_id_seq OWNER TO node_user;

--
-- Name: aguulah_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.aguulah_place_id_seq OWNED BY public.aguulah_place.id;


--
-- Name: block; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.block (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.block OWNER TO node_user;

--
-- Name: block_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.block_id_seq OWNER TO node_user;

--
-- Name: block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.block_id_seq OWNED BY public.block.id;


--
-- Name: buy_place; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.buy_place (
    name text,
    id integer NOT NULL,
    aguulah_place_id integer
);


ALTER TABLE public.buy_place OWNER TO node_user;

--
-- Name: buy_place_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.buy_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buy_place_id_seq OWNER TO node_user;

--
-- Name: buy_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.buy_place_id_seq OWNED BY public.buy_place.id;


--
-- Name: field; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.field (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.field OWNER TO node_user;

--
-- Name: field_material; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.field_material (
    work_id integer,
    material_id integer,
    field_id integer,
    zagvar_id integer,
    material_too integer,
    id integer NOT NULL
);


ALTER TABLE public.field_material OWNER TO node_user;

--
-- Name: field_material_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.field_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.field_material_id_seq OWNER TO node_user;

--
-- Name: field_material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.field_material_id_seq OWNED BY public.field_material.id;


--
-- Name: field_room_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.field_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.field_room_id_seq OWNER TO node_user;

--
-- Name: field_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.field_room_id_seq OWNED BY public.field.id;


--
-- Name: zagvar; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.zagvar (
    name text,
    id integer NOT NULL,
    zagvar_turul_id integer
);


ALTER TABLE public.zagvar OWNER TO node_user;

--
-- Name: field_type_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.field_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.field_type_id_seq OWNER TO node_user;

--
-- Name: field_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.field_type_id_seq OWNED BY public.zagvar.id;


--
-- Name: field_work; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.field_work (
    zagvar_id integer,
    work_id integer,
    field_id integer,
    id integer NOT NULL,
    hemjee numeric,
    hemjih_negj_id integer
);


ALTER TABLE public.field_work OWNER TO node_user;

--
-- Name: floor; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.floor (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.floor OWNER TO node_user;

--
-- Name: floor_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.floor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.floor_id_seq OWNER TO node_user;

--
-- Name: floor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.floor_id_seq OWNED BY public.floor.id;


--
-- Name: hemjee; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.hemjee (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.hemjee OWNER TO node_user;

--
-- Name: hemjee_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.hemjee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hemjee_id_seq OWNER TO node_user;

--
-- Name: hemjee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.hemjee_id_seq OWNED BY public.hemjee.id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.user_type (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.user_type OWNER TO node_user;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO node_user;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.user_type.id;


--
-- Name: irts; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.irts OWNER TO node_user;

--
-- Name: irts_date; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.irts_date OWNER TO node_user;

--
-- Name: irts_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.irts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.irts_id_seq OWNER TO node_user;

--
-- Name: irts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.irts_id_seq OWNED BY public.irts.id;


--
-- Name: irts_total; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.irts_total OWNER TO node_user;

--
-- Name: irts_tuluv; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.irts_tuluv (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.irts_tuluv OWNER TO node_user;

--
-- Name: irts_tuluv_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.irts_tuluv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.irts_tuluv_id_seq OWNER TO node_user;

--
-- Name: irts_tuluv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.irts_tuluv_id_seq OWNED BY public.irts_tuluv.id;


--
-- Name: material; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.material (
    name text,
    id integer NOT NULL,
    code text,
    material_type_id integer,
    material_unit integer
);


ALTER TABLE public.material OWNER TO node_user;

--
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_id_seq OWNER TO node_user;

--
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- Name: material_type; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.material_type (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.material_type OWNER TO node_user;

--
-- Name: material_type_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.material_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_type_id_seq OWNER TO node_user;

--
-- Name: material_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.material_type_id_seq OWNED BY public.material_type.id;


--
-- Name: material_ware_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.material_ware_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_ware_id_seq OWNER TO node_user;

--
-- Name: material_ware_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.material_ware_id_seq OWNED BY public.aguulah.id;


--
-- Name: mssql_table; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.mssql_table (
    userid integer,
    checktime timestamp without time zone,
    name text
);


ALTER TABLE public.mssql_table OWNER TO node_user;

--
-- Name: nyagtlan_material; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.nyagtlan_material (
    material_id integer,
    material_too integer,
    nyarav_id integer,
    date date,
    process_work_id integer,
    id integer NOT NULL
);


ALTER TABLE public.nyagtlan_material OWNER TO node_user;

--
-- Name: nyagtlan_material_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.nyagtlan_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nyagtlan_material_id_seq OWNER TO node_user;

--
-- Name: nyagtlan_material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.nyagtlan_material_id_seq OWNED BY public.nyagtlan_material.id;


--
-- Name: work_type; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.work_type (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.work_type OWNER TO node_user;

--
-- Name: process_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.process_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.process_id_seq OWNER TO node_user;

--
-- Name: process_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.process_id_seq OWNED BY public.work_type.id;


--
-- Name: process_img; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.process_img (
    process_id integer,
    id integer NOT NULL,
    img_url text
);


ALTER TABLE public.process_img OWNER TO node_user;

--
-- Name: process_material; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.process_material (
    process_work_id integer,
    date date DEFAULT now(),
    material_too integer,
    id integer NOT NULL,
    material_id integer,
    is_action boolean DEFAULT false
);


ALTER TABLE public.process_material OWNER TO node_user;

--
-- Name: process_work; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.process_work OWNER TO node_user;

--
-- Name: project; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.project (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.project OWNER TO node_user;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_id_seq OWNER TO node_user;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: request_replies; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.request_replies (
    id integer NOT NULL,
    content text NOT NULL,
    creator json NOT NULL,
    request_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.request_replies OWNER TO node_user;

--
-- Name: request_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.request_replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_replies_id_seq OWNER TO node_user;

--
-- Name: request_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.request_replies_id_seq OWNED BY public.request_replies.id;


--
-- Name: request_users; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.request_users (
    request_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.request_users OWNER TO node_user;

--
-- Name: requests; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    content text NOT NULL,
    creator json NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.requests OWNER TO node_user;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO node_user;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: unit; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.unit OWNER TO node_user;

--
-- Name: room_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_id_seq OWNER TO node_user;

--
-- Name: room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.room_id_seq OWNED BY public.unit.id;


--
-- Name: room_work_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.room_work_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_work_id_seq OWNER TO node_user;

--
-- Name: room_work_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.room_work_id_seq OWNED BY public.field_work.id;


--
-- Name: tools_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tools_id_seq OWNER TO node_user;

--
-- Name: tools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.tools_id_seq OWNED BY public.process_work.id;


--
-- Name: total_irts; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.total_irts (
);


ALTER TABLE public.total_irts OWNER TO node_user;

--
-- Name: work; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.work (
    name text,
    work_type_id integer,
    id integer NOT NULL
);


ALTER TABLE public.work OWNER TO node_user;

--
-- Name: work_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.work_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_id_seq OWNER TO node_user;

--
-- Name: work_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.work_id_seq OWNED BY public.work.id;


--
-- Name: work_material_add_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.work_material_add_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_material_add_id_seq OWNER TO node_user;

--
-- Name: work_material_add_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.work_material_add_id_seq OWNED BY public.process_material.id;


--
-- Name: work_material_tool_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.work_material_tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_material_tool_id_seq OWNER TO node_user;

--
-- Name: work_material_tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.work_material_tool_id_seq OWNED BY public.process_img.id;


--
-- Name: worker; Type: TABLE; Schema: public; Owner: node_user
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


ALTER TABLE public.worker OWNER TO node_user;

--
-- Name: worker_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.worker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.worker_id_seq OWNER TO node_user;

--
-- Name: worker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.worker_id_seq OWNED BY public.worker.id;


--
-- Name: zagvar_field; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.zagvar_field (
    zagvar_id integer,
    field_id integer,
    id integer NOT NULL
);


ALTER TABLE public.zagvar_field OWNER TO node_user;

--
-- Name: zagvar_field_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.zagvar_field_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.zagvar_field_id_seq OWNER TO node_user;

--
-- Name: zagvar_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.zagvar_field_id_seq OWNED BY public.zagvar_field.id;


--
-- Name: zagvar_turul; Type: TABLE; Schema: public; Owner: node_user
--

CREATE TABLE public.zagvar_turul (
    name text,
    id integer NOT NULL
);


ALTER TABLE public.zagvar_turul OWNER TO node_user;

--
-- Name: zagvar_turul_id_seq; Type: SEQUENCE; Schema: public; Owner: node_user
--

CREATE SEQUENCE public.zagvar_turul_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.zagvar_turul_id_seq OWNER TO node_user;

--
-- Name: zagvar_turul_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: node_user
--

ALTER SEQUENCE public.zagvar_turul_id_seq OWNED BY public.zagvar_turul.id;


--
-- Name: aguulah id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah ALTER COLUMN id SET DEFAULT nextval('public.material_ware_id_seq'::regclass);


--
-- Name: aguulah_place id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah_place ALTER COLUMN id SET DEFAULT nextval('public.aguulah_place_id_seq'::regclass);


--
-- Name: block id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.block ALTER COLUMN id SET DEFAULT nextval('public.block_id_seq'::regclass);


--
-- Name: buy_place id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.buy_place ALTER COLUMN id SET DEFAULT nextval('public.buy_place_id_seq'::regclass);


--
-- Name: field id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field ALTER COLUMN id SET DEFAULT nextval('public.field_room_id_seq'::regclass);


--
-- Name: field_material id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material ALTER COLUMN id SET DEFAULT nextval('public.field_material_id_seq'::regclass);


--
-- Name: field_work id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work ALTER COLUMN id SET DEFAULT nextval('public.room_work_id_seq'::regclass);


--
-- Name: floor id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.floor ALTER COLUMN id SET DEFAULT nextval('public.floor_id_seq'::regclass);


--
-- Name: hemjee id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.hemjee ALTER COLUMN id SET DEFAULT nextval('public.hemjee_id_seq'::regclass);


--
-- Name: irts id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts ALTER COLUMN id SET DEFAULT nextval('public.irts_id_seq'::regclass);


--
-- Name: irts_tuluv id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts_tuluv ALTER COLUMN id SET DEFAULT nextval('public.irts_tuluv_id_seq'::regclass);


--
-- Name: material id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- Name: material_type id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material_type ALTER COLUMN id SET DEFAULT nextval('public.material_type_id_seq'::regclass);


--
-- Name: nyagtlan_material id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.nyagtlan_material ALTER COLUMN id SET DEFAULT nextval('public.nyagtlan_material_id_seq'::regclass);


--
-- Name: process_img id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_img ALTER COLUMN id SET DEFAULT nextval('public.work_material_tool_id_seq'::regclass);


--
-- Name: process_material id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_material ALTER COLUMN id SET DEFAULT nextval('public.work_material_add_id_seq'::regclass);


--
-- Name: process_work id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work ALTER COLUMN id SET DEFAULT nextval('public.tools_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: request_replies id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.request_replies ALTER COLUMN id SET DEFAULT nextval('public.request_replies_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: unit id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit ALTER COLUMN id SET DEFAULT nextval('public.room_id_seq'::regclass);


--
-- Name: user_type id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: work id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.work ALTER COLUMN id SET DEFAULT nextval('public.work_id_seq'::regclass);


--
-- Name: work_type id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.work_type ALTER COLUMN id SET DEFAULT nextval('public.process_id_seq'::regclass);


--
-- Name: worker id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.worker ALTER COLUMN id SET DEFAULT nextval('public.worker_id_seq'::regclass);


--
-- Name: zagvar id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar ALTER COLUMN id SET DEFAULT nextval('public.field_type_id_seq'::regclass);


--
-- Name: zagvar_field id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_field ALTER COLUMN id SET DEFAULT nextval('public.zagvar_field_id_seq'::regclass);


--
-- Name: zagvar_turul id; Type: DEFAULT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_turul ALTER COLUMN id SET DEFAULT nextval('public.zagvar_turul_id_seq'::regclass);


--
-- Name: users accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT accounts_email_key UNIQUE (name);


--
-- Name: users accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: aguulah_place aguulah_place_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah_place
    ADD CONSTRAINT aguulah_place_pkey PRIMARY KEY (id);


--
-- Name: block block_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.block
    ADD CONSTRAINT block_pkey PRIMARY KEY (id);


--
-- Name: buy_place buy_place_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.buy_place
    ADD CONSTRAINT buy_place_pkey PRIMARY KEY (id);


--
-- Name: field_material field_material_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT field_material_pkey PRIMARY KEY (id);


--
-- Name: field field_room_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field
    ADD CONSTRAINT field_room_pkey PRIMARY KEY (id);


--
-- Name: zagvar field_type_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar
    ADD CONSTRAINT field_type_pkey PRIMARY KEY (id);


--
-- Name: floor floor_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.floor
    ADD CONSTRAINT floor_pkey PRIMARY KEY (id);


--
-- Name: hemjee hemjee_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.hemjee
    ADD CONSTRAINT hemjee_pkey PRIMARY KEY (id);


--
-- Name: user_type ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: irts irts_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT irts_pkey PRIMARY KEY (id);


--
-- Name: irts_tuluv irts_tuluv_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts_tuluv
    ADD CONSTRAINT irts_tuluv_pkey PRIMARY KEY (id);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- Name: material_type material_type_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material_type
    ADD CONSTRAINT material_type_pkey PRIMARY KEY (id);


--
-- Name: aguulah material_ware_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT material_ware_pkey PRIMARY KEY (id);


--
-- Name: nyagtlan_material nyagtlan_material_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT nyagtlan_material_pkey PRIMARY KEY (id);


--
-- Name: work_type process_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.work_type
    ADD CONSTRAINT process_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: request_replies request_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.request_replies
    ADD CONSTRAINT request_replies_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: unit room_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: field_work room_work_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT room_work_pkey PRIMARY KEY (id);


--
-- Name: process_work tools_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT tools_pkey PRIMARY KEY (id);


--
-- Name: process_material work_material_add_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT work_material_add_pkey PRIMARY KEY (id);


--
-- Name: process_img work_material_tool_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_img
    ADD CONSTRAINT work_material_tool_pkey PRIMARY KEY (id);


--
-- Name: work work_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.work
    ADD CONSTRAINT work_pkey PRIMARY KEY (id);


--
-- Name: worker worker_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT worker_pkey PRIMARY KEY (id);


--
-- Name: zagvar_field zagvar_field_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT zagvar_field_pkey PRIMARY KEY (id);


--
-- Name: zagvar_turul zagvar_turul_pkey; Type: CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_turul
    ADD CONSTRAINT zagvar_turul_pkey PRIMARY KEY (id);


--
-- Name: process_work admin_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT admin_constraint FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: buy_place aguulah_place_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.buy_place
    ADD CONSTRAINT aguulah_place_constraint FOREIGN KEY (aguulah_place_id) REFERENCES public.aguulah_place(id);


--
-- Name: unit block_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT block_constraint FOREIGN KEY (block_id) REFERENCES public.block(id);


--
-- Name: aguulah buy_place_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT buy_place_constraint FOREIGN KEY (buy_place_id) REFERENCES public.buy_place(id);


--
-- Name: work constraint_name; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.work
    ADD CONSTRAINT constraint_name FOREIGN KEY (work_type_id) REFERENCES public.work_type(id);


--
-- Name: zagvar_field field_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
-- Name: field_work field_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
-- Name: field_material field_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT field_constraint FOREIGN KEY (field_id) REFERENCES public.field(id);


--
-- Name: process_work field_work_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT field_work_constraint FOREIGN KEY (field_work_id) REFERENCES public.field_work(id);


--
-- Name: request_users fk_request; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.request_users
    ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: request_replies fk_request; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.request_replies
    ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES public.requests(id);


--
-- Name: request_users fk_user; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.request_users
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: unit floor_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT floor_constraint FOREIGN KEY (floor_id) REFERENCES public.floor(id);


--
-- Name: field_work hemjee_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT hemjee_constraint FOREIGN KEY (hemjih_negj_id) REFERENCES public.hemjee(id);


--
-- Name: process_work manager_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT manager_constraint FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
-- Name: worker manager_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT manager_constraint FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
-- Name: field_material material_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: process_material material_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: nyagtlan_material material_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: aguulah material_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT material_constraint FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: material material_type; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_type FOREIGN KEY (material_type_id) REFERENCES public.material_type(id);


--
-- Name: material material_unit_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_unit_constraint FOREIGN KEY (material_unit) REFERENCES public.hemjee(id);


--
-- Name: process_img process_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_img
    ADD CONSTRAINT process_constraint FOREIGN KEY (process_id) REFERENCES public.process_work(id);


--
-- Name: process_material process_work_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_material
    ADD CONSTRAINT process_work_constraint FOREIGN KEY (process_work_id) REFERENCES public.process_work(id);


--
-- Name: nyagtlan_material process_work_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT process_work_constraint FOREIGN KEY (process_work_id) REFERENCES public.process_work(id);


--
-- Name: unit project_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: users project_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: aguulah project_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT project_constraint FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: irts tuluv_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT tuluv_constraint FOREIGN KEY (tuluv_id) REFERENCES public.irts_tuluv(id);


--
-- Name: worker tuluv_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.worker
    ADD CONSTRAINT tuluv_constraint FOREIGN KEY (tuluv_id) REFERENCES public.irts_tuluv(id);


--
-- Name: users type_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT type_constraint FOREIGN KEY (type_id) REFERENCES public.user_type(id);


--
-- Name: process_work unit_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.process_work
    ADD CONSTRAINT unit_constraint FOREIGN KEY (unit_id) REFERENCES public.unit(id);


--
-- Name: nyagtlan_material users_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.nyagtlan_material
    ADD CONSTRAINT users_constraint FOREIGN KEY (nyarav_id) REFERENCES public.users(id);


--
-- Name: aguulah users_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.aguulah
    ADD CONSTRAINT users_constraint FOREIGN KEY (nyarav_id) REFERENCES public.users(id);


--
-- Name: field_work work_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT work_constraint FOREIGN KEY (work_id) REFERENCES public.work(id);


--
-- Name: field_material work_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT work_constraint FOREIGN KEY (work_id) REFERENCES public.work(id);


--
-- Name: irts worker_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.irts
    ADD CONSTRAINT worker_constraint FOREIGN KEY (worker_id) REFERENCES public.worker(id);


--
-- Name: unit zagvar_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
-- Name: zagvar_field zagvar_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar_field
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
-- Name: field_work zagvar_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_work
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
-- Name: field_material zagvar_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.field_material
    ADD CONSTRAINT zagvar_constraint FOREIGN KEY (zagvar_id) REFERENCES public.zagvar(id);


--
-- Name: zagvar zagvar_turul_constraint; Type: FK CONSTRAINT; Schema: public; Owner: node_user
--

ALTER TABLE ONLY public.zagvar
    ADD CONSTRAINT zagvar_turul_constraint FOREIGN KEY (zagvar_turul_id) REFERENCES public.zagvar_turul(id);


--
-- PostgreSQL database dump complete
--

`
