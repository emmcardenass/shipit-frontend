// src/components/ui/input.jsx
export default function Input({ className = "", ...props }) {
    return (
      <input
        {...props}
        className={`w-full px-4 py-2 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur border border-white/20 text-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 ${className}`}
      />
    );
  }
  