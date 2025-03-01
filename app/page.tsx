import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import CallToAction from "@/components/call-to-action"

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
    </main>
  )
}

