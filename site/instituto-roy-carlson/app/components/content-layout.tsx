
import { AnimatedSection } from './animated-section'

interface ContentLayoutProps {
  children: React.ReactNode
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection delay={0.2}>
          <div className="prose-custom">
            {children}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
