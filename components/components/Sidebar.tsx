
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppName, AppRoutes, IconDashboard, IconChat, IconCalendar, IconSparkles } from '../constants';

const Sidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary-dark hover:text-white ${
      isActive ? 'bg-primary-dark text-white shadow-md' : 'text-neutral-200'
    }`;

  return (
    <div className="w-64 bg-neutral-800 text-white flex flex-col p-4 space-y-6 shadow-lg">
      <div className="flex items-center space-x-2 px-2 py-4 border-b border-neutral-700">
        <IconSparkles className="h-10 w-10 text-primary-light" />
        <h1 className="text-2xl font-bold text-white">{AppName}</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink to={AppRoutes.DASHBOARD} className={navLinkClasses}>
          <IconDashboard className="h-6 w-6" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to={AppRoutes.AGENT_CHAT} className={navLinkClasses}>
          <IconChat className="h-6 w-6" />
          <span>AI Agents</span>
        </NavLink>
        <NavLink to={AppRoutes.BOOKINGS} className={navLinkClasses}>
          <IconCalendar className="h-6 w-6" />
          <span>Bookings</span>
        </NavLink>
      </nav>
      <div className="mt-auto p-2 text-center text-neutral-400 text-xs">
        &copy; {new Date().getFullYear()} {AppName}
      </div>
    </div>
  );
};

export default Sidebar;
