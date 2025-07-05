
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'
import { GraduationCap, Building, Globe, Users } from 'lucide-react'

export default function ParceriasPage() {
  const partnerships = [
    {
      icon: GraduationCap,
      title: 'Universidades Nacionais',
      description: 'Colaborações com as principais universidades brasileiras',
      partners: [
        'Universidade de São Paulo (USP)',
        'Universidade Federal do Rio de Janeiro (UFRJ)',
        'Universidade Federal de Minas Gerais (UFMG)',
        'Universidade de Brasília (UnB)'
      ]
    },
    {
      icon: Globe,
      title: 'Instituições Internacionais',
      description: 'Parcerias com universidades e centros de pesquisa mundiais',
      partners: [
        'University of California, Berkeley',
        'Massachusetts Institute of Technology (MIT)',
        'Delft University of Technology',
        'École Polytechnique Fédérale de Lausanne'
      ]
    },
    {
      icon: Building,
      title: 'Centros de Pesquisa',
      description: 'Colaboração com institutos de pesquisa especializados',
      partners: [
        'Instituto de Pesquisas Tecnológicas (IPT)',
        'Centro de Pesquisas de Energia Elétrica (CEPEL)',
        'Laboratório Nacional de Engenharia Civil (Portugal)',
        'Building Research Institute (Japão)'
      ]
    },
    {
      icon: Users,
      title: 'Organizações Profissionais',
      description: 'Participação ativa em associações técnicas',
      partners: [
        'Instituto Brasileiro do Concreto (IBRACON)',
        'American Concrete Institute (ACI)',
        'International Association for Bridge Engineering',
        'Comitê Brasileiro de Barragens (CBDB)'
      ]
    }
  ]

  const programs = [
    {
      title: 'Intercâmbio de Pesquisadores',
      description: 'Programa de intercâmbio seguindo a tradição de Roy Carlson, que encorajou engenheiros brasileiros a estudar na UC Berkeley.'
    },
    {
      title: 'Projetos Colaborativos',
      description: 'Desenvolvimento conjunto de pesquisas em tecnologia do concreto e simulação computacional.'
    },
    {
      title: 'Bolsas de Estudo',
      description: 'Apoio financeiro para estudantes de pós-graduação em áreas relacionadas à engenharia de concreto.'
    },
    {
      title: 'Congressos e Simpósios',
      description: 'Organização de eventos técnicos para disseminação do conhecimento especializado.'
    }
  ]

  return (
    <>
      <PageHeader
        title="Parcerias Acadêmicas"
        subtitle="Colaborações com universidades e centros de pesquisa nacionais e internacionais"
        backgroundImage="https://i.ytimg.com/vi/uLIivBjL-ak/maxresdefault.jpg"
      />
      
      <ContentLayout>
        <h2>Rede de Colaboração Internacional</h2>
        
        <p>
          O Instituto Roy Carlson mantém uma extensa rede de parcerias acadêmicas e 
          técnicas, seguindo a tradição de colaboração internacional estabelecida 
          por Roy W. Carlson, que durante décadas manteve vínculos com instituições 
          de ensino e pesquisa no Brasil e no mundo.
        </p>

        <h3>Legado de Colaboração</h3>
        
        <p>
          Roy Carlson foi fundamental na formação de uma geração de engenheiros brasileiros, 
          encorajando-os a estudar tecnologia do concreto na University of California, Berkeley. 
          Esta tradição de intercâmbio e colaboração continua sendo um pilar fundamental 
          de nossas atividades.
        </p>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
            {partnerships.map((partnership, index) => (
              <div key={partnership.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-teal-100 p-4 rounded-lg">
                    <partnership.icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{partnership.title}</h3>
                    <p className="text-gray-600 mb-4">{partnership.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {partnership.partners.map((partner, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">{partner}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Programas de Colaboração</h3>
        
        <p>
          Desenvolvemos diversos programas que promovem a troca de conhecimento e 
          o avanço da pesquisa em engenharia de concreto:
        </p>

        <AnimatedSection delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {programs.map((program, index) => (
              <div key={program.title} className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">{program.title}</h4>
                <p className="text-gray-700">{program.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <h3>Projetos Internacionais em Andamento</h3>
        
        <ul>
          <li><strong>Concreto Sustentável:</strong> Desenvolvimento de formulações 
          com menor impacto ambiental em colaboração com universidades europeias</li>
          
          <li><strong>Instrumentação Avançada:</strong> Modernização das técnicas 
          de instrumentação de Roy Carlson usando tecnologias digitais</li>
          
          <li><strong>Simulação Multi-escala:</strong> Desenvolvimento de modelos 
          computacionais que integram comportamento molecular e estrutural</li>
          
          <li><strong>Monitoramento Inteligente:</strong> Sistemas de IoT para 
          monitoramento contínuo de estruturas de concreto</li>
        </ul>

        <AnimatedSection delay={0.8}>
          <div className="bg-gradient-to-r from-teal-50 to-green-50 p-8 rounded-xl">
            <h3>Impacto das Parcerias</h3>
            <p>
              Nossas colaborações resultam em benefícios concretos para a engenharia brasileira:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-gray-600">Pesquisadores Colaboradores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">15+</div>
                <div className="text-gray-600">Projetos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">100+</div>
                <div className="text-gray-600">Publicações Conjuntas</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <h3>Oportunidades para Novos Parceiros</h3>
        
        <p>
          Estamos sempre abertos a novas colaborações que possam avançar o 
          conhecimento em engenharia de concreto:
        </p>

        <ul>
          <li>Universidades com programas de pós-graduação em engenharia civil</li>
          <li>Centros de pesquisa especializados em materiais de construção</li>
          <li>Empresas de tecnologia interessadas em inovação</li>
          <li>Organizações internacionais de normalização técnica</li>
        </ul>

        <AnimatedSection delay={1.0}>
          <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Interessado em Colaborar?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Se sua instituição tem interesse em desenvolver parcerias na área de 
              engenharia de concreto, entre em contato conosco para discutir 
              oportunidades de colaboração.
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Propor Parceria
            </button>
          </div>
        </AnimatedSection>
      </ContentLayout>
    </>
  )
}
