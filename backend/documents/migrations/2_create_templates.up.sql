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

CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_circle_rates_location ON circle_rates(state, district);

-- Insert sample templates
INSERT INTO templates (name, type, content, placeholders, created_by) VALUES
('Sale Deed Template', 'sale-deed', 'SALE DEED

This deed of sale is executed on {{date}} between {{seller_name}} (Seller) and {{buyer_name}} (Buyer) for the property located at {{property_address}}.

Property Details:
Survey Number: {{survey_number}}
Area: {{land_area}} acres
Value: Rs. {{land_value}}

Witness:
{{witness_name}}', '["seller_name", "buyer_name", "property_address", "survey_number", "land_area", "land_value", "witness_name", "date"]', '1'),
('Rent Agreement Template', 'rent-agreement', 'RENT AGREEMENT

This agreement is made between {{landlord_name}} (Landlord) and {{tenant_name}} (Tenant) for the property at {{property_address}}.

Rent: Rs. {{monthly_rent}} per month
Security Deposit: Rs. {{security_deposit}}
Lease Period: {{lease_period}} months

Terms and Conditions:
1. Rent to be paid by {{rent_due_date}} of each month
2. {{additional_terms}}', '["landlord_name", "tenant_name", "property_address", "monthly_rent", "security_deposit", "lease_period", "rent_due_date", "additional_terms"]', '1');

-- Insert sample circle rates
INSERT INTO circle_rates (state, district, circle_rate, created_by) VALUES
('maharashtra', 'mumbai', 500000, '1'),
('maharashtra', 'pune', 300000, '1'),
('maharashtra', 'nashik', 150000, '1'),
('gujarat', 'ahmedabad', 250000, '1'),
('gujarat', 'surat', 200000, '1'),
('rajasthan', 'jaipur', 180000, '1'),
('rajasthan', 'udaipur', 120000, '1');
