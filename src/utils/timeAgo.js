export default function timeAgo(value) {
  if (!value) return ''
  var d = value.toDate ? value.toDate() : new Date(value)
  var diffMs = Date.now() - d.getTime()
  var diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'há poucos segundos'

  var diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return 'há ' + diffMin + (diffMin === 1 ? ' minuto' : ' minutos')

  var diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return 'há ' + diffH + (diffH === 1 ? ' hora' : ' horas')

  var diffD = Math.floor(diffH / 24)
  if (diffD < 7) return 'há ' + diffD + (diffD === 1 ? ' dia' : ' dias')

  return d.toLocaleDateString('pt-BR')
}
