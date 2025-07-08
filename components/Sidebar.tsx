
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppName, AppRoutes } from './constants';
import { IconDashboard, IconChat, IconCalendar, IconSparkles } from './icons';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const navLinkClasses = (path: string): string =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary-dark hover:text-white ${
      pathname === path ? 'bg-primary-dark text-white shadow-md' : 'text-neutral-200'
    }`;

  return (
    <div className="w-64 bg-neutral-800 text-white flex flex-col p-4 space-y-6 shadow-lg">
      <div className="flex items-center space-x-2 px-2 py-4 border-b border-neutral-700">
        <IconSparkles className="h-10 w-10 text-primary-light" />
        <h1 className="text-2xl font-bold text-white">{AppName}</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <Link href={AppRoutes.DASHBOARD} className={navLinkClasses(AppRoutes.DASHBOARD)}>
          <IconDashboard className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>
        <Link href={AppRoutes.AGENT_CHAT} className={navLinkClasses(AppRoutes.AGENT_CHAT)}>
          <IconChat className="h-6 w-6" />
          <span>AI Agents</span>
        </Link>
        <Link href={AppRoutes.BOOKINGS} className={navLinkClasses(AppRoutes.BOOKINGS)}>
          <IconCalendar className="h-6 w-6" />
          <span>Bookings</span>
        </Link>
      </nav>
      <div className="mt-auto p-2 text-center text-neutral-400 text-xs">
        &copy; {new Date().getFullYear()} {AppName}
      </div>
    </div>
  );
};

export default Sidebar;
