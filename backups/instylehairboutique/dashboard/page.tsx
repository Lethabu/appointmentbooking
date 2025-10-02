import EcommerceDashboard from '@/components/dashboard/EcommerceDashboard';
import { inStyleBrand } from '../config';

export default function InstyleDashboard() {
  return <EcommerceDashboard tenantId={inStyleBrand.tenantId} />;
}
