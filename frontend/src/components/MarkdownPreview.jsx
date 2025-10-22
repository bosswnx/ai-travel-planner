import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownPreview = ({ content, placeholder }) => {
  if (!content) {
    return <p className="text-sm text-slate-400">{placeholder}</p>;
  }

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
