import { cn } from '@/utils/tailwindUtils';
import { motion } from 'framer-motion';

export default function Transition({
  children,
  duration = 0.75,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: duration }}
      >
        {children}
      </motion.div>
    </div>
  );
}
