CREATE TABLE templates (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  placeholders JSONB NOT NULL,
  state VARCHAR(100),
  district VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE circle_rates (
  id BIGSERIAL PRIMARY KEY,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  circle_rate DECIMAL(15,2) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state, district)
);

CREATE TABLE document_generations (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT REFERENCES templates(id),
  user_id VARCHAR(255) NOT NULL,
  extracted_data JSONB,
  final_document TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_circle_rates_location ON circle_rates(state, district);
CREATE INDEX idx_document_generations_user ON document_generations(user_id);
