"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Ready to experience the future of AI conversation?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Join thousands of users who are already transforming how they communicate with AI. Start chatting today and
            see the difference for yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="/chat">
                Start Chatting Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

