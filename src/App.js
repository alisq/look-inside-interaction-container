import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [activeUrl, setActiveUrl] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.PUBLIC_URL}/menu.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Menu failed to load');
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        setItems(data);
        if (data.length > 0) {
          setActiveUrl(data[0].url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeItem = items.find((item) => item.url === activeUrl);

  return (
    <div className="app">
      <nav
        id="site-menu"
        className={menuOpen ? 'menu is-open' : 'menu'}
        aria-label="Sites"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <ul>
          {items.map((item) => (
            <li key={item.url}>
              <button
                type="button"
                className={
                  item.url === activeUrl ? 'menu-item is-active' : 'menu-item'
                }
                aria-current={item.url === activeUrl ? 'page' : undefined}
                onClick={() => {
                  setActiveUrl(item.url);
                  setMenuOpen(false);
                }}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {activeUrl && (
        <iframe
          className="frame"
          title={activeItem ? activeItem.title : 'Site'}
          src={activeUrl}
        />
      )}
      <button
        type="button"
        className={menuOpen ? 'logo-toggle is-open' : 'logo-toggle'}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <img
          className="logo-mark"
          src={`${process.env.PUBLIC_URL}/logo.svg`}
          alt=""
        />
      </button>
    </div>
  );
}

export default App;
