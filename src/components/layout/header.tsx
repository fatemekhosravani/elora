import { getSession } from '@/lib/get-session';
import HeaderClient from './header-client';

export default async function Header() {
    const session = await getSession();
    const isLoggedIn = !!session;

    return <HeaderClient isLoggedIn={isLoggedIn} />;
}
