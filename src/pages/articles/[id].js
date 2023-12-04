import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';

// This function only runs at build time in production
// For development, it will be called on each request
export async function getStaticProps({ params }) {
  // Read the JSON file corresponding to the article ID
  const filePath = path.join(process.cwd(), 'public', 'api', 'articles', `${params.id}.json`);
  const jsonData = fs.readFileSync(filePath);
  const article = JSON.parse(jsonData);

  return {
    props: {
      article,
    },
  };
}

// You should also use getStaticPaths to specify which paths will be pre-rendered
export async function getStaticPaths() {
  // You'd get the list of article IDs here
  // For now, we'll just use an empty array
  return {
    paths: [],
    fallback: 'blocking', // or true or false
  };
}

const ArticlePage = ({ article }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{article.title}</title>
      </Head>
      <article>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        {/* Render additional article details */}
      </article>
    </div>
  );
};

export default ArticlePage;
