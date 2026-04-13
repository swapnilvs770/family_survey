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
        rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl 
        border border-white/10
        backdrop-blur-sm
        min-h-[120px] sm:min-h-[140px]
      `}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">{title}</p>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">{value}</h3>
          <p className="text-white/60 text-xs truncate">{subtitle}</p>
        </div>
        <div className="bg-white/20 rounded-full p-2 sm:p-3 flex-shrink-0 ml-2">
          <Icon className="text-xl sm:text-2xl lg:text-3xl text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;