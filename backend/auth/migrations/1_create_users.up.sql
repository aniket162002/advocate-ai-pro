CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'lawyer', 'user')),
  crn_number VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE document_generations (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT,
  user_id VARCHAR(255) NOT NULL,
  extracted_data JSONB,
  final_document TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_crn ON users(crn_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_document_generations_user ON document_generations(user_id);

-- Insert default admin user
INSERT INTO users (email, password_hash, role, first_name, last_name, created_at)
VALUES ('admin@advocateai.com', 'admin123', 'admin', 'Admin', 'User', NOW());

-- Insert sample lawyer
INSERT INTO users (email, password_hash, role, crn_number, first_name, last_name, created_at)
VALUES ('lawyer@advocateai.com', 'lawyer123', 'lawyer', 'CRN123456', 'John', 'Lawyer', NOW());

-- Insert sample user
INSERT INTO users (email, password_hash, role, first_name, last_name, created_at)
VALUES ('user@advocateai.com', 'user123', 'user', 'Jane', 'User', NOW());
