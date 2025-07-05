
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { BookOpen, FileText, Award, Users } from 'lucide-react'

export default function ReferenciasPage() {
  const categories = [
    {
      icon: BookOpen,
      title: 'Publicações de Roy Carlson',
      count: 56,
      description: 'Artigos técnicos publicados por Roy W. Carlson em sociedades profissionais'
    },
    {
      icon: FileText,
      title: 'Normas Técnicas',
      count: 25,
      description: 'Normas brasileiras e internacionais relacionadas ao concreto'
    },
    {
      icon: Award,
      title: 'Trabalhos Acadêmicos',
      count: 120,
      description: 'Teses, dissertações e trabalhos de pesquisa'
    },
    {
      icon: Users,
      title: 'Publicações do Instituto',
      count: 30,
      description: 'Artigos e relatórios técnicos produzidos pelo instituto'
    }
  ]

  const carlsonPublications = [
    {
      title: 'Instrumentation of Mass Concrete Structures',
      journal: 'ACI Journal',
      year: '1960',
      type: 'Artigo Técnico'
    },
    {
      title: 'Temperature Control in Mass Concrete',
      journal: 'ASCE Proceedings',
      year: '1963',
      type: 'Artigo Técnico'
    },
    {
      title: 'Stress Measurements in Concrete Structures',
      journal: 'Journal of Materials',
      year: '1965',
      type: 'Artigo Técnico'
    },
    {
      title: 'Long-term Performance of Concrete Dams',
      journal: 'International Commission on Large Dams',
      year: '1970',
      type: 'Relatório Técnico'
    }
  ]

  const technicalStandards = [
    {
      code: 'NBR 6118',
      title: 'Projeto de estruturas de concreto — Procedimento',
      organization: 'ABNT'
    },
    {
      code: 'NBR 12655',
      title: 'Concreto de cimento Portland — Preparo, controle, recebimento e aceitação',
      organization: 'ABNT'
    },
    {
      code: 'ACI 207.1R',
      title: 'Guide to Mass Concrete',
      organization: 'American Concrete Institute'
    },
    {
      code: 'ACI 207.2R',
      title: 'Effect of Restraint, Volume Change, and Reinforcement on Cracking of Mass Concrete',
      organization: 'American Concrete Institute'
    }
  ]

  return (
    <>
      <PageHeader
        title="Referências Técnicas"
        subtitle="Bibliografia especializada e referências científicas em engenharia de concreto"
        backgroundImage="https://img.jagranjosh.com/images/2022/November/30112022/AICTE-Engineering-Books.jpg"
      />
      
      <ContentLayout>
        <h2>Biblioteca Técnica Especializada</h2>
        
        <p>
          Nossa biblioteca técnica reúne as principais referências em engenharia de concreto, 
          incluindo as publicações pioneiras de Roy W. Carlson, normas técnicas atualizadas 
          e os mais recentes avanços da pesquisa internacional.
        </p>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
            {categories.map((category, index) => (
              <div key={category.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="bg-indigo-100 p-4 rounded-lg w-fit mx-auto mb-4">
                  <category.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">{category.count}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Publicações Selecionadas de Roy W. Carlson</h3>
        
        <p>
          Roy Carlson publicou 56 artigos técnicos em sociedades profissionais ao longo 
          de sua carreira, abordando temas como instrumentação, análise estrutural, 
          segurança de barragens, tecnologia do concreto e química do cimento.
        </p>

        <AnimatedSection delay={0.5}>
          <div className="bg-blue-50 p-8 rounded-xl my-8">
            <h4 className="font-semibold text-blue-900 mb-6">Principais Trabalhos</h4>
            <div className="space-y-4">
              {carlsonPublications.map((pub, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{pub.title}</h5>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">{pub.type}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{pub.journal} • {pub.year}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <h3>Normas Técnicas Fundamentais</h3>
        
        <p>
          Compilação das principais normas técnicas brasileiras e internacionais 
          relacionadas ao projeto e execução de estruturas de concreto:
        </p>

        <AnimatedSection delay={0.7}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
            {technicalStandards.map((standard, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-800 font-semibold text-sm">{standard.code}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{standard.title}</h4>
                    <p className="text-gray-600 text-sm">{standard.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Áreas de Pesquisa Prioritárias</h3>
        
        <p>
          Nossa biblioteca concentra referências nas seguintes áreas de especialização:
        </p>

        <ul>
          <li><strong>Concreto Massa:</strong> Tecnologias para grandes estruturas 
          e controle térmico</li>
          
          <li><strong>Instrumentação:</strong> Técnicas de medição e monitoramento 
          em estruturas de concreto</li>
          
          <li><strong>Análise Numérica:</strong> Métodos computacionais para 
          simulação estrutural</li>
          
          <li><strong>Durabilidade:</strong> Comportamento a longo prazo e 
          vida útil de estruturas</li>
          
          <li><strong>Materiais Especiais:</strong> Concretos de alto desempenho 
          e aplicações específicas</li>
        </ul>

        <AnimatedSection delay={0.9}>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl">
            <h3>Contribuições do Instituto</h3>
            <p>
              Continuando a tradição de publicação técnica iniciada por Roy Carlson, 
              nosso instituto produz regularmente:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <ul className="space-y-2">
                <li>• Artigos em revistas especializadas</li>
                <li>• Relatórios técnicos de projetos</li>
                <li>• Manuais de procedimentos</li>
                <li>• Estudos de caso documentados</li>
              </ul>
              <ul className="space-y-2">
                <li>• Apresentações em congressos</li>
                <li>• Contribuições para normas técnicas</li>
                <li>• Material didático especializado</li>
                <li>• Boletins técnicos informativos</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <h3>Acesso à Bibliografia</h3>
        
        <p>
          Nossa biblioteca técnica está disponível para:
        </p>

        <ul>
          <li>Pesquisadores e estudantes de pós-graduação</li>
          <li>Engenheiros em atividade profissional</li>
          <li>Instituições parceiras</li>
          <li>Membros de organizações técnicas</li>
        </ul>

        <AnimatedSection delay={1.1}>
          <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-lg">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Consulte Nossa Biblioteca
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Interessado em acessar nossas referências técnicas ou contribuir 
              com novas publicações? Entre em contato conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Solicitar Acesso
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
                Submeter Publicação
              </button>
            </div>
          </div>
        </AnimatedSection>
      </ContentLayout>
    </>
  )
}
