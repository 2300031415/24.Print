-- Seed Data for EasyXerox System (CLEAN PRODUCTION SEED: ONLY SUPER ADMIN)

-- Insert Super Admin (Login: easyxerox@gmail.com / Password: FFpvt@2026)
-- Hash generated via bcrypt (10 rounds)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'easyxerox@gmail.com',
    '$2a$10$DisYba8P71miEbPqI.lVhOqj5ufZWUp2a3iUd2baggOlfObN9zFmy', -- FFpvt@2026
    'EasyXerox Super Admin',
    '+919876543210',
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

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

-- Insert System Settings
INSERT INTO settings (setting_key, setting_value, description)
VALUES 
('company_info', '{"name": "EasyXerox Systems", "logo_url": "/logo.png", "support_email": "easyxerox@gmail.com", "support_phone": "+911800123456"}', 'Company details displayed on Kiosk Home'),
('system_rules', '{"max_upload_size_mb": 100, "upload_expiry_minutes": 120, "ad_rotation_seconds": 10}', 'System operational boundaries')
ON CONFLICT (setting_key) DO NOTHING;
