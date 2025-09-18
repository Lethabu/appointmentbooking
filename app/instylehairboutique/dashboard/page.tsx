import EcommerceDashboard from '@/components/dashboard/EcommerceDashboard';
import { tenantId } from '../config';

export default function InstyleDashboard() {
  return <EcommerceDashboard tenantId={tenantId} />;
}