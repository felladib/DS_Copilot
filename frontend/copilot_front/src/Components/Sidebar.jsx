import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import InsightsIcon from '@mui/icons-material/Insights';
import { SidebarContext } from '../utils/SidebarContext';
import '../Style/Sidebar.scss';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={22} />, link: "/dashboard" },
    { label: "Projects", icon: <FolderKanban size={22} />, link: "/projects" },
    { label: "Datasets", icon: <Database size={22} />, link: "/datasets" },
    { label: "Settings", icon: <Settings size={22} />, link: "/settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="neo-sidebar"
      aria-expanded={sidebarOpen}
    >
      {/* LOGO - toujours visible */}
      <div className="neo-logo-section">
        <div className="neo-logo">
          <InsightsIcon className="neo-logo-icon" />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="neo-title"
            >
              Data Copilot
            </motion.span>
          )}
        </div>
      </div>

      {/* MENU - icônes toujours visibles */}
      <nav className="neo-menu">
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>
              <a href={item.link} title={item.label}>
                <span className="neo-icon">{item.icon}</span>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="neo-text"
                  >
                    {item.label}
                  </motion.span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* FOOTER */}
      <footer className="neo-footer">
        <div className="neo-user" title="user.name">
          <User className="neo-user-icon" size={18} />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="neo-username"
            >
              user.name
            </motion.span>
          )}
        </div>
        <button className="neo-logout" aria-label="Logout" title="Logout">
          <LogOut size={18} />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="neo-logout-text"
            >
              Logout
            </motion.span>
          )}
        </button>
      </footer>

      {/* Toggle flottant à droite du sidebar */}
      <motion.button
        className="neo-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ x: sidebarOpen ? 0 : -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        

        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;