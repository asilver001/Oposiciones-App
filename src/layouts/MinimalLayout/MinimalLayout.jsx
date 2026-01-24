import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MinimalLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <Outlet />
      </div>
    </div>
  );
}
