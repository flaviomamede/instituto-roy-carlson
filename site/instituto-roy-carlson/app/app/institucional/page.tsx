import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { ContentLayout } from '@/components/content-layout'
import { AnimatedSection } from '@/components/animated-section'

export default function InstitucionalPage() {
  return (
    <>
      <PageHeader
        title="Institucional"
        subtitle="A história e missão do Instituto Roy Carlson"
        backgroundImage="https://thumbs.dreamstime.com/b/engineer-s-desk-technical-drawings-laptop-engineering-tools-focused-architect-working-blueprints-327413933.jpg"
      />
      
      <ContentLayout>
        {/* Seção Roy Carlson */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2>Roy W. Carlson (1900-1990)</h2>
            <h3 className="text-xl text-gray-600 mb-6">Pioneiro Mundial em Instrumentação para Concreto</h3>
            
            <p>
              O Instituto Roy Carlson foi fundado para perpetuar e expandir o legado de 
              Roy W. Carlson (1900-1990), um dos pioneiros mundiais na instrumentação 
              para concreto e tecnologia de concreto massa.
            </p>
            
            <p>
              Roy Carlson desenvolveu instrumentos revolucionários para medição interna 
              em estruturas de concreto, incluindo medidores de tensão, deformação, 
              temperatura e pressão. Suas invenções foram fundamentais na construção 
              de grandes barragens nos Estados Unidos, Brasil e outros países.
            </p>

            <h4>Contribuições para o Brasil</h4>
            <p>
              Durante duas décadas, Roy Carlson esteve envolvido com projetos de 
              barragens no Brasil, contribuindo fundamentalmente para o desenvolvimento 
              hidrelétrico brasileiro. Seu trabalho foi crucial na resolução de 
              problemas complexos na construção da barragem de Itaipu.
            </p>

            <p>
              Em 1984, recebeu a **Ordem do Cruzeiro do Sul**, a mais alta honraria 
              do Brasil para um estrangeiro, em reconhecimento às suas contribuições 
              aos grandes desenvolvimentos hidrelétricos do país.
            </p>

            <h4>Formação de Engenheiros</h4>
            <p>
              Carlson encorajou uma geração de engenheiros brasileiros a estudar 
              tecnologia do concreto na UC Berkeley, contribuindo significativamente 
              para o desenvolvimento de capacidade técnica local no Brasil.
            </p>
          </div>

          <div className="space-y-8">
            <AnimatedSection delay={0.4}>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/roy-carlson-2.webp"
                    alt="Roy W. Carlson - Retrato oficial"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Roy W. Carlson</h4>
                <p className="text-sm text-gray-600">
                  Pioneiro em instrumentação para concreto (1900-1990)
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-3">Principais Conquistas</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• 56 artigos técnicos publicados</li>
                  <li>• Múltiplas patentes registradas</li>
                  <li>• Membro da National Academy of Engineering</li>
                  <li>• 60 anos de afiliação com UC Berkeley</li>
                  <li>• Ordem do Cruzeiro do Sul (1984)</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200 my-16"></div>

        {/* Seção Walton Pacelli de Andrade */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2>Walton Pacelli de Andrade (1940-)</h2>
              <h3 className="text-xl text-gray-600 mb-6">Especialista Brasileiro em Tecnologia do Concreto</h3>
              
              <p>
                Walton Pacelli de Andrade é uma das figuras mais respeitadas da engenharia brasileira, 
                especialista em tecnologia do concreto e fundador do Centro Tecnológico de Pesquisa 
                em Concreto de FURNAS. Sua trajetória profissional representa a evolução da engenharia 
                civil brasileira no século XX.
              </p>

              <h4>Formação e Primeiros Anos</h4>
              <p>
                Nascido em 6 de fevereiro de 1940, na zona rural de Santo Antônio do Glória, 
                município de Vieiras-MG, Pacelli foi o 15º filho de uma família de 20 irmãos. 
                Criado na fazenda dos pais até os 7 anos, iniciou seus estudos na região rural, 
                migrando progressivamente para cidades maiores conforme avançava nos estudos.
              </p>

              <p>
                Em 1958, ingressou no Curso de Engenharia em Juiz de Fora, demonstrando desde 
                cedo grande afinidade com as matérias de exatas. Em 1959, serviu ao exército 
                por 8 meses, experiência que lhe trouxe disciplina militar e respeito à hierarquia, 
                valores que aplicou ao longo de sua carreira profissional.
              </p>

              <h4>Carreira em FURNAS</h4>
              <p>
                Em 1964, recém-formado, iniciou sua carreira na construção da Usina de Funil 
                (CHEVAP), atuando no Laboratório de Concreto de campo da barragem. Este foi 
                o início de sua especialização em tecnologia do concreto, área na qual se 
                tornaria uma referência nacional e internacional.
              </p>

              <p>
                Sua dedicação aos estudos do concreto o levou a fazer estágio no Instituto de 
                Pesquisas Tecnológicas (IPT) em 1964, na área de tecnologia, ensaio de cimento 
                e agregados. Em 1966, foi designado para estágio sobre instrumentação no 
                Laboratório Nacional de Engenharia Civil (LNEC), em Portugal, com o Dr. Laginha Serafim.
              </p>

              <h4>Desenvolvimento Internacional</h4>
              <p>
                Em 1970, como parte da política de FURNAS, realizou estágio obrigatório nos 
                Estados Unidos, estudando no Bureau of Reclamation em Denver e visitando obras 
                em andamento no país. Esta experiência internacional ampliou sua visão sobre 
                as melhores práticas mundiais em engenharia de barragens.
              </p>

              <h4>Legado e Reconhecimento</h4>
              <p>
                Pacelli fundou e dirigiu o Centro Tecnológico de Pesquisa em Concreto de FURNAS, 
                que entrou em operação em 1986 em Goiânia. O centro se tornou referência 
                internacional, atendendo obras de construção e manutenção de FURNAS, prestando 
                serviços a empresas nacionais e internacionais, e focando em treinamento e 
                pesquisa de profissionais.
              </p>

              <p>
                Seu reconhecimento se estendeu globalmente, prestando consultoria em incontáveis 
                projetos pelo mundo. Em 2002, o Centro Tecnológico ganhou a medalha de ouro do 
                Programa de Qualidade do Governo Federal, reconhecimento da excelência técnica 
                e compromisso com a qualidade.
              </p>
            </div>

            <div className="space-y-8">
              <AnimatedSection delay={0.4}>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2">Walton Pacelli de Andrade</h4>
                  <p className="text-sm text-green-700 mb-4">
                    Especialista em tecnologia do concreto e fundador do Centro Tecnológico de FURNAS
                  </p>
                  <div className="text-xs text-green-600 space-y-1">
                    <p><strong>Nascimento:</strong> 6 de fevereiro de 1940</p>
                    <p><strong>Local:</strong> Vieiras-MG</p>
                    <p><strong>Formação:</strong> Engenharia Civil (1964)</p>
                    <p><strong>Aposentadoria:</strong> 2003</p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.6}>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-3">Principais Realizações</h4>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>• Fundação do Centro Tecnológico de FURNAS (1986)</li>
                    <li>• Consultoria internacional em concreto</li>
                    <li>• Medalha de Ouro - Qualidade Gov. Federal (2002)</li>
                    <li>• Especialização em concreto massa</li>
                    <li>• Formação de gerações de engenheiros</li>
                    <li>• Contribuições em Funil, Marimbondo, Itumbiara</li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline de Walton Pacelli */}
        <AnimatedSection delay={0.4}>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl mb-12">
            <h3 className="text-2xl font-bold text-green-900 mb-6">Timeline - Walton Pacelli de Andrade</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1940-1958</h4>
                <h5 className="font-medium mb-2">Formação Inicial</h5>
                <p className="text-sm text-gray-600">
                  Nascimento em Vieiras-MG, estudos rurais, migração para cidades maiores, 
                  conclusão dos estudos em Juiz de Fora.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1958-1964</h4>
                <h5 className="font-medium mb-2">Graduação e Serviço Militar</h5>
                <p className="text-sm text-gray-600">
                  Curso de Engenharia em Juiz de Fora, serviço militar (1959), 
                  formação em engenharia civil.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1964-1966</h4>
                <h5 className="font-medium mb-2">Início na Usina de Funil</h5>
                <p className="text-sm text-gray-600">
                  Trabalho no Laboratório de Concreto da CHEVAP, estágio no IPT, 
                  especialização em tecnologia do concreto.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1966-1967</h4>
                <h5 className="font-medium mb-2">Estágio Internacional</h5>
                <p className="text-sm text-gray-600">
                  Estágio em instrumentação no LNEC, Portugal, com Dr. Laginha Serafim. 
                  Transferência para FURNAS.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1970-1980</h4>
                <h5 className="font-medium mb-2">Expansão e Desenvolvimento</h5>
                <p className="text-sm text-gray-600">
                  Estágio nos EUA (Bureau of Reclamation), trabalho em Marimbondo, 
                  Angra I, Itumbiara.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">1986-2003</h4>
                <h5 className="font-medium mb-2">Centro Tecnológico</h5>
                <p className="text-sm text-gray-600">
                  Fundação e direção do Centro Tecnológico de Pesquisa em Concreto, 
                  reconhecimento internacional.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">2002</h4>
                <h5 className="font-medium mb-2">Prêmio Nacional</h5>
                <p className="text-sm text-gray-600">
                  Medalha de Ouro do Programa de Qualidade do Governo Federal, 
                  reconhecimento da excelência técnica.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">2003-Presente</h4>
                <h5 className="font-medium mb-2">Consultoria e Legado</h5>
                <p className="text-sm text-gray-600">
                  Aposentadoria de FURNAS, continuidade em consultoria internacional, 
                  preservação do legado técnico.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Missão do Instituto */}
        <AnimatedSection delay={0.8}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
            <h2>Nossa Missão</h2>
            <p>
              Continuar o legado de excelência técnica e inovação iniciado por Roy Carlson 
              e consolidado por Walton Pacelli de Andrade, desenvolvendo pesquisas avançadas 
              em engenharia de concreto, simulação computacional e ensaios especializados.
            </p>
            
            <p>
              Nosso instituto se dedica a:
            </p>
            
            <ul>
              <li>Pesquisa e desenvolvimento em tecnologia do concreto</li>
              <li>Simulações termomecânicas avançadas</li>
              <li>Ensaios especiais e inovadores</li>
              <li>Consultoria técnica especializada</li>
              <li>Formação e capacitação de engenheiros</li>
              <li>Preservação e disseminação do conhecimento técnico</li>
              <li>Continuidade do legado brasileiro em engenharia de concreto</li>
            </ul>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 italic">
                "A gente não pode perder o orgulho de ser funcionário de Furnas, de ser ex-funcionário 
                de Furnas. [...] É uma empresa que você doa seu sangue para o bem das obras."
              </p>
              <p className="text-xs text-gray-500 mt-2">- Walton Pacelli de Andrade, 2021</p>
            </div>
          </div>
        </AnimatedSection>
      </ContentLayout>
    </>
  )
}
