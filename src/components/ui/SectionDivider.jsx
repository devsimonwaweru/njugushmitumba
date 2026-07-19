export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent to-gold-500" />
      <div className="w-2 h-2 bg-gold-500 rotate-45 flex-shrink-0" />
      <div className="flex-1 max-w-[100px] h-px bg-gradient-to-l from-transparent to-gold-500" />
    </div>
  )
}