import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Gallery from './Gallery'
import { Link } from 'react-router-dom'
import backgroundD from '../assets/img/fondo-1000-600.png';

const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

export default function FeatureSection() {
  return (
    <>

      <div className="pt-24 px-6  text-left" 
            style={{
              backgroundImage: `url(${backgroundD})`,
              backgroundSize: 'cover',
              backgroundPosition: 'unset',
              minHeight: '100vh',
            }}
      >
        <h1 className=" font-bold titulo-principal leading-tight mb-4 text-[#EF2B2D]">
          Imanes <span className="text-[#F8D541]">únicos</span><br></br> <span className='text-[#0A4FA0]'>para </span> <span className="text-[#34C6F3]">momentos</span><br></br><span className='text-[#0A4FA0]'>inolvidables</span>
        </h1>
        <p className="text-lg description-principal mb-4 text-[#0A4FA0]">
          Convertí tus fotos favoritas en imanes personalizados.<br></br> Perfectos para regalar o decorar tu heladera.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/product"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition"
          >
            📤 Subí tu foto
          </Link>
          <Link to="/ejemplos"
            href="#galeria"
            className="bg-white text-red-600 hover:bg-red-100 px-6 py-3 rounded-md font-semibold shadow-md transition"
          >
            🔍 Ver ejemplos
          </Link>
        </div>
      </div>
    </>
  )
}
