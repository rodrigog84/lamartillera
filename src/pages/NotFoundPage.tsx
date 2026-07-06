import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-8xl font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Página no encontrada</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          La página que buscas no existe o fue eliminada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Ir al inicio</Link>
          <Link to="/subastas" className="btn-outline">Ver subastas</Link>
        </div>
      </div>
    </div>
  );
}
