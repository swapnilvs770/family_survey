import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import { membersAPI } from '../services/api';
import { exportToPDF } from '../utils/pdfExport';

const ViewRecords = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    ageMin: '',
    ageMax: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [members, filters]);

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll();
      if (response.success) {
        setMembers(response.data);
        setFilteredMembers(response.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          member.family_id.toString().includes(filters.search)
      );
    }

    // Gender filter
    if (filters.gender !== 'all') {
      filtered = filtered.filter((member) => member.gender === filters.gender);
    }

    // Age range filter
    if (filters.ageMin !== '') {
      filtered = filtered.filter((member) => member.age >= parseInt(filters.ageMin));
    }
    if (filters.ageMax !== '') {
      filtered = filtered.filter((member) => member.age <= parseInt(filters.ageMax));
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await membersAPI.delete(id);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member');
      }
    }
  };

  const handleExportPDF = () => {
    exportToPDF(filteredMembers, filters);
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMembers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredMembers.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Quick filter presets
  const quickFilters = [
    { label: 'All', action: () => setFilters({ search: '', gender: 'all', ageMin: '', ageMax: '' }) },
    { label: 'Infants (0-1)', action: () => setFilters({ ...filters, ageMin: '0', ageMax: '1' }) },
    { label: 'Children (0-5)', action: () => setFilters({ ...filters, ageMin: '0', ageMax: '5' }) },
    { label: 'Girls (10-18)', action: () => setFilters({ ...filters, gender: 'Female', ageMin: '10', ageMax: '18' }) },
    { label: 'Males', action: () => setFilters({ ...filters, gender: 'Male', ageMin: '', ageMax: '' }) },
    { label: 'Females', action: () => setFilters({ ...filters, gender: 'Female', ageMin: '', ageMax: '' }) },
  ];

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
              View Records
              <span className="text-gold-500 ml-2 sm:ml-3 block sm:inline mt-1 sm:mt-0">नोंदी पहा</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Browse and filter family members</p>
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

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3"
      >
        {quickFilters.map((filter, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={filter.action}
            className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gold-600 hover:text-black transition-all text-xs sm:text-sm min-h-[36px]"
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gold-600/30"
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <FaFilter className="text-gold-500 text-sm sm:text-base" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or family ID"
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
            />
          </div>

          {/* Gender */}
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="px-3 sm:px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Age Min */}
          <input
            type="number"
            name="ageMin"
            value={filters.ageMin}
            onChange={handleFilterChange}
            placeholder="Min Age"
            min="0"
            className="px-3 sm:px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
          />

          {/* Age Max */}
          <input
            type="number"
            name="ageMax"
            value={filters.ageMax}
            onChange={handleFilterChange}
            placeholder="Max Age"
            min="0"
            className="px-3 sm:px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
          />
        </div>

        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
          Showing {filteredMembers.length} of {members.length} records
        </div>
      </motion.div>

      {/* Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gold-600/30"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gold-600 to-gold-500 text-black">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">ID</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Family ID</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Name</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Age</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Gender</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Relation</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">DOB</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-bold text-sm lg:text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {currentRecords.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base">{member.id}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base">{member.family_id}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-sm lg:text-base">{member.name}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base">{member.age}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2 py-1 rounded text-xs ${member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                      {member.gender}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base">{member.relation}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base">{new Date(member.dob).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors min-h-[36px] min-w-[36px]"
                        title="Delete"
                      >
                        <FaTrash className="text-xs lg:text-sm" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 sm:p-6 bg-gray-800/50 flex-wrap">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[36px]"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 sm:px-4 py-2 rounded transition-all text-sm min-h-[36px] ${currentPage === index + 1
                    ? 'bg-gold-600 text-black font-bold'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[36px]"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-3">
        {currentRecords.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gold-600/30 shadow-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{member.name}</h3>
                <p className="text-sm text-gray-400">
                  ID: {member.id} | Family: {member.family_id}
                </p>
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors flex-shrink-0 ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Delete"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Age:</span>
                <span className="ml-2 text-white font-medium">{member.age}</span>
              </div>
              <div>
                <span className="text-gray-400">Gender:</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'} text-white`}>
                  {member.gender}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Relation:</span>
                <span className="ml-2 text-white font-medium">{member.relation}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">DOB:</span>
                <span className="ml-2 text-white font-medium">{new Date(member.dob).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4 flex-wrap">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-white text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecords;