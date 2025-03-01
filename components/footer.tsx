import Link from "next/link"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <span className="text-xl font-bold">ModernAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future of AI-powered conversations that feel natural and intuitive.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ModernAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

