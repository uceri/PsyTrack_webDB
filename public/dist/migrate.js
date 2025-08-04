import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema.js';
async function main() {
    const client = createClient({
        url: 'file:src/sqlite.db',
    });
    const db = drizzle(client, { schema });
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations finished!');
    process.exit(0);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map