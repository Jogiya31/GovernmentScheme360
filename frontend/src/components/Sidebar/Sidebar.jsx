import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const sections = [
    {
      title: 'Personal',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' }
      ]
    },
    {
      title: 'Workspace',
      items: [
        // { path: '/users', label: 'Users Database', icon: 'bi bi-people' },
        { path: '/new-scheme', label: 'New Scheme', icon: 'bi bi-file-earmark-plus' }
      ]
    },
    {
      title: 'Account & Settings',
      items: [
        { path: '/profile', label: 'My Profile', icon: 'bi bi-person-circle' },
        { path: '/settings', label: 'System Settings', icon: 'bi bi-gear' }
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="left-sidebar" data-sidebarbg="skin6">
      {/* Sidebar scroll */}
      <div className="scroll-sidebar" data-sidebarbg="skin6">
        {/* Sidebar navigation */}
        <nav className="sidebar-nav">
          <ul id="sidebarnav">
            {sections.map((section, idx) => (
              <React.Fragment key={idx}>
                {/* Section title (Applications, Components, etc.) */}
                <li className="nav-small-cap">
                  <span className="hide-menu">{section.title}</span>
                </li>

                {/* Section items */}
                {section.items.map((item) => (
                  <li className={`sidebar-item ${isActive(item.path) ? 'selected' : ''}`} key={item.path}>
                    <Link
                      to={item.path}
                      className="sidebar-link"
                      aria-expanded="false"
                    >
                      <i className={item.icon}></i>
                      <span className="hide-menu">{item.label}</span>
                    </Link>
                  </li>
                ))}

                {/* Divider between sections */}
                {idx < sections.length - 1 && <li className="list-divider"></li>}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
