
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Instituto Roy Carlson</h3>
            <p className="text-gray-300 mb-4">
              Avançando a fronteira da engenharia de concreto com inovação e pesquisa, 
              honrando o legado de Roy W. Carlson e do laboratório de concreto de Furnas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">O Instituto</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/institucional" className="hover:text-white transition-colors">Institucional</Link></li>
              <li><Link href="/legado-furnas" className="hover:text-white transition-colors">Legado Furnas</Link></li>
              <li><Link href="/parcerias" className="hover:text-white transition-colors">Parcerias</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Áreas de Atuação</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/simulacao" className="hover:text-white transition-colors">Simulação</Link></li>
              <li><Link href="/estudos-caso" className="hover:text-white transition-colors">Estudos de Caso</Link></li>
              <li><Link href="/ensaios" className="hover:text-white transition-colors">Ensaios</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Instituto Roy Carlson. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
