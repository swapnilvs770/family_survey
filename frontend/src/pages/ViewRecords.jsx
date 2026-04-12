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
              View Records
              <span className="text-gold-500 ml-3">नोंदी पहा</span>
            </h1>
            <p className="text-gray-400">Browse and filter family members</p>
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

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-3"
      >
        {quickFilters.map((filter, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={filter.action}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gold-600 hover:text-black transition-all text-sm"
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
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gold-600/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gold-500" />
          <h3 className="text-xl font-bold text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or family ID"
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
            />
          </div>

          {/* Gender */}
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
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
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
          />

          {/* Age Max */}
          <input
            type="number"
            name="ageMax"
            value={filters.ageMax}
            onChange={handleFilterChange}
            placeholder="Max Age"
            min="0"
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
          />
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredMembers.length} of {members.length} records
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gold-600/30"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gold-600 to-gold-500 text-black">
              <tr>
                <th className="px-6 py-4 text-left font-bold">ID</th>
                <th className="px-6 py-4 text-left font-bold">Family ID</th>
                <th className="px-6 py-4 text-left font-bold">Name</th>
                <th className="px-6 py-4 text-left font-bold">Age</th>
                <th className="px-6 py-4 text-left font-bold">Gender</th>
                <th className="px-6 py-4 text-left font-bold">Relation</th>
                <th className="px-6 py-4 text-left font-bold">DOB</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
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
                  <td className="px-6 py-4">{member.id}</td>
                  <td className="px-6 py-4">{member.family_id}</td>
                  <td className="px-6 py-4 font-medium">{member.name}</td>
                  <td className="px-6 py-4">{member.age}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${member.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                      {member.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">{member.relation}</td>
                  <td className="px-6 py-4">{new Date(member.dob).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-sm" />
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
          <div className="flex justify-center items-center gap-2 p-6 bg-gray-800/50">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded transition-all ${
                  currentPage === index + 1
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
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gold-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewRecords;
