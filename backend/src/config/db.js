const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'print_kiosk_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
});

let isPostgresAvailable = true;

// Pre-hashed passwords for seed users
// 'Admin@123' and 'Client@123'
const DEFAULT_HASH = bcrypt.hashSync('Admin@123', 10);

// In-Memory Database Store for dev fallback if local PostgreSQL is not running
const mockDb = {
    users: [
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            email: 'admin@printkiosk.com',
            password_hash: DEFAULT_HASH,
            full_name: 'System Super Admin',
            phone: '+919876543210',
            role: 'admin',
            status: 'active',
            refresh_token: null,
            created_at: new Date().toISOString()
        },
        {
            id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            email: 'owner@metroprints.com',
            password_hash: DEFAULT_HASH,
            full_name: 'Rajesh Kumar (Metro Prints)',
            phone: '+919812345678',
            role: 'client',
            status: 'active',
            refresh_token: null,
            created_at: new Date().toISOString()
        }
    ],
    clients: [
        {
            id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            user_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            business_name: 'Metro Xerox & Print Zone',
            contact_phone: '+919812345678',
            address: '102 Connaught Place, Block B',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            commission_rate: 80.00,
            status: 'active',
            created_at: new Date().toISOString()
        }
    ],
    machines: [
        {
            id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
            machine_code: 'KIOSK-001',
            name: 'Connaught Place Kiosk #1',
            client_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            location_address: 'Metro Station Gate 2, Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            qr_code_url: '',
            status: 'online',
            default_printer_name: 'HP_LaserJet_Pro_M404dn',
            printer_status: 'ready',
            ip_address: '192.168.1.105',
            created_at: new Date().toISOString()
        }
    ],
    pricing: [
        {
            id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
            machine_id: null,
            bw_single_page_price: 2.00,
            color_single_page_price: 10.00,
            bw_duplex_page_price: 3.50,
            color_duplex_page_price: 18.00,
            paper_size: 'A4',
            is_default: true,
            created_at: new Date().toISOString()
        }
    ],
    gst: [
        {
            id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
            tax_name: 'GST 18%',
            percentage: 18.00,
            cgst_percentage: 9.00,
            sgst_percentage: 9.00,
            igst_percentage: 18.00,
            is_active: true,
            created_at: new Date().toISOString()
        }
    ],
    advertisements: [
        {
            id: 'a1111111-9c0b-4ef8-bb6d-6bb9bd380a01',
            client_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            title: 'Metro Prints - Fast High-Speed Printing',
            media_url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80',
            media_type: 'image',
            duration_seconds: 10,
            status: 'approved',
            created_at: new Date().toISOString()
        },
        {
            id: 'a1111111-9c0b-4ef8-bb6d-6bb9bd380a02',
            client_id: null,
            title: 'Scan QR Code to Print Instantly from Mobile',
            media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            media_type: 'image',
            duration_seconds: 10,
            status: 'approved',
            created_at: new Date().toISOString()
        }
    ],
    machine_ads: [],
    uploads: [],
    payments: [],
    transactions: [],
    print_jobs: [],
    activity_logs: [],
    notifications: [],
    settings: [
        {
            setting_key: 'company_info',
            setting_value: { name: "PrintPulse Xerox Systems", logo_url: "/logo.png" }
        }
    ]
};

const query = async (text, params = []) => {
    if (isPostgresAvailable) {
        try {
            const res = await pool.query(text, params);
            return res;
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                console.warn('⚠️ Local PostgreSQL database not detected (ECONNREFUSED). Switching backend to In-Memory Fallback Mode.');
                isPostgresAvailable = false;
            } else {
                throw error;
            }
        }
    }

    // FALLBACK MOCK QUERY PROCESSOR
    return handleMockQuery(text, params);
};

function handleMockQuery(text, params) {
    const cleanText = text.trim().toLowerCase();

    // 1. SELECT Users by Email
    if (cleanText.includes('from users') && cleanText.includes('where u.email = $1')) {
        const email = (params[0] || '').toLowerCase().trim();
        const user = mockDb.users.find(u => u.email.toLowerCase() === email);
        const rows = user ? [{
            ...user,
            client_id: user.role === 'client' ? 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' : null,
            business_name: user.role === 'client' ? 'Metro Xerox & Print Zone' : null
        }] : [];
        return { rows, rowCount: rows.length };
    }

    // 2. SELECT User by ID
    if (cleanText.includes('from users') && cleanText.includes('where u.id = $1')) {
        const user = mockDb.users.find(u => u.id === params[0]);
        const rows = user ? [{
            ...user,
            client_id: user.role === 'client' ? 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' : null,
            business_name: user.role === 'client' ? 'Metro Xerox & Print Zone' : null
        }] : [];
        return { rows, rowCount: rows.length };
    }

    // 3. UPDATE User Refresh Token
    if (cleanText.includes('update users set refresh_token')) {
        const user = mockDb.users.find(u => u.id === params[1]);
        if (user) user.refresh_token = params[0];
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // 4. SELECT Machine by Code
    if (cleanText.includes('from machines') && (cleanText.includes('machine_code = $1') || cleanText.includes('m.id::text = $1'))) {
        const mCode = params[0];
        const machine = mockDb.machines.find(m => m.machine_code === mCode || m.id === mCode) || mockDb.machines[0];
        const rows = machine ? [{ ...machine, business_name: 'Metro Xerox & Print Zone' }] : [];
        return { rows, rowCount: rows.length };
    }

    // 5. SELECT Machines List
    if (cleanText.includes('from machines')) {
        const rows = mockDb.machines.map(m => ({ ...m, client_name: 'Metro Xerox & Print Zone', total_jobs_printed: mockDb.print_jobs.length }));
        return { rows, rowCount: rows.length };
    }

    // 6. SELECT Pricing
    if (cleanText.includes('from pricing')) {
        const rows = mockDb.pricing;
        return { rows, rowCount: rows.length };
    }

    // 7. SELECT GST
    if (cleanText.includes('from gst')) {
        const rows = mockDb.gst;
        return { rows, rowCount: rows.length };
    }

    // 8. SELECT Ads
    if (cleanText.includes('from advertisements')) {
        const rows = mockDb.advertisements.map(a => ({ ...a, client_name: 'Metro Xerox Zone' }));
        return { rows, rowCount: rows.length };
    }

    // 9. INSERT Upload
    if (cleanText.includes('insert into uploads')) {
        const uploadObj = {
            id: 'upl_' + Date.now(),
            upload_token: params[0],
            machine_id: params[1],
            original_filename: params[2],
            file_path: params[3],
            file_size_bytes: params[4],
            total_pages: params[5],
            mime_type: params[6],
            status: 'pending',
            created_at: new Date().toISOString()
        };
        mockDb.uploads.push(uploadObj);
        return { rows: [uploadObj], rowCount: 1 };
    }

    // 10. SELECT Upload by Token
    if (cleanText.includes('from uploads') && cleanText.includes('upload_token = $1')) {
        const upload = mockDb.uploads.find(u => u.upload_token === params[0] || u.id === params[0]);
        const rows = upload ? [{ ...upload, machine_code: 'KIOSK-001', machine_name: 'Connaught Place Kiosk #1' }] : [];
        return { rows, rowCount: rows.length };
    }

    // 11. INSERT Payment
    if (cleanText.includes('insert into payments')) {
        const payObj = {
            id: 'pay_' + Date.now(),
            upload_id: params[0],
            machine_id: params[1],
            razorpay_order_id: params[2],
            amount: params[3],
            currency: 'INR',
            status: 'pending',
            payment_method: 'upi',
            created_at: new Date().toISOString()
        };
        mockDb.payments.push(payObj);
        return { rows: [payObj], rowCount: 1 };
    }

    // 12. SELECT Payment by Razorpay Order ID
    if (cleanText.includes('from payments') && cleanText.includes('razorpay_order_id = $1')) {
        const payment = mockDb.payments.find(p => p.razorpay_order_id === params[0]) || mockDb.payments[mockDb.payments.length - 1];
        const upload = mockDb.uploads.find(u => u.id === payment?.upload_id) || mockDb.uploads[0];
        const machine = mockDb.machines.find(m => m.id === payment?.machine_id) || mockDb.machines[0];
        const rows = payment ? [{
            ...payment,
            file_path: upload?.file_path || '/uploads/sample.pdf',
            original_filename: upload?.original_filename || 'document.pdf',
            machine_code: machine.machine_code,
            client_id: machine.client_id,
            default_printer_name: machine.default_printer_name
        }] : [];
        return { rows, rowCount: rows.length };
    }

    // 13. UPDATE Payment
    if (cleanText.includes('update payments')) {
        const pay = mockDb.payments[mockDb.payments.length - 1];
        if (pay) pay.status = 'captured';
        return { rows: pay ? [pay] : [], rowCount: pay ? 1 : 0 };
    }

    // 14. INSERT Transaction & Print Job
    if (cleanText.includes('insert into transactions') || cleanText.includes('insert into print_jobs')) {
        const jobObj = {
            id: 'job_' + Date.now(),
            machine_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
            upload_id: 'upl_sample',
            payment_id: 'pay_sample',
            printer_name: 'HP_LaserJet_Pro_M404dn',
            copies: 1,
            color_mode: 'bw',
            duplex_mode: 'single',
            total_pages: 1,
            price_per_page: 2,
            subtotal_amount: 2,
            gst_amount: 0.36,
            total_amount: 2.36,
            status: 'queued',
            created_at: new Date().toISOString()
        };
        mockDb.print_jobs.push(jobObj);
        return { rows: [jobObj], rowCount: 1 };
    }

    // 15. SELECT Clients List
    if (cleanText.includes('from clients')) {
        const rows = mockDb.clients.map(c => ({ ...c, email: 'owner@metroprints.com', full_name: 'Rajesh Kumar', total_machines: 1, total_earnings: 1250.00 }));
        return { rows, rowCount: rows.length };
    }

    // 16. Admin / Client Dashboard Summaries
    if (cleanText.includes('count(*) from clients') || cleanText.includes('sum(amount)')) {
        return { rows: [{ count: '1', online_count: '1', total: '2450.00', today: '450.00', pages: '120', month: '2450.00' }], rowCount: 1 };
    }

    // Default Fallback Empty Result
    return { rows: [], rowCount: 0 };
}

module.exports = {
    pool,
    query,
};
