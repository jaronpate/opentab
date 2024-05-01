import {FormattingFilter, IDatabase, IMain} from 'pg-promise';

/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export class Helpers {

    /**
     * @param db
     * Automated database connection context/interface.
     *
     * If you ever need to access other repositories from this one,
     * you will have to replace type 'IDatabase<any>' with 'any'.
     *
     * @param pgp
     * Library's root, if ever needed, like to access 'helpers'
     * or other namespaces available from the root.
     */
    constructor(private db: IDatabase<any>, private pgp: IMain) {
        /*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
    }

    public sets(
        data: Record<string, unknown>,
        columns: (string | { name: string; cast?: string, mod?: FormattingFilter })[],
        prefix:string = ''
    ): string {
        // Create empty object to store valid data
        const valid_data: Record<string, unknown> = {};

        // Get a list of valid data keys
        const valid_data_keys = Object.keys(data).filter(key => columns.map(c => typeof c === 'string' ? c : c.name).includes(key));

        // Check if data is valid
        for (let i = 0; i < valid_data_keys.length; i++){
            const key = valid_data_keys[i];

            // If undefined, skip - use null to clear a column
            if (data[key] === undefined) {
                valid_data_keys.splice(i, 1);
                i--;
            };

            // Add to valid data
            valid_data[prefix + key] = data[key];
        }

        // Get a list of valid columns
        const valid_columns = columns.filter(c => valid_data_keys.includes(typeof c === 'string' ? c : c.name));
        
        // Add prefix to column names if needed
        valid_columns.map(it => {
            if (typeof it === 'string'){
                it = `${prefix}${it}`
            } else {
                it.name = `${prefix}${it.name}`
            }
            return it;
        });

        // Return formatted data
        return this.pgp.helpers.sets(valid_data, valid_columns);
    }
}