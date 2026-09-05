const db = require('../config/db');

const getAdminDashboard = async (req, res, next) => {
    try {
        const clientsCount = await db.query("SELECT COUNT(*) FROM clients WHERE status = 'active'");
        const machinesCount = await db.query("SELECT COUNT(*), COUNT(CASE WHEN status = 'online' THEN 1 END) as online_count FROM machines");
        const totalRevenue = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'captured'");
        const todayRevenue = await db.query("SELECT COALESCE(SUM(amount), 0) as today FROM payments WHERE status = 'captured' AND created_at >= CURRENT_DATE");
        const totalPages = await db.query("SELECT COALESCE(SUM(total_pages * copies), 0) as pages FROM print_jobs WHERE status = 'completed'");
        const pendingAds = await db.query("SELECT COUNT(*) FROM advertisements WHERE status = 'pending'");

        // Monthly revenue chart data (Last 6 months)
        const revenueChart = await db.query(`
            SELECT TO_CHAR(created_at, 'Mon YYYY') as month,
                   SUM(amount) as revenue,
                   COUNT(id) as total_jobs
            FROM payments
            WHERE status = 'captured'
            GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at) ASC
            LIMIT 6
        `);

        // Recent activity
        const recentJobs = await db.query(`
            SELECT pj.*, m.name as machine_name, u.original_filename
            FROM print_jobs pj
            JOIN machines m ON pj.machine_id = m.id
            JOIN uploads u ON pj.upload_id = u.id
            ORDER BY pj.created_at DESC
            LIMIT 5
        `);

        res.json({
            success: true,
            stats: {
                totalClients: parseInt(clientsCount.rows[0]?.count || 0, 10),
                totalMachines: parseInt(machinesCount.rows[0]?.count || 0, 10),
                onlineMachines: parseInt(machinesCount.rows[0]?.online_count || 0, 10),
                totalRevenue: parseFloat(totalRevenue.rows[0]?.total || 0),
                todayRevenue: parseFloat(todayRevenue.rows[0]?.today || 0),
                totalPagesPrinted: parseInt(totalPages.rows[0]?.pages || 0, 10),
                pendingAdsCount: parseInt(pendingAds.rows[0]?.count || 0, 10)
            },
            revenueChart: revenueChart.rows,
            recentJobs: recentJobs.rows
        });
    } catch (err) {
        next(err);
    }
};

const getClientDashboard = async (req, res, next) => {
    try {
        let clientId = req.user?.client_id;
        if (!clientId && req.user?.id) {
            const clientRes = await db.query('SELECT id FROM clients WHERE user_id::text = $1::text OR id::text = $1::text', [req.user.id]);
            if (clientRes.rows.length > 0) {
                clientId = clientRes.rows[0].id;
            } else {
                clientId = req.user.id;
            }
        }

        const machinesCount = await db.query("SELECT COUNT(*), COUNT(CASE WHEN status = 'online' THEN 1 END) as online_count FROM machines WHERE client_id::text = $1::text", [clientId]);
        const totalEarnings = await db.query("SELECT COALESCE(SUM(client_share), 0) as total FROM transactions WHERE client_id::text = $1::text AND status = 'settled'", [clientId]);
        const todayEarnings = await db.query("SELECT COALESCE(SUM(client_share), 0) as today FROM transactions WHERE client_id::text = $1::text AND status = 'settled' AND created_at >= CURRENT_DATE", [clientId]);
        const monthlyEarnings = await db.query("SELECT COALESCE(SUM(client_share), 0) as month FROM transactions WHERE client_id::text = $1::text AND status = 'settled' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)", [clientId]);
        const pagesPrinted = await db.query(`
            SELECT COALESCE(SUM(pj.total_pages * pj.copies), 0) as pages 
            FROM print_jobs pj
            JOIN machines m ON pj.machine_id = m.id
            WHERE m.client_id::text = $1::text AND pj.status = 'completed'`,
            [clientId]
        );

        // Recent machine transactions
        const recentTxns = await db.query(`
            SELECT t.*, m.name as machine_name, p.payment_method
            FROM transactions t
            JOIN machines m ON t.machine_id = m.id
            JOIN payments p ON t.payment_id = p.id
            WHERE t.client_id::text = $1::text
            ORDER BY t.created_at DESC
            LIMIT 10`,
            [clientId]
        );

        res.json({
            success: true,
            stats: {
                totalMachines: parseInt(machinesCount.rows[0]?.count || 0, 10),
                onlineMachines: parseInt(machinesCount.rows[0]?.online_count || 0, 10),
                totalEarnings: parseFloat(totalEarnings.rows[0]?.total || 0),
                todayRevenue: parseFloat(todayEarnings.rows[0]?.today || 0),
                monthlyRevenue: parseFloat(monthlyEarnings.rows[0]?.month || 0),
                totalPagesPrinted: parseInt(pagesPrinted.rows[0]?.pages || 0, 10)
            },
            recentTransactions: recentTxns.rows || []
        });
    } catch (err) {
        next(err);
    }
};

const getActivityLogs = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT al.*, u.full_name, u.email
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 100
        `);

        res.json({ success: true, logs: result.rows });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAdminDashboard,
    getClientDashboard,
    getActivityLogs
};
