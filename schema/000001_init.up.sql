

CREATE  TABLE users ( 
    id            		 serial        not null unique,
	properties_id        integer,
	name                 varchar(255)  NOT NULL,
	login                varchar(255)  NOT NULL unique,
	password_hash        varchar(255)  NOT NULL,
	u_token              varchar(32)   NOT NULL unique
 );


CREATE  TABLE aquahubs ( 
    id            		 serial        	not null unique,
	user_id              integer  		NOT NULL,
	h_token              varchar(32)  	NOT NULL,
	title                varchar(255),
	description          varchar(255),
	sales                boolean DEFAULT false NOT NULL,
	CONSTRAINT aquahubs_user_id_fkey FOREIGN KEY ( user_id ) REFERENCES users( id )   
 );

CREATE  TABLE devices ( 
    id            		 serial        	not null unique,
	aquahub_id           integer  NOT NULL,
	local_id             integer DEFAULT '-1'::integer NOT NULL,
	title                varchar(255),
	sales                boolean DEFAULT false NOT NULL,
	description          varchar(255),
	CONSTRAINT devices_aquahub_id_fkey FOREIGN KEY ( aquahub_id ) REFERENCES aquahubs( id )   
 );

CREATE  TABLE sensors ( 
    id            		 serial        	not null unique,
	device_id            integer  NOT NULL,
	local_id             integer DEFAULT '-1'::integer,
	title                varchar(255),
	description          varchar(255),
	CONSTRAINT sensors_device_id_fkey FOREIGN KEY ( device_id ) REFERENCES devices( id )   
 );

CREATE  TABLE sensors_dataset ( 
    id            		 serial        	not null unique,
	user_id              integer  NOT NULL,
	aquahub_id           integer  NOT NULL,
	device_id            integer  NOT NULL,
	sensor_id            integer  NOT NULL,
	db_time              timestamp DEFAULT CURRENT_TIMESTAMP,
	user_time            timestamp,
	local_device_id      integer DEFAULT '-1'::integer NOT NULL,
	local_sensor_id      integer DEFAULT '-1'::integer NOT NULL,
	"value"              varchar(32)  NOT NULL,
	CONSTRAINT sensors_dataset_aquahub_id_fkey FOREIGN KEY ( aquahub_id ) REFERENCES aquahubs( id ),
	CONSTRAINT sensors_dataset_device_id_fkey FOREIGN KEY ( device_id ) REFERENCES devices( id ),
	CONSTRAINT sensors_dataset_sensor_id_fkey FOREIGN KEY ( sensor_id ) REFERENCES sensors( id ),
	CONSTRAINT sensors_dataset_user_id_fkey FOREIGN KEY ( user_id ) REFERENCES users( id )   
 );


CREATE  TABLE properties ( 
    id            		 serial        	not null unique,
	user_id              integer  NOT NULL,
	device_id            integer  NOT NULL,
	sensor_id            integer  NOT NULL,
	"type"               integer,
	"value"              varchar(255),
	value_json           json,
	CONSTRAINT properties_device_id_fkey FOREIGN KEY ( device_id ) REFERENCES devices( id ),
	CONSTRAINT properties_sensor_id_fkey FOREIGN KEY ( sensor_id ) REFERENCES sensors( id ),
	CONSTRAINT properties_user_id_fkey FOREIGN KEY ( user_id ) REFERENCES users( id )   
 );


CREATE  TABLE todo_items ( 
    id            		 serial        	not null unique,
	title                varchar(255)  NOT NULL,
	description          varchar(255),
	done                 boolean DEFAULT false NOT NULL
 );

CREATE  TABLE todo_lists ( 
    id            		 serial        	not null unique,
	title                varchar(255)  NOT NULL,
	description          varchar(255)
 );


CREATE  TABLE users_lists ( 
    id            		 serial        	not null unique,
	user_id              integer  NOT NULL,
	list_id              integer  NOT NULL,
	CONSTRAINT users_lists_list_id_fkey FOREIGN KEY ( list_id ) REFERENCES todo_lists( id ) ON DELETE CASCADE,
	CONSTRAINT users_lists_user_id_fkey FOREIGN KEY ( user_id ) REFERENCES users( id ) ON DELETE CASCADE  
 );


CREATE  TABLE lists_items ( 
    id            		 serial        	not null unique,
	item_id              integer  NOT NULL,
	list_id              integer  NOT NULL,
	CONSTRAINT lists_items_item_id_fkey FOREIGN KEY ( item_id ) REFERENCES todo_items( id ) ON DELETE CASCADE,
	CONSTRAINT lists_items_list_id_fkey FOREIGN KEY ( list_id ) REFERENCES todo_lists( id ) ON DELETE CASCADE  
 );

