import WeatherWidget from './WeatherWidget'
import MarketWidget from './MarketWidget'
import EnqueteWidget from './EnqueteWidget'
import HighwayWidget from './HighwayWidget'
import AccessibilityWidget from './AccessibilityWidget'

export default function SidebarWidgets() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <WeatherWidget />
      <EnqueteWidget />
      <MarketWidget />
      <HighwayWidget />
      <AccessibilityWidget />
    </div>
  )
}
