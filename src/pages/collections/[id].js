import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CollectionArticle = () => {
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/articles/${id}.json`)
        .then(response => response.json())
        .then(data => setArticle(data))
        .catch(error => console.error('Error fetching article:', error));
    }
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      {/* Add more article details as needed */}
    </div>
  );
};

export default CollectionArticle;
