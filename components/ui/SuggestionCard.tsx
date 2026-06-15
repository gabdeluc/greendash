type Props = {
  type: 'warning' | 'success' | 'info'
  title: string
  body: string
}

const styles = {
  warning: { border: '#f59e0b', bg: '#f59e0b0d', icon: 'warning',      text: '#f59e0b' },
  success: { border: '#4edea3', bg: '#4edea30d', icon: 'check_circle',  text: '#4edea3' },
  info:    { border: '#3b82f6', bg: '#3b82f60d', icon: 'info',          text: '#3b82f6' },
}

export default function SuggestionCard({ type, title, body }: Props) {
  const s = styles[type]
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ borderColor: `${s.border}4d`, background: s.bg }}
    >
      <div className="flex items-start gap-3">
        <span
          className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0"
          style={{ color: s.text, fontVariationSettings: "'FILL' 1" }}
        >
          {s.icon}
        </span>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: s.text }}>{title}</p>
          <p className="text-[#bbcabf] text-xs leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  )
}