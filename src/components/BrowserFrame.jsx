/** Minimal browser chrome around a screenshot or any content. */
export function BrowserFrame({ url, children, className = '', compact = false }) {
  return (
    <div className={`overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-[#140E24] ${className}`}>
      <div className={`flex items-center gap-2 border-b border-white/[0.07] ${compact ? 'px-3 py-2' : 'px-4 py-2.5'}`}>
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        {url && (
          <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-[#A096BE]">
            {url}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
