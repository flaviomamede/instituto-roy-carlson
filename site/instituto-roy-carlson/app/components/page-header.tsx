
import { AnimatedSection } from './animated-section'

interface PageHeaderProps {
  title: string
  subtitle: string
  backgroundImage?: string
}

export function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative py-24 bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection delay={0.2}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
