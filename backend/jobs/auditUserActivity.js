import cron from 'node-cron';
import { auditAndFixUserMetrics } from '../controllers/activityController.js';
// Every Sunday at 4 AM
cron.schedule('0 4 * * 0', async () => {
  console.log('[AuditJob] Weekly user metric audit starting...');
  await auditAndFixUserMetrics({ autoFix: true }); // or false if you just want to log
  console.log('[AuditJob] Weekly user metric audit completed.');
});
