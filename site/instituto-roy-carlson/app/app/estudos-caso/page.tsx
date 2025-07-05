
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { Building, Construction, Waves, Factory } from 'lucide-react'

export default function EstudosCasoPage() {
  const cases = [
    {
      icon: Building,
      title: 'Edifícios Altos',
      description: 'Análise de fundações e estruturas de concreto em edifícios de grande altura',
      highlights: ['Torres residenciais', 'Edifícios comerciais', 'Estruturas mistas']
    },
    {
      icon: Construction,
      title: 'Pontes e Viadutos',
      description: 'Projetos de pontes com aplicação de tecnologia avançada de concreto',
      highlights: ['Pontes estaiadas', 'Viadutos urbanos', 'Passarelas']
    },
    {
      icon: Waves,
      title: 'Estruturas Hidráulicas',
      description: 'Barragens e estruturas relacionadas a recursos hídricos',
      highlights: ['Barragens de concreto', 'Vertedouros', 'Túneis hidráulicos']
    },
    {
      icon: Factory,
      title: 'Estruturas Industriais',
      description: 'Projetos industriais com requisitos especiais de durabilidade',
      highlights: ['Silos e reservatórios', 'Estruturas químicas', 'Pisos industriais']
    }
  ]

  return (
    <>
      <PageHeader
        title="Estudos de Caso"
        subtitle="Análise de casos técnicos e obras importantes"
        backgroundImage="https://thumbs.dreamstime.com/b/concrete-building-aerial-view-construction-crane-house-multi-storey-modern-esidential-complex-under-207976948.jpg"
      />
      
      <ContentLayout>
        <h2>Casos Técnicos Relevantes</h2>
        
        <p>
          Apresentamos uma seleção de estudos de caso que demonstram a aplicação prática 
          dos conhecimentos e tecnologias desenvolvidas pelo Instituto Roy Carlson, 
          baseados nos princípios estabelecidos por Roy W. Carlson.
        </p>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
            {cases.map((caseItem, index) => (
              <div key={caseItem.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <caseItem.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
                    <p className="text-gray-600">{caseItem.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {caseItem.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Metodologia de Análise</h3>
        
        <p>
          Cada estudo de caso é desenvolvido seguindo uma metodologia rigorosa que 
          incorpora os princípios estabelecidos por Roy Carlson:
        </p>

        <ul>
          <li><strong>Caracterização do Problema:</strong> Análise detalhada dos 
          desafios técnicos e requisitos específicos</li>
          
          <li><strong>Instrumentação e Monitoramento:</strong> Aplicação de técnicas 
          de instrumentação para coleta de dados precisos</li>
          
          <li><strong>Modelagem Computacional:</strong> Desenvolvimento de modelos 
          numéricos para análise e otimização</li>
          
          <li><strong>Validação Experimental:</strong> Confirmação dos resultados 
          através de ensaios e medições in situ</li>
          
          <li><strong>Documentação Técnica:</strong> Registro detalhado dos processos 
          e resultados para futuras referências</li>
        </ul>

        <h3>Projeto de Destaque: Complexo de Itaipu</h3>
        
        <p>
          Um dos estudos de caso mais significativos relaciona-se ao trabalho de 
          Roy Carlson na resolução de problemas complexos na construção da 
          barragem de Itaipu:
        </p>

        <ul>
          <li>Desenvolvimento de concreto massa especial</li>
          <li>Controle rigoroso da elevação de temperatura</li>
          <li>Instrumentação extensiva para monitoramento</li>
          <li>Técnicas inovadoras de resfriamento</li>
          <li>Controle de fissuração em grande escala</li>
        </ul>

        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl">
            <h3>Lições Aprendidas</h3>
            <p>
              Cada projeto contribui para o acúmulo de conhecimento técnico, 
              permitindo o desenvolvimento de soluções cada vez mais eficientes:
            </p>
            
            <ul>
              <li>Otimização de dosagens de concreto</li>
              <li>Aperfeiçoamento de técnicas construtivas</li>
              <li>Desenvolvimento de novos instrumentos de medição</li>
              <li>Refinamento de modelos computacionais</li>
              <li>Estabelecimento de melhores práticas</li>
            </ul>
          </div>
        </AnimatedSection>

        <h3>Documentação e Publicações</h3>
        
        <p>
          Todos os estudos de caso são documentados em publicações técnicas, 
          seguindo a tradição de Roy Carlson, que publicou 56 artigos técnicos 
          ao longo de sua carreira. Esta documentação serve como:
        </p>

        <ul>
          <li>Base para futuras pesquisas</li>
          <li>Material didático para formação de engenheiros</li>
          <li>Referência para projetos similares</li>
          <li>Contribuição para o conhecimento técnico nacional</li>
        </ul>
      </ContentLayout>
    </>
  )
}
