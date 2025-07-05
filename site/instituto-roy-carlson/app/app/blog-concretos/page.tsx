
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export default function BlogConcretosPage() {
  const articles = [
    {
      title: 'Inovações em Concreto de Alto Desempenho',
      excerpt: 'Explorando as mais recentes tecnologias em concretos especiais para aplicações estruturais avançadas.',
      date: '2024-01-15',
      author: 'Equipe Técnica',
      category: 'Materiais'
    },
    {
      title: 'Controle Térmico em Concreto Massa: Lições de Roy Carlson',
      excerpt: 'Aplicação dos princípios desenvolvidos por Roy Carlson no controle térmico de grandes estruturas.',
      date: '2024-01-10',
      author: 'Dr. Silva',
      category: 'Técnicas'
    },
    {
      title: 'Sustentabilidade na Produção de Concreto',
      excerpt: 'Como a tecnologia moderna pode reduzir o impacto ambiental da produção de concreto.',
      date: '2024-01-05',
      author: 'Eng. Santos',
      category: 'Sustentabilidade'
    },
    {
      title: 'Instrumentação Avançada em Estruturas de Concreto',
      excerpt: 'Técnicas modernas de monitoramento baseadas nos trabalhos pioneiros de instrumentação.',
      date: '2023-12-28',
      author: 'Equipe Técnica',
      category: 'Instrumentação'
    },
    {
      title: 'Concretos Especiais para Ambientes Agressivos',
      excerpt: 'Desenvolvimento de formulações específicas para condições extremas de exposição.',
      date: '2023-12-20',
      author: 'Dr. Oliveira',
      category: 'Durabilidade'
    },
    {
      title: 'Análise Numérica em Estruturas de Concreto Massa',
      excerpt: 'Aplicação de métodos computacionais na análise de comportamento térmico e estrutural.',
      date: '2023-12-15',
      author: 'Eng. Costa',
      category: 'Simulação'
    }
  ]

  const categories = ['Todos', 'Materiais', 'Técnicas', 'Sustentabilidade', 'Instrumentação', 'Durabilidade', 'Simulação']

  return (
    <>
      <PageHeader
        title="Blog: Concretos Especiais"
        subtitle="Artigos técnicos sobre tecnologia do concreto e inovações em engenharia"
        backgroundImage="https://i.ytimg.com/vi/2cTKsHM--qE/maxresdefault.jpg"
      />
      
      <ContentLayout>
        <div className="mb-12">
          <h2>Conhecimento Técnico e Inovação</h2>
          <p>
            Nosso blog técnico compartilha conhecimentos especializados em tecnologia do concreto, 
            baseados no legado de Roy W. Carlson e nas mais recentes inovações da engenharia. 
            Publicamos regularmente artigos sobre materiais, técnicas construtivas, instrumentação 
            e análises especializadas.
          </p>
        </div>

        {/* Categories Filter */}
        <AnimatedSection delay={0.2}>
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded-lg transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <AnimatedSection key={article.title} delay={0.1 * index}>
              <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-900 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    
                    <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      Ler mais
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.8}>
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Legado de Publicações Técnicas
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                Seguindo a tradição de Roy W. Carlson, que publicou 56 artigos técnicos em 
                sociedades profissionais, nosso instituto mantém um compromisso contínuo com 
                a disseminação do conhecimento técnico especializado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">56</div>
                  <div className="text-gray-600">Artigos de Roy Carlson</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                  <div className="text-gray-600">Artigos Publicados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                  <div className="text-gray-600">Categorias Técnicas</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={1.0}>
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Contribua com o Conhecimento
            </h3>
            <p className="text-gray-600 mb-6">
              Interessado em contribuir com artigos técnicos ou compartilhar experiências? 
              Entre em contato conosco.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Enviar Proposta de Artigo
            </button>
          </div>
        </AnimatedSection>
      </ContentLayout>
    </>
  )
}
