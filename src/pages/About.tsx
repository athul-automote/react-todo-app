const stack = [
  { name: 'React 19', description: 'UI library with hooks' },
  { name: 'TypeScript', description: 'Static type safety' },
  { name: 'Vite', description: 'Fast build tool & dev server' },
  { name: 'Tailwind CSS v4', description: 'Utility-first styling' },
  { name: 'React Router v7', description: 'Client-side routing' },
  { name: 'Zustand', description: 'Lightweight state management' },
  { name: 'Axios', description: 'HTTP client with interceptors' },
];

export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">About TaskMaster</h1>
      <p className="text-sm text-gray-500 mb-6">
        A modern React todo app built with a production-ready stack.
      </p>
      <ul className="flex flex-col gap-3">
        {stack.map(({ name, description }) => (
          <li
            key={name}
            className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <span className="font-medium text-indigo-700 text-sm w-36 shrink-0">{name}</span>
            <span className="text-gray-600 text-sm">{description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
