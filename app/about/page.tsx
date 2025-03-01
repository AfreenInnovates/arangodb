import { Briefcase, Users, Award, BarChart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 z-0"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-12 md:mb-24 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground">
              We're building the future of communication through AI-powered conversations that feel natural and
              intuitive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our team"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                We believe in a world where technology enhances human connection rather than replacing it. Our mission
                is to create AI-powered communication tools that amplify human potential and make meaningful
                conversations accessible to everyone.
              </p>
              <p className="text-muted-foreground">
                Founded in 2023, we've been at the forefront of conversational AI, developing solutions that feel
                natural, responsive, and genuinely helpful.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Team of Experts",
                description: "Our diverse team brings together expertise in AI, design, and human psychology.",
              },
              {
                icon: <Briefcase className="h-10 w-10 text-primary" />,
                title: "Industry Experience",
                description: "With decades of combined experience, we understand what makes conversations work.",
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Award Winning",
                description: "Our technology has been recognized for its innovation and effectiveness.",
              },
              {
                icon: <BarChart className="h-10 w-10 text-primary" />,
                title: "Data Driven",
                description: "We use insights from millions of conversations to continuously improve.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="space-y-8">
              {[
                { title: "Human-Centered Design", description: "We put people first in everything we build." },
                { title: "Continuous Innovation", description: "We're never satisfied with the status quo." },
                {
                  title: "Ethical AI",
                  description: "We develop AI responsibly, with clear principles and boundaries.",
                },
                { title: "Accessibility", description: "We believe great technology should be available to everyone." },
              ].map((value, index) => (
                <div key={index} className="group">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

