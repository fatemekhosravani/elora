import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getUserProfile } from '@/lib/data/customer-api';
import CustomerDashboard from './customer-dashboard';

export default async function CustomerPanelPage() {
    // Get session
    const session = await getSession();
    
    if (!session) {
        redirect('/login');
    }

    // Get user profile
    const userProfile = await getUserProfile(session.userId);

    if (!userProfile) {
        redirect('/login');
    }

    // Extract first name from fullName (e.g., "سارا احمدی" -> "سارا")
    const firstName = userProfile.fullName 
        ? userProfile.fullName.split(' ')[0] 
        : 'کاربر';

    return <CustomerDashboard firstName={firstName} />;
}