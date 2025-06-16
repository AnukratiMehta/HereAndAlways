import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../icons/icons';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/messages', label: 'Messages', icon: 'messages' },
    { to: '/assets', label: 'Digital Assets', icon: 'assets' },
    { to: '/trustees', label: 'Trustees', icon: 'trustees' },
  ];

  const bottomItems = [
    { to: '/settings', label: 'Settings', icon: 'settings' },
    { to: '/logout', label: 'Logout', icon: 'logout' },
  ];

  // Resolve icon from name
  const getIcon = (name) => icons[name] || icons['default'];

  return (
    <div className="w-48 px-3 bg-brandRose-light text-charcoal shadow-sm flex flex-col justify-between min-h-screen border-r border-lightGray">
      <div>
        <div className="p-4 text-xl font-bold tracking-tight text-brandRose-dark">
          Here<span className="text-mint">&</span>Always
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-brandRose text-charcoal font-semibold'
                    : 'hover:bg-brandRose hover:text-charcoal text-brandRose-dark'
                }`
              }
            >
              <FontAwesomeIcon icon={getIcon(item.icon)} className="w-4 h-4 text-brandRose-dark" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mb-6 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-brandRose text-charcoal font-semibold'
                  : 'hover:bg-brandRose hover:text-charcoal text-brandRose-dark'
              }`
            }
          >
            <FontAwesomeIcon icon={getIcon(item.icon)} className="w-4 h-4 text-brandRose-dark" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
