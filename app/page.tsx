import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>WordPress Template News — V2 Headless</p>

        <h1>Headless Template WP</h1>

        <p>
          inicio do projeto de headless do WordPress Template News, utilizando
          Next.js 13, React 18, TypeScript e SASS
        </p>
      </div>
    </main>
  );
}
