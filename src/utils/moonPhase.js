/* fase da lua calculada localmente (sem API) a partir de uma lua nova conhecida */
var SYNODIC_MONTH = 29.53058867
var KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) // 6 jan 2000, 18:14 UTC

var PHASES = [
  { max: 0.02,  label: 'Lua Nova',         icon: '🌑' },
  { max: 0.25,  label: 'Lua Crescente',    icon: '🌒' },
  { max: 0.27,  label: 'Quarto Crescente', icon: '🌓' },
  { max: 0.48,  label: 'Lua Gibosa',       icon: '🌔' },
  { max: 0.52,  label: 'Lua Cheia',        icon: '🌕' },
  { max: 0.73,  label: 'Lua Minguante',    icon: '🌖' },
  { max: 0.77,  label: 'Quarto Minguante', icon: '🌗' },
  { max: 0.98,  label: 'Lua Minguante',    icon: '🌘' },
  { max: 1.01,  label: 'Lua Nova',         icon: '🌑' },
]

export default function getMoonPhase(date) {
  var d = date || new Date()
  var daysSince = (d.getTime() - KNOWN_NEW_MOON) / 86400000
  var phase = (daysSince % SYNODIC_MONTH) / SYNODIC_MONTH
  if (phase < 0) phase += 1

  for (var i = 0; i < PHASES.length; i++) {
    if (phase <= PHASES[i].max) return PHASES[i]
  }
  return PHASES[0]
}
