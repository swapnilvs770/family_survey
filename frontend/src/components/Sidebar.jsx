import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserPlus, FaList, FaUsers, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard', labelMr: 'मुख्यपृष्ठ' },
    { path: '/add', icon: FaUserPlus, label: 'Add Record', labelMr: 'नोंदणी' },
    { path: '/records', icon: FaList, label: 'View Records', labelMr: 'नोंदी' },
    { path: '/families', icon: FaUsers, label: 'Families', labelMr: 'कुटुंबे' },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -280 }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden lg:block w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen fixed left-0 top-0 text-white shadow-2xl z-40"
      >
        <SidebarContent menuItems={menuItems} location={location} />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen fixed left-0 top-0 text-white shadow-2xl z-40"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <FaTimes className="text-xl text-gold-500" />
              </button>
            </div>

            <SidebarContent menuItems={menuItems} location={location} onItemClick={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Extracted sidebar content component for reusability
const SidebarContent = ({ menuItems, location, onItemClick }) => {
  return (
    <>
      {/* Logo/Header */}
      <div className="p-4 sm:p-6 border-b border-gold-600/30">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent"
        >
          कुटुंब सर्वे
        </motion.h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Family Survey System</p>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 sm:mt-6 px-2 sm:px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} onClick={onItemClick}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 mb-2 rounded-lg cursor-pointer
                  transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-black shadow-lg shadow-gold-600/50'
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }
                `}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-lg sm:text-xl flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.label}</div>
                  <div className="text-xs opacity-75 truncate">{item.labelMr}</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          © 2024 Family Survey System
        </p>
      </div>
    </>
  );
};

export default Sidebar;