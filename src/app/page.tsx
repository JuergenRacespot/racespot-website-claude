import { Hero }             from '@/components/sections/Hero'
import { RaceWeekBanner }   from '@/components/sections/RaceWeekBanner'
import { TvPartners }       from '@/components/sections/TvPartners'
import { Services }         from '@/components/sections/Services'
import { LatestBroadcasts } from '@/components/sections/LatestBroadcasts'
import { Team }             from '@/components/sections/Team'
import { ContactCTA }       from '@/components/sections/ContactCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <RaceWeekBanner />
      <TvPartners />
      <Services />
      <LatestBroadcasts />
      <Team />
      <ContactCTA />
    </>
  )
}
