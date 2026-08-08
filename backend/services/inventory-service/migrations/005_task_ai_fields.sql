ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS priority VARCHAR(20);

ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS assigned_forklift_id VARCHAR(50);

ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;

ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS actual_duration INTEGER;

ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP;

ALTER TABLE warehouse_task
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
