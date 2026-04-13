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
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Families
              <span className="text-gold-500 ml-2 sm:ml-3 block sm:inline mt-1 sm:mt-0">कुटुंबे</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Family-wise grouping of members</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-gold-500/50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm mb-1">Total Families</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{families.length}</h3>
            </div>
            <FaUsers className="text-3xl sm:text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm mb-1">Avg. Family Size</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {families.length > 0
                  ? (families.reduce((sum, f) => sum + f.total_members, 0) / families.length).toFixed(1)
                  : 0}
              </h3>
            </div>
            <FaUsers className="text-3xl sm:text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-white/10 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm mb-1">Largest Family</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {families.length > 0 ? Math.max(...families.map((f) => f.total_members)) : 0}
              </h3>
              <p className="text-white/60 text-xs">members</p>
            </div>
            <FaUsers className="text-3xl sm:text-4xl text-white/50" />
          </div>
        </div>
      </motion.div>

      {/* Family Cards */}
      <div className="space-y-3 sm:space-y-4">
        {families.map((family, index) => (
          <motion.div
            key={family.family_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gold-600/30 shadow-xl"
          >
            {/* Family Header */}
            <div
              onClick={() => toggleFamily(family.family_id)}
              className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-700/50 transition-colors active:bg-gray-700/70"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="bg-gradient-to-br from-gold-600 to-gold-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-black font-bold text-lg sm:text-xl flex-shrink-0">
                  {family.family_id}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">Family {family.family_id}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {family.total_members} member{family.total_members > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[150px]">
                    Head: {family.members.find((m) => m.relation === 'प्रमुख')?.name || 'N/A'}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expandedFamily === family.family_id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {expandedFamily === family.family_id ? (
                    <FaChevronUp className="text-gold-500 text-lg sm:text-xl" />
                  ) : (
                    <FaChevronDown className="text-gold-500 text-lg sm:text-xl" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Family Members Table - Desktop */}
            {expandedFamily === family.family_id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-700"
              >
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">#</th>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">Name</th>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">Age</th>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">Gender</th>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">Relation</th>
                        <th className="px-4 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gold-500">DOB</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {family.members.map((member, idx) => (
                        <tr
                          key={member.id}
                          className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm">{idx + 1}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-xs sm:text-sm">{member.name}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm">{member.age}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'
                                }`}
                            >
                              {member.gender}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm">{member.relation}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm">
                            {new Date(member.dob).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-3 space-y-2">
                  {family.members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gold-500 font-bold text-sm">#{idx + 1}</span>
                            <h4 className="text-white font-medium text-sm truncate">{member.name}</h4>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ml-2 ${member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'
                            } text-white`}
                        >
                          {member.gender}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <div>
                          <span className="text-gray-400">Age:</span>
                          <span className="ml-1 text-white">{member.age}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Relation:</span>
                          <span className="ml-1 text-white">{member.relation}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">DOB:</span>
                          <span className="ml-1 text-white">
                            {new Date(member.dob).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
          className="text-center py-12 sm:py-16"
        >
          <FaUsers className="text-4xl sm:text-6xl text-gray-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-lg sm:text-xl">No families found</p>
        </motion.div>
      )}
    </div>
  );
};

export default Families;