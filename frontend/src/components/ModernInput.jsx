const ModernInput = ({ label, placeholder, type = "text", ...props }) => (
  <div className="group relative w-full mb-8">
    <label className="text-[9px] uppercase tracking-[0.3em] text-white/80 group-focus-within:text-[#b15df6] transition-colors mb-2 block font-bold">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-white/10 border-b border-white/10 py-3 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#b15df6] rounded transition-all duration-500"
      {...props}
    />
    <div className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-700 group-focus-within:w-full" />
  </div>
);

export default ModernInput;
