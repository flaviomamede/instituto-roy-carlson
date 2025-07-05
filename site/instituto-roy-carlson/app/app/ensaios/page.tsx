
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { FlaskConical, Thermometer, Gauge, Microscope } from 'lucide-react'

export default function EnsaiosPage() {
  const testTypes = [
    {
      icon: FlaskConical,
      title: 'Ensaios de Resistência',
      description: 'Testes de compressão, tração e flexão em corpos de prova',
      tests: ['Compressão axial', 'Tração por compressão diametral', 'Flexão em vigas']
    },
    {
      icon: Thermometer,
      title: 'Análise Térmica',
      description: 'Estudos do comportamento térmico durante a hidratação',
      tests: ['Calorimetria', 'Evolução de temperatura', 'Gradientes térmicos']
    },
    {
      icon: Gauge,
      title: 'Instrumentação Especial',
      description: 'Medições precisas usando técnicas desenvolvidas por Carlson',
      tests: ['Strain gauges', 'Células de carga', 'Sensores de pressão']
    },
    {
      icon: Microscope,
      title: 'Microestrutura',
      description: 'Análise microscópica da estrutura do concreto',
      tests: ['Microscopia eletrônica', 'Porosimetria', 'Análise química']
    }
  ]

  return (
    <>
      <PageHeader
        title="Ensaios Especiais"
        subtitle="Ensaios especiais e inovadores baseados nas técnicas de Roy Carlson"
        backgroundImage="https://i.ytimg.com/vi/2cTKsHM--qE/maxresdefault.jpg"
      />
      
      <ContentLayout>
        <h2>Laboratório de Ensaios Especializados</h2>
        
        <p>
          O Instituto Roy Carlson mantém um laboratório de ensaios especializados que 
          combina técnicas tradicionais desenvolvidas por Roy W. Carlson com tecnologias 
          modernas de análise e instrumentação.
        </p>

        <h3>Metodologias Inovadoras</h3>
        
        <p>
          Nossos ensaios seguem os princípios estabelecidos por Roy Carlson, que foi 
          pioneiro no desenvolvimento de instrumentos para medição interna em estruturas 
          de concreto:
        </p>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
            {testTypes.map((testType, index) => (
              <div key={testType.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <testType.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{testType.title}</h3>
                    <p className="text-gray-600 mb-4">{testType.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {testType.tests.map((test, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Instrumentação Avançada</h3>
        
        <p>
          Utilizamos instrumentos baseados nas patentes desenvolvidas por Roy Carlson, 
          adaptados com tecnologias modernas:
        </p>

        <ul>
          <li><strong>Carlson Strain Meters:</strong> Medidores de deformação para 
          monitoramento interno de estruturas</li>
          
          <li><strong>Sensores de Pressão Elétricos:</strong> Baseados na patente 
          #2,059,549 de Carlson</li>
          
          <li><strong>Medidores de Tensão:</strong> Adaptação moderna da patente 
          #2,148,013</li>
          
          <li><strong>Instrumentos para Solos:</strong> Baseados na patente 
          #3,529,468 para materiais granulares</li>
        </ul>

        <h3>Ensaios Térmicos Especializados</h3>
        
        <p>
          Uma das principais especialidades do laboratório é a análise térmica, 
          seguindo a tradição de Roy Carlson em concreto massa:
        </p>

        <ul>
          <li><strong>Calorimetria Isotérmica:</strong> Medição do calor de hidratação 
          do cimento em condições controladas</li>
          
          <li><strong>Monitoramento Térmico:</strong> Acompanhamento da evolução de 
          temperatura em corpos de prova massivos</li>
          
          <li><strong>Análise de Gradientes:</strong> Estudo da distribuição de 
          temperatura em seções transversais</li>
          
          <li><strong>Ensaios de Resfriamento:</strong> Avaliação da eficiência de 
          sistemas de refrigeração</li>
        </ul>

        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-xl">
            <h3>Desenvolvimento de Novos Ensaios</h3>
            <p>
              Seguindo o espírito inovador de Roy Carlson, continuamos desenvolvendo 
              novos métodos de ensaio:
            </p>
            
            <ul>
              <li>Ensaios acelerados de durabilidade</li>
              <li>Testes de fadiga em elementos estruturais</li>
              <li>Análise de comportamento sísmico</li>
              <li>Ensaios de aderência avançados</li>
              <li>Testes de permeabilidade especializados</li>
            </ul>
          </div>
        </AnimatedSection>

        <h3>Controle de Qualidade Laboratorial</h3>
        
        <p>
          Mantemos rigorosos padrões de qualidade em todos os ensaios, seguindo 
          normas nacionais e internacionais:
        </p>

        <ul>
          <li>Calibração regular de equipamentos</li>
          <li>Rastreabilidade de resultados</li>
          <li>Participação em programas interlaboratoriais</li>
          <li>Documentação completa de procedimentos</li>
          <li>Treinamento contínuo de técnicos</li>
        </ul>

        <h3>Aplicações dos Resultados</h3>
        
        <p>
          Os resultados dos ensaios são aplicados em:
        </p>

        <ul>
          <li>Desenvolvimento de novos materiais</li>
          <li>Otimização de dosagens de concreto</li>
          <li>Validação de modelos computacionais</li>
          <li>Controle de qualidade de obras</li>
          <li>Pesquisa e desenvolvimento técnico</li>
        </ul>

        <h3>Publicações e Pesquisa</h3>
        
        <p>
          Seguindo a tradição de Roy Carlson, que publicou 56 artigos técnicos, 
          nosso laboratório contribui ativamente para a literatura técnica:
        </p>

        <ul>
          <li>Artigos em revistas especializadas</li>
          <li>Apresentações em congressos técnicos</li>
          <li>Relatórios técnicos detalhados</li>
          <li>Manuais de procedimentos</li>
          <li>Estudos de caso documentados</li>
        </ul>
      </ContentLayout>
    </>
  )
}
