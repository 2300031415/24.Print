-- Seed Data for Xerox/Printing Kiosk System

-- Insert Super Admin (password: Admin@123)
-- Hash generated via bcrypt (10 rounds)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@printkiosk.com',
    '$2a$10$Eqh5x3Z6b7b0Yn4fMh11uuO2qXvV0Z3P4gX.Hk1Jz5w0Y1Z2X3Y4Z', -- Admin@123
    'System Super Admin',
    '+919876543210',
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert Client User (password: Client@123)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'owner@metroprints.com',
    '$2a$10$Eqh5x3Z6b7b0Yn4fMh11uuO2qXvV0Z3P4gX.Hk1Jz5w0Y1Z2X3Y4Z', -- Client@123
    'Rajesh Kumar (Metro Prints)',
    '+919812345678',
    'client',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert Client Profile
INSERT INTO clients (id, user_id, business_name, contact_phone, address, city, state, pincode, commission_rate, status)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Metro Xerox & Print Zone',
    '+919812345678',
    '102 Connaught Place, Block B',
    'New Delhi',
    'Delhi',
    '110001',
    80.00,
    'active'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert Machine (Kiosk-001)
INSERT INTO machines (id, machine_code, name, client_id, location_address, city, state, pincode, qr_code_url, status, default_printer_name, printer_status, ip_address)
VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'KIOSK-001',
    'Connaught Place Kiosk #1',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Metro Station Gate 2, Connaught Place',
    'New Delhi',
    'Delhi',
    '110001',
    'https://domain.com/upload/KIOSK-001',
    'online',
    'HP_LaserJet_Pro_M404dn',
    'ready',
    '192.168.1.105'
) ON CONFLICT (machine_code) DO NOTHING;

-- Insert Global Default Pricing (BW ₹2/page, Color ₹10/page)
INSERT INTO pricing (id, machine_id, bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size, is_default)
VALUES (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    NULL,
    2.00,
    10.00,
    3.50,
    18.00,
    'A4',
    true
) ON CONFLICT DO NOTHING;

-- Insert Machine Specific Pricing Override
INSERT INTO pricing (id, machine_id, bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size, is_default)
VALUES (
    'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    2.00,
    10.00,
    3.50,
    18.00,
    'A4',
    false
) ON CONFLICT DO NOTHING;

-- Insert Active GST Setting (18%)
INSERT INTO gst (id, tax_name, percentage, cgst_percentage, sgst_percentage, igst_percentage, is_active)
VALUES (
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    'GST 18%',
    18.00,
    9.00,
    9.00,
    18.00,
    true
) ON CONFLICT DO NOTHING;

-- Insert Sample Approved Advertisements
INSERT INTO advertisements (id, client_id, title, media_url, media_type, duration_seconds, status)
VALUES 
(
    'a1111111-9c0b-4ef8-bb6d-6bb9bd380a01',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Metro Prints - Fast High-Speed Printing',
    'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80',
    'image',
    10,
    'approved'
),
(
    'a1111111-9c0b-4ef8-bb6d-6bb9bd380a02',
    NULL,
    'Scan QR Code to Print Instantly from Mobile',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'image',
    10,
    'approved'
),
(
    'a1111111-9c0b-4ef8-bb6d-6bb9bd380a03',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Special Student Discount on Bulk Printing',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    'image',
    10,
    'approved'
)
ON CONFLICT DO NOTHING;

-- Map Advertisements to Machine
INSERT INTO machine_ads (machine_id, advertisement_id)
VALUES 
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a1111111-9c0b-4ef8-bb6d-6bb9bd380a01'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a1111111-9c0b-4ef8-bb6d-6bb9bd380a02'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a1111111-9c0b-4ef8-bb6d-6bb9bd380a03')
ON CONFLICT DO NOTHING;

-- Insert System Settings
INSERT INTO settings (setting_key, setting_value, description)
VALUES 
('company_info', '{"name": "PrintPulse Xerox Systems", "logo_url": "/logo.png", "support_email": "support@printpulse.com", "support_phone": "+911800123456"}', 'Company details displayed on Kiosk Home'),
('system_rules', '{"max_upload_size_mb": 100, "upload_expiry_minutes": 120, "ad_rotation_seconds": 10}', 'System operational boundaries')
ON CONFLICT (setting_key) DO NOTHING;
