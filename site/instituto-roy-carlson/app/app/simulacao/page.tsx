
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { Calculator, Cpu, BarChart3, Zap } from 'lucide-react'

export default function SimulacaoPage() {
  const capabilities = [
    {
      icon: Calculator,
      title: 'Análise Termomecânica',
      description: 'Simulação de comportamento térmico e mecânico em estruturas de concreto massa'
    },
    {
      icon: Cpu,
      title: 'Modelagem Numérica',
      description: 'Modelos computacionais avançados para análise estrutural'
    },
    {
      icon: BarChart3,
      title: 'Análise de Tensões',
      description: 'Distribuição de tensões e deformações em tempo real'
    },
    {
      icon: Zap,
      title: 'Simulação de Hidratação',
      description: 'Modelagem do processo de hidratação do cimento'
    }
  ]

  return (
    <>
      <PageHeader
        title="Simulação Computacional"
        subtitle="Simulações termomecânicas avançadas para análise estrutural"
        backgroundImage="https://i.ytimg.com/vi/oL_DOxFagvI/maxresdefault.jpg"
      />
      
      <ContentLayout>
        <h2>Simulações Termomecânicas Avançadas</h2>
        
        <p>
          Utilizamos ferramentas computacionais de última geração para simular o comportamento 
          termomecânico de estruturas de concreto, permitindo análises precisas e otimização 
          de projetos antes da execução.
        </p>

        <h3>Tecnologias Aplicadas</h3>
        
        <p>
          Nossos estudos de simulação computacional abrangem uma ampla gama de análises 
          especializadas para estruturas de concreto:
        </p>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {capabilities.map((capability, index) => (
              <div key={capability.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <capability.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{capability.title}</h4>
                    <p className="text-gray-600">{capability.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Análise Térmica em Concreto Massa</h3>
        
        <p>
          Uma das principais especialidades do instituto é a simulação do comportamento térmico 
          em estruturas de concreto massa, seguindo a tradição estabelecida por Roy Carlson:
        </p>

        <ul>
          <li><strong>Evolução de Temperatura:</strong> Modelagem da elevação térmica durante 
          a hidratação do cimento e sua dissipação ao longo do tempo</li>
          
          <li><strong>Gradientes Térmicos:</strong> Análise de diferenças de temperatura 
          entre núcleo e superfície da estrutura</li>
          
          <li><strong>Controle de Fissuração:</strong> Previsão e prevenção de fissuras 
          causadas por tensões térmicas</li>
          
          <li><strong>Otimização de Resfriamento:</strong> Dimensionamento de sistemas 
          de refrigeração artificial</li>
        </ul>

        <h3>Modelagem Estrutural</h3>
        
        <p>
          Desenvolvemos modelos computacionais sofisticados para análise estrutural:
        </p>

        <ul>
          <li>Análise não-linear de materiais</li>
          <li>Comportamento viscoelástico do concreto</li>
          <li>Interação solo-estrutura</li>
          <li>Análise dinâmica e sísmica</li>
          <li>Fadiga e durabilidade</li>
        </ul>

        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
            <h3>Ferramentas Computacionais</h3>
            <p>
              Utilizamos software especializado e desenvolvemos ferramentas proprietárias 
              baseadas nos princípios estabelecidos por Roy Carlson:
            </p>
            
            <ul>
              <li>Software de elementos finitos especializado</li>
              <li>Modelos constitutivos avançados para concreto</li>
              <li>Algoritmos de otimização estrutural</li>
              <li>Interfaces gráficas para visualização 3D</li>
              <li>Sistemas de monitoramento em tempo real</li>
            </ul>
          </div>
        </AnimatedSection>

        <h3>Aplicações Práticas</h3>
        
        <p>
          Nossas simulações são aplicadas em diversos tipos de projetos:
        </p>

        <ul>
          <li>Barragens e estruturas hidrelétricas</li>
          <li>Edifícios altos e suas fundações</li>
          <li>Pontes e viadutos</li>
          <li>Estruturas industriais</li>
          <li>Obras portuárias e marítimas</li>
        </ul>
      </ContentLayout>
    </>
  )
}
