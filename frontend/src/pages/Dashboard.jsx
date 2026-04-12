import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaMale, FaFemale, FaChild, FaBaby, FaHome } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import { membersAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalFamilies: 0,
    maleCount: 0,
    femaleCount: 0,
    childrenCount: 0,
    infantsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await membersAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard
          <span className="text-gold-500 ml-3">डॅशबोर्ड</span>
        </h1>
        <p className="text-gray-400">Overview of family survey data</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FaHome}
          title="Total Families"
          value={stats.totalFamilies}
          subtitle="एकूण कुटुंबे"
          color="from-purple-600 to-purple-800"
          delay={0}
        />
        <StatCard
          icon={FaUsers}
          title="Total Members"
          value={stats.totalMembers}
          subtitle="एकूण सदस्य"
          color="from-blue-600 to-blue-800"
          delay={0.1}
        />
        <StatCard
          icon={FaMale}
          title="Male Members"
          value={stats.maleCount}
          subtitle="पुरुष सदस्य"
          color="from-indigo-600 to-indigo-800"
          delay={0.2}
        />
        <StatCard
          icon={FaFemale}
          title="Female Members"
          value={stats.femaleCount}
          subtitle="महिला सदस्य"
          color="from-pink-600 to-pink-800"
          delay={0.3}
        />
        <StatCard
          icon={FaChild}
          title="Children (≤18)"
          value={stats.childrenCount}
          subtitle="मुले (18 वर्षांखालील)"
          color="from-green-600 to-green-800"
          delay={0.4}
        />
        <StatCard
          icon={FaBaby}
          title="Infants (≤1)"
          value={stats.infantsCount}
          subtitle="बालके (1 वर्षाखालील)"
          color="from-orange-600 to-orange-800"
          delay={0.5}
        />
      </div>

      {/* Quick Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gold-600/30 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-gold-500">⚡</span>
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <span>Average family size: {(stats.totalMembers / stats.totalFamilies || 0).toFixed(2)} members</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <span>Male to Female Ratio: {(stats.maleCount / stats.femaleCount || 0).toFixed(2)}:1</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <span>Children percentage: {((stats.childrenCount / stats.totalMembers) * 100 || 0).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <span>Adult percentage: {(((stats.totalMembers - stats.childrenCount) / stats.totalMembers) * 100 || 0).toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
