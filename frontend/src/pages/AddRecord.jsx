import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';
import { membersAPI } from '../services/api';

const AddRecord = () => {
  const [formData, setFormData] = useState({
    family_id: '',
    name_en: '',
    name_mr: '',
    gender: 'Male',
    relation: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const relations = [
    'प्रमुख',
    'पत्नी',
    'नवरा',
    'मुलगा',
    'मुलगी',
    'आजी',
    'आजोबा',
    'नातू',
    'नात',
    'भाऊ',
    'बहीण',
    'सून',
    'जावई',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNameChange = async (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name_en: value,
    }));

    if (!value) {
      setFormData((prev) => ({ ...prev, name_mr: "" }));
      return;
    }

    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(value)}&itc=mr-t-i0-und&num=1`
      );
      const data = await res.json();

      if (data[0] === "SUCCESS") {
        setFormData((prev) => ({
          ...prev,
          name_mr: data[1][0][1][0],
        }));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await membersAPI.create({
        ...formData,
        name: formData.name_mr || formData.name_en
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Member added successfully! नोंदणी यशस्वी झाली!' });
        // Reset form
        setFormData({
          family_id: '',
          name: '',
          gender: 'Male',
          relation: '',
          dob: '',
        });

        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding member. Please try again.' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      family_id: '',
      name: '',
      gender: 'Male',
      relation: '',
      dob: '',
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Add New Record
          <span className="text-gold-500 ml-3">नवीन नोंदणी</span>
        </h1>
        <p className="text-gray-400">Add a new family member to the survey</p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gold-600/30"
      >
        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${message.type === 'success'
              ? 'bg-green-600/20 border border-green-500 text-green-300'
              : 'bg-red-600/20 border border-red-500 text-red-300'
              }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Family ID */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Family ID <span className="text-gold-500">कुटुंब क्रमांक</span>
            </label>
            <input
              type="number"
              name="family_id"
              value={formData.family_id}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
              placeholder="Enter family number"
            />
          </div>

          {/* Name */}
          {/* Name */}
          {/* English Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Full Name (English)
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50"
              placeholder="Enter full name"
            />
          </div>

          {/* Marathi Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              पूर्ण नाव (Marathi)
            </label>
            <input
              type="text"
              value={formData.name_mr}
              onChange={(e) =>
                setFormData({ ...formData, name_mr: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50"
              placeholder="Auto translated..."
            />
          </div>

          {/* Gender and DOB Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Gender <span className="text-gold-500">लिंग</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
              >
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (स्त्री)</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Date of Birth <span className="text-gold-500">जन्मतारीख</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Relation */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Relation <span className="text-gold-500">नाते</span>
            </label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
            >
              <option value="">Select relation</option>
              {relations.map((relation) => (
                <option key={relation} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Record'}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <FaTimes />
              Reset
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRecord;
