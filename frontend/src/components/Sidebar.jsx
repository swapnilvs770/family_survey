import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserPlus, FaList, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard', labelMr: 'मुख्यपृष्ठ' },
    { path: '/add', icon: FaUserPlus, label: 'Add Record', labelMr: 'नोंदणी' },
    { path: '/records', icon: FaList, label: 'View Records', labelMr: 'नोंदी' },
    { path: '/families', icon: FaUsers, label: 'Families', labelMr: 'कुटुंबे' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen fixed left-0 top-0 text-white shadow-2xl"
    >
      {/* Logo/Header */}
      <div className="p-6 border-b border-gold-600/30">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent"
        >
          कुटुंब सर्वे
        </motion.h1>
        <p className="text-gray-400 text-sm mt-1">Family Survey System</p>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-4 px-4 py-3 mb-2 rounded-lg cursor-pointer
                  transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-black shadow-lg shadow-gold-600/50'
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }
                `}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-xl" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.labelMr}</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          © 2024 Family Survey System
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
