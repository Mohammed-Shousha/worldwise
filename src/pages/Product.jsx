import PageNav from '../components/PageNav';

import styles from './Product.module.css';

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />

      <section>
        <img
          src="img.jpg"
          alt="person with dog overlooking mountain with sunset"
        />
        <div>
          <h2>About WorldWide.</h2>
          <p>
            WorldWise is a web appliaction that allows users to track thier
            travels and adventures, share them with friends and family, and
            discover new places to explore.
          </p>
          <p>Try it out by creating an account and adding your first trip!</p>
        </div>
      </section>
    </main>
  );
}
