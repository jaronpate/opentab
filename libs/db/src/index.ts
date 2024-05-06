import pgPromise from "pg-promise"; // pg-promise core library
import { IInitOptions, IDatabase, IMain } from "pg-promise";
import { IExtensions } from "./repos";
import { Helpers } from "./repos/helpers";
export * from "./models";

const dbConfig = {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT!),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    allowExitOnIdle: true,
};

export type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
    // query: (e: any) => console.log('QUERY:', e.query),

    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.helpers = new Helpers(obj, pgp);
    },
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const db: ExtendedProtocol = pgp(dbConfig);

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export { db, pgp };
