import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import type { LinksFunction } from "react-router";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Outfit', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
          }
          a {
            text-decoration: none;
          }
        `}</style>
      </head>
      <body>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '1.5rem 0',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <Link to="/" style={{ 
              fontSize: '1.875rem', 
              fontWeight: 700, 
              color: '#dc2626',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              Pokédex
            </Link>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/" style={{ 
                color: '#64748b', 
                fontWeight: 500,
                textDecoration: 'none'
              }}>
                Home
              </Link>
            </nav>
          </header>
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <footer style={{ 
            textAlign: 'center', 
            padding: '2rem 0',
            color: '#94a3b8',
            fontSize: '0.875rem',
            borderTop: '1px solid #e2e8f0',
            marginTop: '3rem'
          }}>
            <p>Powered by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>PokéAPI</a></p>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          fontFamily: 'Outfit, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Link to="/" style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            borderRadius: '0.5rem',
            fontWeight: 500,
            textDecoration: 'none'
          }}>
            Back to Home
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
