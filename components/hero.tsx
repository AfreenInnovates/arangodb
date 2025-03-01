"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 z-10"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="container px-4 md:px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ opacity }}
            className="flex flex-col space-y-4"
          >
            <div className="inline-block">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                Now Available Worldwide
              </motion.span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Experience the future of{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                AI conversation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-[600px]"
            >
              Our cutting-edge AI platform delivers natural, intuitive conversations that feel human. Experience the
              difference today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button asChild size="lg" className="group">
                <Link href="/chat">
                  Start Chatting
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ y, opacity }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl animate-pulse-glow"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border shadow-xl animate-float">
                <Image
                  src="/placeholder.svg?height=800&width=800"
                  alt="AI Chat Interface"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-card rounded-xl border border-border shadow-lg p-4 w-32"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="h-2 w-2/3 rounded-full bg-primary mb-2"></div>
                <div className="h-2 w-full rounded-full bg-muted"></div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-card rounded-xl border border-border shadow-lg p-4 w-40"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <div className="h-2 w-1/2 rounded-full bg-primary mb-2"></div>
                <div className="h-2 w-full rounded-full bg-muted mb-2"></div>
                <div className="h-2 w-2/3 rounded-full bg-muted"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-muted"></div>
        </div>
      </motion.div>
    </section>
  )
}

