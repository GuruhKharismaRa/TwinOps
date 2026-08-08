CREATE TABLE IF NOT EXISTS search_index (

    id SERIAL PRIMARY KEY,

    tenant_id VARCHAR(50),

    entity_type VARCHAR(50),

    entity_id VARCHAR(100),

    entity_code VARCHAR(100),

    entity_name VARCHAR(255),

    search_text TEXT,

    warehouse_id VARCHAR(50),

    metadata JSONB,

    url VARCHAR(500),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);
