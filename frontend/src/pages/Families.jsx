import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { membersAPI } from '../services/api';
import { exportFamiliesToPDF } from '../utils/pdfExport';

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFamily, setExpandedFamily] = useState(null);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await membersAPI.getFamilies();
      if (response.success) {
        setFamilies(response.data);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFamily = (familyId) => {
    setExpandedFamily(expandedFamily === familyId ? null : familyId);
  };

  const handleExportPDF = () => {
    exportFamiliesToPDF(families);
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
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Families
              <span className="text-gold-500 ml-3">कुटुंबे</span>
            </h1>
            <p className="text-gray-400">Family-wise grouping of members</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-gold-500/50 transition-all flex items-center gap-2"
          >
            <FaDownload />
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Families</p>
              <h3 className="text-3xl font-bold text-white">{families.length}</h3>
            </div>
            <FaUsers className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Avg. Family Size</p>
              <h3 className="text-3xl font-bold text-white">
                {families.length > 0
                  ? (families.reduce((sum, f) => sum + f.total_members, 0) / families.length).toFixed(1)
                  : 0}
              </h3>
            </div>
            <FaUsers className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Largest Family</p>
              <h3 className="text-3xl font-bold text-white">
                {families.length > 0 ? Math.max(...families.map((f) => f.total_members)) : 0}
              </h3>
              <p className="text-white/60 text-xs">members</p>
            </div>
            <FaUsers className="text-4xl text-white/50" />
          </div>
        </div>
      </motion.div>

      {/* Family Cards */}
      <div className="space-y-4">
        {families.map((family, index) => (
          <motion.div
            key={family.family_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gold-600/30 shadow-xl"
          >
            {/* Family Header */}
            <div
              onClick={() => toggleFamily(family.family_id)}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-gold-600 to-gold-500 rounded-full w-12 h-12 flex items-center justify-center text-black font-bold text-xl">
                  {family.family_id}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Family {family.family_id}</h3>
                  <p className="text-gray-400 text-sm">
                    {family.total_members} member{family.total_members > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm text-gray-400">
                    Head: {family.members.find((m) => m.relation === 'प्रमुख')?.name || 'N/A'}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expandedFamily === family.family_id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedFamily === family.family_id ? (
                    <FaChevronUp className="text-gold-500 text-xl" />
                  ) : (
                    <FaChevronDown className="text-gold-500 text-xl" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Family Members Table */}
            {expandedFamily === family.family_id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-700"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">#</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">Age</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">Gender</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">Relation</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gold-500">DOB</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {family.members.map((member, idx) => (
                        <tr
                          key={member.id}
                          className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm">{idx + 1}</td>
                          <td className="px-6 py-4 font-medium">{member.name}</td>
                          <td className="px-6 py-4">{member.age}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'
                              }`}
                            >
                              {member.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4">{member.relation}</td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(member.dob).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {families.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No families found</p>
        </motion.div>
      )}
    </div>
  );
};

export default Families;
