import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`
        bg-gradient-to-br ${color} 
        rounded-xl p-6 shadow-xl 
        border border-white/10
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-white mb-1">{value}</h3>
          <p className="text-white/60 text-xs">{subtitle}</p>
        </div>
        <div className="bg-white/20 rounded-full p-3">
          <Icon className="text-3xl text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
