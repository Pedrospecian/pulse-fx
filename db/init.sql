-- Executado automaticamente na primeira subida do container postgres

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS indicators (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,

    source VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,

    unit VARCHAR(30),

    variation_period INTEGER NOT NULL,
    variation_type VARCHAR(30) NOT NULL,

    history_window INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS indicator_observations (
	id SERIAL PRIMARY KEY,

    indicator_id INTEGER NOT NULL
        REFERENCES indicators(id)
        ON DELETE CASCADE,

    reference_date DATE NOT NULL,

    value NUMERIC(18,6) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),

    UNIQUE (indicator_id, reference_date)
);

CREATE TABLE IF NOT EXISTS user_favorite_indicators (
	user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    indicator_id INTEGER NOT NULL
        REFERENCES indicators(id)
        ON DELETE CASCADE,

    PRIMARY KEY (user_id, indicator_id)
);

CREATE TABLE IF NOT EXISTS sync_log (
	id SERIAL PRIMARY KEY,

    source VARCHAR(20) NOT NULL,

    started_at TIMESTAMP NOT NULL,

    finished_at TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    message TEXT
);

CREATE INDEX idx_observations_indicator_date
ON indicator_observations (indicator_id, reference_date DESC);