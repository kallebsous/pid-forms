import { motion, AnimatePresence } from 'framer-motion';

interface SuccessToastProps {
    show: boolean;
    message: string;
}

export function SuccessToast({ show, message }: SuccessToastProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
