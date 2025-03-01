"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageSquare, Zap, Shield, Globe, Sparkles, RefreshCw } from "lucide-react"

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Natural Conversations",
      description: "Our AI understands context and nuance, creating conversations that feel natural and human-like.",
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized AI that processes and responds in milliseconds.",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure & Private",
      description: "Your conversations are encrypted and never shared, ensuring your data remains private.",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Multilingual Support",
      description:
        "Communicate in over 50 languages with our AI that understands and responds in your preferred language.",
    },
    {
      icon: <Sparkles className="h-10 w-10" />,
      title: "Personalized Experience",
      description: "Our AI learns from your interactions to provide increasingly personalized responses over time.",
    },
    {
      icon: <RefreshCw className="h-10 w-10" />,
      title: "Continuous Learning",
      description: "Our models are constantly improving, learning from new data to provide better responses.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge AI with intuitive design to deliver an exceptional experience.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

