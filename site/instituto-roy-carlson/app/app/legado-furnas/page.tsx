
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { Zap, Cog, Award, Users } from 'lucide-react'

export default function LegadoFurnasPage() {
  const highlights = [
    {
      icon: Zap,
      title: 'Desenvolvimento Hidrelétrico',
      description: 'Contribuições fundamentais para a matriz energética brasileira'
    },
    {
      icon: Cog,
      title: 'Inovação Tecnológica',
      description: 'Pioneirismo em técnicas de construção e materiais'
    },
    {
      icon: Award,
      title: 'Excelência Técnica',
      description: 'Padrões de qualidade reconhecidos mundialmente'
    },
    {
      icon: Users,
      title: 'Formação de Especialistas',
      description: 'Capacitação de gerações de engenheiros brasileiros'
    }
  ]

  return (
    <>
      <PageHeader
        title="Legado Furnas"
        subtitle="O legado técnico do laboratório de concreto de Furnas"
        backgroundImage="https://thumbs.dreamstime.com/b/old-dam-flowing-water-river-hydroelectric-power-station-hydro-energy-221168353.jpg"
      />
      
      <ContentLayout>
        <h2>O Laboratório de Concreto de Furnas</h2>
        
        <p>
          O laboratório de concreto de Furnas representou um marco na engenharia brasileira, 
          estabelecendo padrões de excelência que influenciaram toda a indústria nacional 
          de construção de barragens e usinas hidrelétricas.
        </p>

        <h3>Contribuições Técnicas Fundamentais</h3>
        
        <p>
          Sob a influência das técnicas desenvolvidas por Roy Carlson, o laboratório de Furnas 
          desenvolveu metodologias avançadas para:
        </p>

        <ul>
          <li>Controle de qualidade do concreto massa</li>
          <li>Instrumentação de grandes estruturas</li>
          <li>Análise térmica e controle de fissuração</li>
          <li>Desenvolvimento de cimentos especiais</li>
          <li>Técnicas de resfriamento artificial</li>
          <li>Monitoramento estrutural contínuo</li>
        </ul>

        <AnimatedSection delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {highlights.map((item, index) => (
              <div key={item.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Impacto no Desenvolvimento Nacional</h3>
        
        <p>
          O trabalho desenvolvido em Furnas foi fundamental para o sucesso de grandes 
          projetos hidrelétricos brasileiros, incluindo:
        </p>

        <ul>
          <li>Usina Hidrelétrica de Furnas</li>
          <li>Complexo de Itaipu</li>
          <li>Usinas do Rio Grande</li>
          <li>Projetos da Amazônia</li>
        </ul>

        <h3>Metodologias Pioneiras</h3>
        
        <p>
          As técnicas desenvolvidas no laboratório incluíram:
        </p>

        <ul>
          <li><strong>Concreto Massa Refrigerado:</strong> Desenvolvimento de técnicas de resfriamento 
          para controle da elevação de temperatura em grandes concretagens</li>
          
          <li><strong>Instrumentação Avançada:</strong> Implementação de sistemas de monitoramento 
          contínuo baseados nos instrumentos desenvolvidos por Carlson</li>
          
          <li><strong>Controle de Fissuração:</strong> Metodologias para prevenção e controle 
          de fissuras em estruturas de concreto massa</li>
          
          <li><strong>Cimentos Especiais:</strong> Desenvolvimento de formulações específicas 
          para diferentes condições de obra</li>
        </ul>

        <AnimatedSection delay={0.6}>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl">
            <h3>Continuidade do Legado</h3>
            <p>
              O Instituto Roy Carlson preserva e expande esse conhecimento, aplicando 
              as lições aprendidas em Furnas a novos desafios da engenharia moderna. 
              Continuamos a tradição de excelência técnica, incorporando tecnologias 
              contemporâneas como simulação computacional avançada e análise numérica.
            </p>
            
            <p>
              Nossa missão é honrar este legado, mantendo viva a tradição de inovação 
              e qualidade que caracterizou o trabalho pioneiro de Roy Carlson e da 
              equipe de Furnas.
            </p>
          </div>
        </AnimatedSection>
      </ContentLayout>
    </>
  )
}
