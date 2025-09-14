import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-4">
              The page you are looking for does not exist.
            </p>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go back home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
