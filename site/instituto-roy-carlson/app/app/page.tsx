
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Calculator, FlaskConical, GraduationCap, BookOpen, Users, Microscope, Layers } from 'lucide-react'
import { AnimatedSection } from '@/components/animated-section'
import { AnimatedCard } from '@/components/animated-card'

export default function HomePage() {
  const areas = [
    {
      icon: Calculator,
      title: 'Simulação Computacional',
      description: 'Simulações termomecânicas avançadas para análise estrutural',
      href: '/simulacao',
      color: 'blue'
    },
    {
      icon: Building2,
      title: 'Estudos de Caso',
      description: 'Análise de casos técnicos e obras importantes',
      href: '/estudos-caso',
      color: 'green'
    },
    {
      icon: Layers,
      title: 'Lajes de Fundação',
      description: 'Especialização em fundações para edifícios altos',
      href: '/lajes-fundacao',
      color: 'purple'
    },
    {
      icon: FlaskConical,
      title: 'Ensaios Especiais',
      description: 'Ensaios inovadores e especializados',
      href: '/ensaios',
      color: 'orange'
    },
    {
      icon: BookOpen,
      title: 'Blog Concretos',
      description: 'Artigos sobre tecnologia do concreto',
      href: '/blog-concretos',
      color: 'indigo'
    },
    {
      icon: Users,
      title: 'Parcerias Acadêmicas',
      description: 'Colaborações com universidades e institutos',
      href: '/parcerias',
      color: 'teal'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-gray-900/60 z-10"
        />
        <div 
          className="absolute inset-0 parallax"
          style={{
            backgroundImage: `url('https://images.pond5.com/aerial-panoramic-view-concrete-dam-footage-112359009_iconl.jpeg')`
          }}
        />
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <AnimatedSection delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Instituto Roy Carlson
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Avançando a fronteira da engenharia de concreto com inovação e pesquisa
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.6}>
            <Link 
              href="/institucional" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors transform hover:scale-105"
            >
              Conheça Nossa História
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* About Roy Carlson Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/roy-carlson-1.jpg"
                  alt="Roy W. Carlson"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  O Legado de Roy W. Carlson
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Roy W. Carlson (1900-1990) foi um pioneiro na instrumentação para concreto e 
                  tecnologia de concreto massa. Suas contribuições revolucionaram a construção 
                  de grandes barragens no mundo todo, incluindo projetos fundamentais no Brasil.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Por suas contribuições aos grandes desenvolvimentos hidrelétricos brasileiros, 
                  recebeu a Ordem do Cruzeiro do Sul em 1984, a mais alta honraria do Brasil 
                  para um estrangeiro.
                </p>
                <Link 
                  href="/institucional" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Saiba mais sobre nossa história
                  <GraduationCap className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Areas de Atuação */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Áreas de Atuação
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Desenvolvemos pesquisas e projetos avançados em diversas áreas da engenharia de concreto
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <AnimatedCard key={area.title} delay={0.1 * index}>
                <Link href={area.href} className="block h-full">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full hover:-translate-y-1">
                    <div className={`w-16 h-16 bg-${area.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                      <area.icon className={`w-8 h-8 text-${area.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Legado Furnas Highlight */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedSection delay={0.2}>
              <Microscope className="w-20 h-20 mx-auto mb-8 opacity-80" />
              <h2 className="text-4xl font-bold mb-6">
                Legado do Laboratório de Concreto de Furnas
              </h2>
              <p className="text-xl opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed">
                Continuamos a tradição de excelência iniciada no laboratório de concreto de Furnas, 
                aplicando décadas de conhecimento e experiência em projetos de engenharia de vanguarda.
              </p>
              <Link 
                href="/legado-furnas" 
                className="inline-block bg-white text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Explore o Legado Furnas
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
