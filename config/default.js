module.exports = {
    app: {
        id: 'ms-planning',
        name: 'MS Planning',
        port: parseInt(process.env.APP_PORT, 10) || 8080
    },
    useGzip: process.env.USE_GZIP || false,
    logger: {
        level: process.env.APP_LOGLEVEL || 3 // Level 'warn', use 5 to disable, see app/helpers/ApplicationLogger for more details
    },
    requestLogger: {
        enabled: true
    },
    duplicateRequestsToHost: process.env.DUPLICATE_REQUESTS_TO_HOST || null,
    database: {
        postgres: {
            client: 'pg',
            debug: true,
            connection: {
                host: process.env.POSTGRES_HOST || 'localhost',
                user: process.env.POSTGRES_USER || 'postgres',
                password: process.env.POSTGRES_PASSWORD || '',
                database: process.env.POSTGRES_DB || 'stock_test',
                port: process.env.POSTGRES_PORT || '5432'
            },
            pool: {
                min: 0,
                max: 10
            },
            schema: process.env.POSTGRES_SCHEMA || 'public',
            seeds: {
                directory: './seeds'
            }
        }
    },
    pagination: {
        pageSize: 30,
        page: 1
    }
};
