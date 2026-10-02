const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const { pool } = require('../src/config/db');

async function wipeDatabaseKeepAdminOnly() {
    console.log('🧹 Wiping entire database (removing all clients, boards, transactions, ads)...');
    try {
        // Truncate all tables cascading
        await pool.query(`
            TRUNCATE TABLE 
                print_jobs, 
                transactions, 
                uploads, 
                machine_ads, 
                advertisements, 
                machines, 
                pricing, 
                gst, 
                clients, 
                activity_logs, 
                users 
            CASCADE;
        `);
        console.log('✅ All existing database tables truncated cleanly!');

        // Insert ONLY Super Admin User (easyxerox@gmail.com / FFpvt@2026)
        await pool.query(`
            INSERT INTO users (id, email, password_hash, full_name, phone, role, status)
            VALUES (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                'easyxerox@gmail.com',
                '$2a$10$DisYba8P71miEbPqI.lVhOqj5ufZWUp2a3iUd2baggOlfObN9zFmy',
                'EasyXerox Super Admin',
                '+919876543210',
                'admin',
                'active'
            ) ON CONFLICT (email) DO NOTHING;
        `);
        console.log('✅ Super Admin account created cleanly (easyxerox@gmail.com / FFpvt@2026)');

        // Insert Default Pricing
        await pool.query(`
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
        `);

        // Insert Default GST (18%)
        await pool.query(`
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
        `);

        // Insert System Settings
        await pool.query(`
            INSERT INTO settings (setting_key, setting_value, description)
            VALUES 
            ('company_info', '{"name": "EasyXerox Systems", "logo_url": "/logo.png", "support_email": "easyxerox@gmail.com", "support_phone": "+911800123456"}', 'Company details displayed on Kiosk Home'),
            ('system_rules', '{"max_upload_size_mb": 100, "upload_expiry_minutes": 120, "ad_rotation_seconds": 10}', 'System operational boundaries')
            ON CONFLICT (setting_key) DO NOTHING;
        `);

        console.log('🎉 Database reset complete! Database now contains ONLY Super Admin account (easyxerox@gmail.com).');
        process.exit(0);
    } catch (err) {
        console.error('❌ Reset failed:', err);
        process.exit(1);
    }
}

wipeDatabaseKeepAdminOnly();
