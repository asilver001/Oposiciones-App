/**
 * PageLoader — Editorial Calm loading state with gradient pulse
 * Used for full-screen route transitions and async guards.
 */
export default function PageLoader({ message = 'Cargando...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF7] dark:bg-gray-950 p-6">
      <div
        className="w-14 h-14 rounded-full mb-4 animate-pulse"
        style={{
          background:
            'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)',
          boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
        }}
        aria-hidden="true"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium" role="status">
        {message}
      </p>
    </div>
  );
}
