/* gera um id estavel de participante a partir do contato (preferencial) ou do nome */
export default function slugifyParticipant(contact, name) {
  var base = (contact || name || '').toString().trim().toLowerCase()
  if (!base) return null
  return base
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || null
}
