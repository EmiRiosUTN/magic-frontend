import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '../../components/admin/AdminPanel';

export default function AdminPage() {
    const navigate = useNavigate();
    return <AdminPanel onBack={() => navigate('/')} />;
}
