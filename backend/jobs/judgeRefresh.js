import cron from 'node-cron';
import { auditAndFixUserMetrics } from '../controllers/activityController.js';

cron.schedule('0 3 * * *', async () => {
  console.log('[Cron] Starting daily activity judge refresh...');
  await auditAndFixUserMetrics();
  console.log('[Cron] Finished activity judge refresh');
});
