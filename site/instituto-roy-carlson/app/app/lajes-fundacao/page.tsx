
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { Building2, Layers, Calculator, Shield } from 'lucide-react'

export default function LajesFundacaoPage() {
  const features = [
    {
      icon: Building2,
      title: 'Análise Estrutural',
      description: 'Dimensionamento preciso para suporte de cargas elevadas'
    },
    {
      icon: Layers,
      title: 'Distribuição de Cargas',
      description: 'Otimização da transferência de cargas para o solo'
    },
    {
      icon: Calculator,
      title: 'Modelagem Numérica',
      description: 'Simulação computacional do comportamento estrutural'
    },
    {
      icon: Shield,
      title: 'Controle de Qualidade',
      description: 'Monitoramento e instrumentação durante execução'
    }
  ]

  return (
    <>
      <PageHeader
        title="Lajes de Fundação"
        subtitle="Especialização em lajes de fundação para edifícios altos"
        backgroundImage="https://thumbs.dreamstime.com/b/aerial-view-workers-new-house-construction-site-pouring-concrete-flat-slab-foundation-bedding-ready-building-walls-279874608.jpg"
      />
      
      <ContentLayout>
        <h2>Fundações para Edifícios Altos</h2>
        
        <p>
          O Instituto Roy Carlson desenvolve projetos especializados em lajes de fundação 
          para edifícios de grande altura, aplicando tecnologias avançadas de concreto 
          e instrumentação baseadas nos princípios estabelecidos por Roy W. Carlson.
        </p>

        <h3>Desafios Técnicos</h3>
        
        <p>
          As fundações de edifícios altos apresentam desafios únicos que requerem 
          soluções técnicas especializadas:
        </p>

        <ul>
          <li><strong>Cargas Elevadas:</strong> Concentração de cargas extremamente altas 
          provenientes da superestrutura</li>
          
          <li><strong>Controle de Recalques:</strong> Minimização e uniformização de 
          recalques diferenciais</li>
          
          <li><strong>Concreto de Alto Desempenho:</strong> Utilização de concretos 
          especiais com alta resistência e durabilidade</li>
          
          <li><strong>Execução em Etapas:</strong> Planejamento de concretagem em 
          grandes volumes</li>
        </ul>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Tecnologias Aplicadas</h3>
        
        <p>
          Utilizamos tecnologias de ponta combinadas com os conhecimentos tradicionais 
          desenvolvidos por Roy Carlson:
        </p>

        <ul>
          <li><strong>Instrumentação Avançada:</strong> Sensores de deformação, 
          temperatura e pressão para monitoramento contínuo</li>
          
          <li><strong>Concreto Autoadensável:</strong> Formulações especiais para 
          facilitar a concretagem em estruturas densamente armadas</li>
          
          <li><strong>Controle Térmico:</strong> Técnicas de resfriamento para 
          controle da elevação de temperatura em grandes volumes</li>
          
          <li><strong>Análise Numérica:</strong> Modelagem computacional tridimensional 
          para otimização do projeto</li>
        </ul>

        <h3>Processo de Projeto</h3>
        
        <p>
          Nosso processo de projeto segue uma metodologia rigorosa desenvolvida 
          ao longo de décadas de experiência:
        </p>

        <ol>
          <li><strong>Investigação Geotécnica:</strong> Caracterização detalhada 
          do subsolo e determinação da capacidade de carga</li>
          
          <li><strong>Análise de Cargas:</strong> Levantamento preciso das cargas 
          da superestrutura e análise de combinações críticas</li>
          
          <li><strong>Dimensionamento Estrutural:</strong> Cálculo das dimensões 
          da laje e armaduras necessárias</li>
          
          <li><strong>Verificação por Elementos Finitos:</strong> Análise numérica 
          detalhada do comportamento estrutural</li>
          
          <li><strong>Projeto de Instrumentação:</strong> Definição dos pontos 
          de monitoramento e tipos de sensores</li>
          
          <li><strong>Plano de Concretagem:</strong> Sequência executiva e 
          especificações do concreto</li>
        </ol>

        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl">
            <h3>Inovações Desenvolvidas</h3>
            <p>
              Baseando-nos no legado de Roy Carlson, desenvolvemos várias inovações 
              para projetos de lajes de fundação:
            </p>
            
            <ul>
              <li>Sistemas de resfriamento integrados para controle térmico</li>
              <li>Instrumentação remota para monitoramento contínuo</li>
              <li>Concretos especiais com baixo calor de hidratação</li>
              <li>Técnicas de concretagem em grandes volumes</li>
              <li>Métodos de análise de interação solo-estrutura</li>
            </ul>
          </div>
        </AnimatedSection>

        <h3>Controle de Qualidade</h3>
        
        <p>
          O controle de qualidade é fundamental em projetos de lajes de fundação, 
          seguindo os padrões estabelecidos por Roy Carlson:
        </p>

        <ul>
          <li>Controle rigoroso da qualidade do concreto</li>
          <li>Monitoramento da temperatura durante a cura</li>
          <li>Acompanhamento de recalques e deformações</li>
          <li>Ensaios de verificação da capacidade de carga</li>
          <li>Documentação completa do processo construtivo</li>
        </ul>

        <h3>Casos de Sucesso</h3>
        
        <p>
          Aplicamos nossa expertise em diversos projetos de fundações para edifícios altos:
        </p>

        <ul>
          <li>Torres residenciais com mais de 40 pavimentos</li>
          <li>Edifícios comerciais de grande porte</li>
          <li>Complexos mistos de uso múltiplo</li>
          <li>Estruturas com cargas concentradas elevadas</li>
        </ul>
      </ContentLayout>
    </>
  )
}
