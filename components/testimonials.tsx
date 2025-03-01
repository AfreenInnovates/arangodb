"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "This AI chat platform has transformed how we interact with our customers. The responses are so natural that many can't tell they're talking to an AI. It's been a game-changer for our support team.",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I've tried many AI chat solutions, but this one stands out for its understanding of context and nuance. It's like having a conversation with a knowledgeable colleague rather than a robot.",
      stars: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      company: "GrowthWave",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The speed and accuracy of responses have helped us scale our customer support without sacrificing quality. Our satisfaction scores have increased by 35% since implementation.",
      stars: 4,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what people are saying about our AI chat platform.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-6 shadow-sm relative"
            >
              <div className="absolute -top-4 -right-4 bg-background rounded-full p-2 shadow-md">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="italic text-muted-foreground">"{testimonial.content}"</p>
              </div>

              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

