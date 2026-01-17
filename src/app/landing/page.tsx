import { useNavigate } from 'react-router-dom';
import { LandingHero } from '../../components/landing/LandingHero';
import { LandingFeatures } from '../../components/landing/LandingFeatures';
import { LandingAgents } from '../../components/landing/LandingAgents';
import { LandingCTA } from '../../components/landing/LandingCTA';
import { LandingFooter } from '../../components/landing/LandingFooter';

export default function LandingPage() {
    const navigate = useNavigate();
    const handleEnter = () => navigate('/login');

    return (
        <div className="min-h-screen bg-gradient-to-b from-grafite via-[#3d2d37] to-[#4a3a44] h-screen overflow-y-auto">
            <main>
                <LandingHero onEnter={handleEnter} />
                <LandingFeatures />
                <LandingAgents onEnter={handleEnter} />
                <LandingCTA onEnter={handleEnter} />
            </main>
            <LandingFooter />
        </div>
    );
}
