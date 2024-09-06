import styles from './PageNotFound.module.css';

import { NavLink } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className={styles.notfound}>
      <h1>404 - Page Not Found </h1>
      <p>Sorry, the page you are looking for does not exist.</p>

      <NavLink to="/" className="cta">
        Go Home
      </NavLink>
    </div>
  );
}
