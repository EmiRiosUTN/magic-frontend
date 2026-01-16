import { useParams, useNavigate } from 'react-router-dom';
import { BoardView } from '../../components/tasks/BoardView';

export default function BoardPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    if (!projectId) return <div>Error: No Project ID</div>;

    return (
        <BoardView
            projectId={projectId}
            onBack={() => navigate('/tasks')}
        />
    );
}
