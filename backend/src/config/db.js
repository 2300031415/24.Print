const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    ssl: (process.env.DB_HOST && process.env.DB_HOST.includes('supabase')) ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

let isPostgresAvailable = false;


// Pre-hashed passwords for seed users
const ADMIN_HASH = bcrypt.hashSync('Admin@123', 10);
const CLIENT_HASH = bcrypt.hashSync('Client@123', 10);

// In-Memory Database Store for dev fallback if local PostgreSQL is not running
const mockDb = {
    users: [
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            email: 'admin@printkiosk.com',
            password_hash: ADMIN_HASH,
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
            password_hash: CLIENT_HASH,
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
            default_printer_name: 'Brother DCP-T820DW Printer',

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
    advertisements: [],
    machine_ads: [],
    uploads: [],
    payments: [],
    transactions: [],
    print_jobs: [
        {
            id: 'job_101928371',
            machine_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
            machine_code: 'KIOSK-001',
            upload_id: 'upl_sample1',
            original_filename: 'Aadhaar_Card_Copy.pdf',
            copies: 2,
            color_mode: 'bw',
            duplex_mode: 'single',
            total_pages: 1,
            total_amount: '4.00',
            status: 'completed',
            created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'job_101928372',
            machine_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
            machine_code: 'KIOSK-001',
            upload_id: 'upl_sample2',
            original_filename: 'College_Project_Report.pdf',
            copies: 1,
            color_mode: 'color',
            duplex_mode: 'duplex',
            total_pages: 15,
            total_amount: '150.00',
            status: 'completed',
            created_at: new Date(Date.now() - 7200000).toISOString()
        }
    ],

    activity_logs: [],
    notifications: [],
    settings: [
        {
            setting_key: 'company_info',
            setting_value: { name: "EasyXerox Systems", logo_url: "/logo.png" }
        }
    ]
};

// File-based persistence: keep ads, machine_ads, clients, users, machines across server restarts
const PERSIST_FILE = path.join(__dirname, '..', '..', 'data', 'mockdb_persist.json');

const persistDb = () => {
    try {
        const dir = path.dirname(PERSIST_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(PERSIST_FILE, JSON.stringify({
            advertisements: mockDb.advertisements,
            machine_ads: mockDb.machine_ads,
            clients: mockDb.clients,
            users: mockDb.users,
            machines: mockDb.machines
        }), 'utf8');
    } catch (e) {
        console.warn('Could not persist mockDb:', e.message);
    }
};

const loadPersistedDb = () => {
    try {
        if (fs.existsSync(PERSIST_FILE)) {
            const data = JSON.parse(fs.readFileSync(PERSIST_FILE, 'utf8'));
            if (Array.isArray(data.advertisements)) mockDb.advertisements = data.advertisements;
            if (Array.isArray(data.machine_ads)) mockDb.machine_ads = data.machine_ads;
            if (Array.isArray(data.clients)) mockDb.clients = data.clients;
            if (Array.isArray(data.users)) mockDb.users = data.users;
            if (Array.isArray(data.machines)) mockDb.machines = data.machines;
            console.log(`✅ Loaded mockDb state from disk (${mockDb.clients.length} clients, ${mockDb.machines.length} machines).`);
        }
    } catch (e) {
        console.warn('Could not load persisted mockDb:', e.message);
    }
};

loadPersistedDb();


// Load persisted data immediately on startup
loadPersistedDb();

const query = async (text, params = []) => {
    console.log('[DB QUERY]:', text.replace(/\s+/g, ' ').substring(0, 80), '| PARAMS:', params);
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
    const res = handleMockQuery(text, params);
    console.log('[DB MOCK RESULT ROWS]:', res.rows ? res.rows.length : 0);
    return res;
};


function handleMockQuery(text, params) {
    const cleanText = text.trim().toLowerCase().replace(/\s+/g, ' ');


    // 1. SELECT Users by Email
    if (cleanText.includes('from users') && (cleanText.includes('u.email = $1') || cleanText.includes('email = $1'))) {
        const email = (params[0] || '').toLowerCase().trim();
        const user = mockDb.users.find(u => u.email.toLowerCase() === email);
        let client = user ? mockDb.clients.find(c => c.user_id === user.id || c.email === email) : null;
        if (!client && user && user.role === 'client') client = mockDb.clients[0];
        const rows = user ? [{
            ...user,
            client_id: client ? client.id : (user.role === 'client' ? 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' : null),
            business_name: client ? client.business_name : (user.role === 'client' ? 'Metro Xerox & Print Zone' : null),
            client_status: client ? client.status : (user.role === 'client' ? 'active' : 'active')
        }] : [];
        return { rows, rowCount: rows.length };
    }

    // 2. SELECT User by ID
    if (cleanText.includes('from users') && (cleanText.includes('u.id = $1') || cleanText.includes('id = $1'))) {
        const user = mockDb.users.find(u => u.id === params[0]);
        let client = user ? mockDb.clients.find(c => c.user_id === user.id) : null;
        if (!client && user && user.role === 'client') client = mockDb.clients[0];
        const rows = user ? [{
            ...user,
            client_id: client ? client.id : (user.role === 'client' ? 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' : null),
            business_name: client ? client.business_name : (user.role === 'client' ? 'Metro Xerox & Print Zone' : null),
            client_status: client ? client.status : (user.role === 'client' ? 'active' : 'active')
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
        const client = machine ? (mockDb.clients.find(c => String(c.id) === String(machine.client_id)) || mockDb.clients[0]) : mockDb.clients[0];
        const isClientSuspended = client && (client.status === 'suspended' || client.status === 'inactive' || client.status === 'disabled');
        const rows = machine ? [{
            ...machine,
            status: isClientSuspended ? 'maintenance' : machine.status,
            business_name: client ? client.business_name : 'Metro Xerox & Print Zone',
            client_status: client ? client.status : 'active'
        }] : [];
        return { rows, rowCount: rows.length };
    }

    // 5. SELECT Machines List
    if (cleanText.includes('from machines')) {
        const rows = mockDb.machines.map(m => {
            const client = mockDb.clients.find(c => String(c.id) === String(m.client_id)) || mockDb.clients[0];
            const isClientSuspended = client && (client.status === 'suspended' || client.status === 'inactive' || client.status === 'disabled');
            return {
                ...m,
                status: isClientSuspended ? 'maintenance' : m.status,
                client_name: client ? client.business_name : 'Metro Xerox & Print Zone',
                client_status: client ? client.status : 'active',
                total_jobs_printed: mockDb.print_jobs.length
            };
        });
        return { rows, rowCount: rows.length };
    }


    // 5b. UPDATE Machine Operational Status (online vs maintenance)
    if (cleanText.includes('update machines set status =')) {
        const machineId = params[1];
        let machine = mockDb.machines.find(m => String(m.id) === String(machineId) || m.machine_code === machineId) || mockDb.machines[0];
        if (machine) {
            machine.status = params[0];
            persistDb();
        }
        return { rows: machine ? [machine] : [], rowCount: machine ? 1 : 0 };
    }

    // 5b2. UPDATE Machine Printer Hardware Ping (printer_status: ready/paper_out)
    if (cleanText.includes('update machines set printer_status')) {
        const mCode = params[2];
        let machine = mockDb.machines.find(m => String(m.id) === String(mCode) || m.machine_code === mCode) || mockDb.machines[0];
        if (machine && params[0]) {
            machine.printer_status = params[0];
            persistDb();
        }
        return { rows: machine ? [machine] : [], rowCount: machine ? 1 : 0 };
    }

    // 5c. UPDATE Clients Status & Info
    if (cleanText.includes('update clients set')) {
        let client = mockDb.clients[0];
        if (params && params.length > 0) {
            const statusVal = params.find(p => p === 'active' || p === 'suspended');
            if (statusVal) {
                mockDb.clients.forEach(c => c.status = statusVal);
                mockDb.users.forEach(u => { if (u.role === 'client') u.status = statusVal; });
                if (statusVal === 'suspended') {
                    mockDb.machines.forEach(m => m.status = 'maintenance');
                } else if (statusVal === 'active') {
                    mockDb.machines.forEach(m => m.status = 'online');
                }
                persistDb();
            }
        }
        return { rows: [mockDb.clients[0]], rowCount: 1 };
    }



    // 5d. UPDATE Users Status
    if (cleanText.includes('update users set status')) {
        if (params && params[0]) {
            mockDb.users.forEach(u => { if (u.role === 'client') u.status = params[0]; });
            persistDb();
        }
        return { rows: [], rowCount: 1 };
    }


    // 5e. DELETE Handlers
    if (cleanText.includes('delete from clients')) {
        const idToDelete = params[0];
        mockDb.clients = mockDb.clients.filter(c => String(c.id) !== String(idToDelete));
        persistDb();
        return { rows: [], rowCount: 1 };
    }
    if (cleanText.includes('delete from users')) {
        const idToDelete = params[0];
        mockDb.users = mockDb.users.filter(u => String(u.id) !== String(idToDelete));
        persistDb();
        return { rows: [], rowCount: 1 };
    }
    if (cleanText.includes('delete from machines')) {
        const idToDelete = params[0];
        mockDb.machines = mockDb.machines.filter(m => String(m.client_id) !== String(idToDelete) && String(m.id) !== String(idToDelete));
        persistDb();
        return { rows: [], rowCount: 1 };
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
        // INNER JOIN with machine_ads: only return ads assigned to this specific machine
        if (cleanText.includes('inner join machine_ads') || cleanText.includes('join machine_ads')) {
            const machineId = String(params[0] || '').trim();
            const assignedAdIds = mockDb.machine_ads
                .filter(ma => String(ma.machine_id) === machineId)
                .map(ma => String(ma.advertisement_id));
            const rows = mockDb.advertisements
                .filter(a => assignedAdIds.includes(String(a.id)) && a.status === 'approved');
            return { rows, rowCount: rows.length };
        }
        // Default: return all ads
        const rows = mockDb.advertisements.map(a => ({ ...a, client_name: 'Metro Xerox Zone' }));
        return { rows, rowCount: rows.length };
    }

    // 8b. INSERT Advertisement
    if (cleanText.includes('insert into advertisements')) {
        const newAdObj = {
            id: 'ad_' + Date.now(),
            client_id: params[0] || 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            title: params[1],
            media_url: params[2],
            media_type: params[3],
            duration_seconds: params[4] || 10,
            status: params[5] || 'approved',
            created_at: new Date().toISOString()
        };
        mockDb.advertisements.unshift(newAdObj);
        persistDb();
        return { rows: [newAdObj], rowCount: 1 };
    }

    // 8c. INSERT Machine Ads Mapping
    if (cleanText.includes('insert into machine_ads')) {
        const exists = mockDb.machine_ads.find(
            ma => String(ma.machine_id) === String(params[0]) && String(ma.advertisement_id) === String(params[1])
        );
        if (!exists) {
            const maObj = {
                id: 'ma_' + Date.now(),
                machine_id: params[0],
                advertisement_id: params[1],
                created_at: new Date().toISOString()
            };
            mockDb.machine_ads.push(maObj);
            persistDb();
        }
        return { rows: [], rowCount: 1 };
    }

    // 8d. DELETE Advertisement
    if (cleanText.includes('delete from advertisements')) {
        const adId = String(params[0] || '').trim();
        mockDb.advertisements = mockDb.advertisements.filter(a => String(a.id) !== adId);
        mockDb.machine_ads = mockDb.machine_ads.filter(ma => String(ma.advertisement_id) !== adId);
        persistDb();
        return { rows: [], rowCount: 1 };
    }

    if (cleanText.includes('delete from machine_ads')) {
        const adId = String(params[0] || '').trim();
        mockDb.machine_ads = mockDb.machine_ads.filter(ma => String(ma.advertisement_id) !== adId);
        persistDb();
        return { rows: [], rowCount: 1 };
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
    if (cleanText.includes('from uploads') && (cleanText.includes('upload_token = $1') || cleanText.includes('u.id = $1'))) {
        let upload = mockDb.uploads.find(u => u.upload_token === params[0] || u.id === params[0]);
        if (!upload) {
            upload = {
                id: 'upl_' + (params[0] || 'default'),
                upload_token: params[0] || 'UPL-DEFAULT',
                machine_id: 'm1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
                original_filename: 'GCP Network Engineer.pdf',
                file_path: '/uploads/sample.pdf',
                file_size_bytes: 62800,
                total_pages: 2,
                mime_type: 'application/pdf',
                status: 'pending',
                created_at: new Date().toISOString()
            };
            mockDb.uploads.push(upload);
        }
        const rows = [{ ...upload, machine_code: 'KIOSK-001', machine_name: 'Connaught Place Kiosk #1' }];
        return { rows, rowCount: 1 };
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
        const upload = mockDb.uploads.find(u => u.id === payment?.upload_id || u.upload_token === payment?.upload_id) || mockDb.uploads[mockDb.uploads.length - 1];
        const machine = mockDb.machines.find(m => m.id === payment?.machine_id || m.machine_code === payment?.machine_id) || mockDb.machines[0];
        const rows = payment ? [{
            ...payment,
            file_path: upload?.file_path || '/uploads/sample.pdf',
            original_filename: upload?.original_filename || 'document.pdf',
            machine_code: machine ? machine.machine_code : 'KIOSK-001',
            client_id: machine ? machine.client_id : 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            default_printer_name: machine ? machine.default_printer_name : 'Brother DCP-T820DW Printer'
        }] : [];
        return { rows, rowCount: rows.length };
    }


    // 13. UPDATE Payment
    if (cleanText.includes('update payments')) {
        const pay = mockDb.payments[mockDb.payments.length - 1];
        if (pay) pay.status = 'captured';
        return { rows: pay ? [pay] : [], rowCount: pay ? 1 : 0 };
    }

    // 13b. UPDATE Print Job Status
    if (cleanText.includes('update print_jobs')) {
        const jobId = String(params[2] || params[0] || '').trim();
        let job = mockDb.print_jobs.find(j => String(j.id) === jobId || String(j.id) === String(params[2])) || mockDb.print_jobs[mockDb.print_jobs.length - 1];
        if (job) {
            job.status = params[0];
            if (params[1]) job.error_message = params[1];
        } else {
            job = { id: jobId || 'job_default', machine_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', status: params[0] };
            mockDb.print_jobs.push(job);
        }
        return { rows: [job], rowCount: 1 };
    }


    // 14. INSERT Transaction & Print Job
    if (cleanText.includes('insert into transactions') || cleanText.includes('insert into print_jobs')) {
        const jobObj = {
            id: 'job_' + Date.now(),
            machine_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
            upload_id: 'upl_sample',
            payment_id: 'pay_sample',
            printer_name: 'Brother DCP-T820DW Printer',

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

    // 15. SELECT Users by Email
    if (cleanText.includes('from users') && cleanText.includes('email = $1')) {
        const user = mockDb.users.find(u => u.email.toLowerCase() === String(params[0] || '').toLowerCase());
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // 16. INSERT User
    if (cleanText.includes('insert into users')) {
        const uObj = {
            id: 'usr_' + Date.now(),
            email: params[0],
            password_hash: params[1],
            full_name: params[2],
            phone: params[3],
            role: 'client',
            status: 'active',
            created_at: new Date().toISOString()
        };
        mockDb.users.push(uObj);
        return { rows: [uObj], rowCount: 1 };
    }

    // 17. INSERT Client
    if (cleanText.includes('insert into clients')) {
        const cObj = {
            id: 'c_' + Date.now(),
            user_id: params[0],
            business_name: params[1],
            contact_phone: params[2],
            address: params[3],
            city: params[4],
            state: params[5],
            pincode: params[6],
            commission_rate: params[7] || 100.00,
            status: 'active',
            created_at: new Date().toISOString()
        };
        mockDb.clients.push(cObj);
        return { rows: [cObj], rowCount: 1 };
    }

    // 18. SELECT Print Jobs History
    if (cleanText.includes('from print_jobs') || cleanText.includes('pj.*')) {
        const rows = mockDb.print_jobs.map(pj => ({
            ...pj,
            machine_code: pj.machine_code || 'KIOSK-001',
            machine_name: 'Connaught Place Kiosk #1',
            original_filename: pj.original_filename || 'document.pdf'
        }));
        return { rows, rowCount: rows.length };
    }

    // 19. SELECT Clients List
    if (cleanText.includes('from clients')) {
        const rows = mockDb.clients.map(c => {
            const user = mockDb.users.find(u => u.id === c.user_id);
            return {
                ...c,
                email: user ? user.email : (c.email || 'client@shop.com'),
                full_name: user ? user.full_name : c.business_name,
                total_machines: 1,
                total_earnings: 1250.00
            };
        });
        return { rows, rowCount: rows.length };
    }

    // 20. Admin / Client Dashboard Summaries
    if (cleanText.includes('count(*) from clients') || cleanText.includes('sum(amount)')) {
        return { rows: [{ count: String(mockDb.clients.length), online_count: '1', total: '2450.00', today: '450.00', pages: '120', month: '2450.00' }], rowCount: 1 };
    }

    // Default Fallback Empty Result
    return { rows: [], rowCount: 0 };
}


module.exports = {
    pool,
    query,
};
