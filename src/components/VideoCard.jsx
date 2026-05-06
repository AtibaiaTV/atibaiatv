const THUMB_BG = {
  blue:   'linear-gradient(135deg, #c8def0 0%, #8ab8dc 100%)',
  green:  'linear-gradient(135deg, #c8eabb 0%, #8acc6e 100%)',
  orange: 'linear-gradient(135deg, #fde8bb 0%, #f5c66e 100%)',
  purple: 'linear-gradient(135deg, #ddd0f5 0%, #b494e8 100%)',
  teal:   'linear-gradient(135deg, #b0e8e0 0%, #5cc4b4 100%)',
}

function extractYtId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

function PlayIcon() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', zIndex: 1,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
        <polygon points="6,3 20,12 6,21" />
      </svg>
    </div>
  )
}

export default function VideoCard({ video }) {
  const ytId = extractYtId(video.youtubeUrl)
  const isVideoFile = video.thumbnailUrl && /\.(mp4|webm|mov)$/i.test(video.thumbnailUrl)
  const thumbSrc = (!isVideoFile && video.thumbnailUrl)
    ? video.thumbnailUrl
    : ytId
      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      : null

  const handleClick = () => {
    if (video.youtubeUrl) window.open(video.youtubeUrl, '_blank', 'noreferrer')
  }

  return (
    <div
      style={{ cursor: video.youtubeUrl ? 'pointer' : 'default' }}
      onClick={handleClick}
      onMouseEnter={e => e.currentTarget.querySelector('.vtitle').style.color = '#4a6fa5'}
      onMouseLeave={e => e.currentTarget.querySelector('.vtitle').style.color = '#1a1a2e'}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%', aspectRatio: '16/9', borderRadius: 8,
        background: THUMB_BG[video.thumb] || THUMB_BG.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', marginBottom: 8,
      }}>
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt={video.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <PlayIcon />
        {video.duration && (
          <span style={{
            position: 'absolute', bottom: 6, right: 6, zIndex: 1,
            background: 'rgba(0,0,0,0.75)', color: '#fff',
            fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: 3,
          }}>
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <h4 className="vtitle" style={{
        fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.35,
        color: '#1a1a2e', marginBottom: 4, transition: 'color .2s',
      }}>
        {video.title}
      </h4>
      {video.views && <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{video.views} visualizações</span>}
    </div>
  )
}
