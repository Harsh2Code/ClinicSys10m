import { LuArrowRight, LuActivity } from 'react-icons/lu';

export const InteractionCard = ({ patient, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(patient)}
      className="group relative p-6 bg-white/[0.02] border border-white/10 rounded-sm transition-all duration-500 hover:bg-white/[0.05] hover:border-[#b15df6]/40 cursor-pointer overflow-hidden"
    >
      {/* Micro-interaction: The corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#b15df6] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] text-[#b15df6] font-bold uppercase tracking-[0.2em] mb-1 block">Patient Record</span>
          <h4 className="font-montserrat text-xl font-medium text-white/90 leading-tight">
            {patient.name}
          </h4>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-light text-white/20 group-hover:text-[#b15df6] transition-colors">
            #{patient.token}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-4 text-white/30 text-[10px] uppercase font-bold tracking-widest">
          <span className="flex items-center gap-1"><LuActivity size={12}/> {patient.status}</span>
          <span>{patient.age} Years</span>
        </div>
        <LuArrowRight className="text-[#b15df6] opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
    </div>
  );
};