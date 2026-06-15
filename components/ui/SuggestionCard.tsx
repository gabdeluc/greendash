type Props = {
  type: 'warning' | 'success' | 'info'
  title: string
  body: string
}

const styles = {
  warning: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    icon: '⚠️',
    title: 'text-yellow-400',
  },
  success: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    icon: '✅',
    title: 'text-green-400',
  },
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    icon: '💡',
    title: 'text-blue-400',
  },
}

export default function SuggestionCard({ type, title, body }: Props) {
  const s = styles[type]
  return (
    <div className={`border ${s.border} ${s.bg} rounded-xl p-4`}>
      <p className={`text-sm font-medium ${s.title} mb-1`}>
        {s.icon} {title}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
    </div>
  )
}