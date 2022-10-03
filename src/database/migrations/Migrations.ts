import { BaseDatabase } from "../BaseDatabase";
import { ShowDatabase } from "../ShowDatabase";
import { UserDatabase } from "../UserDatabase";

import { users, shows } from "./data";

class Migrations extends BaseDatabase {
  execute = async () => {
    try {
      console.log("Creating tables...");
      await this.createTables();
      console.log("Tables created successfully.");

      console.log("Populating tables...");
      await this.insertData();
      console.log("Tables populated successfully.");

      console.log("Migrations completed.");
    } catch (error) {
      console.log("FAILED! Error in migrations...");
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      console.log("Ending connection...");
      BaseDatabase.connection.destroy();
      console.log("Connection closed graciously.");
    }
  };

  createTables = async () => {
    await BaseDatabase.connection.raw(`
        DROP TABLE IF EXISTS ${ShowDatabase.TICKET_TABLE};
        DROP TABLE IF EXISTS ${ShowDatabase.SHOW_TABLE};
        DROP TABLE IF EXISTS ${UserDatabase.USER_TABLE};
        
        CREATE TABLE IF NOT EXISTS ${UserDatabase.USER_TABLE}(
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM("NORMAL", "ADMIN") DEFAULT "NORMAL" NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ${ShowDatabase.SHOW_TABLE}(
            id VARCHAR(255) PRIMARY KEY,
            band VARCHAR(255) NOT NULL,
            starts_at DATE NOT NULL,
            available_tickets INT DEFAULT 5000
        );

        CREATE TABLE IF NOT EXISTS ${ShowDatabase.TICKET_TABLE}(
            id VARCHAR(255) PRIMARY KEY,
            show_id VARCHAR(255) NOT NULL,
            FOREIGN KEY (show_id) REFERENCES ${ShowDatabase.SHOW_TABLE}(id),
            user_id VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES ${UserDatabase.USER_TABLE}(id)
        );
        `);
  };

  insertData = async () => {
    await BaseDatabase.connection(UserDatabase.USER_TABLE).insert(users);

    await BaseDatabase.connection(ShowDatabase.SHOW_TABLE).insert(shows);
  };
}

const migrations = new Migrations();
migrations.execute();
