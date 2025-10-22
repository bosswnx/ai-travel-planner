import { useEffect, useState } from 'react';
import MarkdownPreview from '../components/MarkdownPreview.jsx';
import { fetchPlans } from '../services/api.js';

const PlansPage = ({ context }) => {
  const { userId } = context;
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchPlans(userId);
        setPlans(response.plans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      load();
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-emerald-300">历史行程</h2>
        <p className="mt-2 text-sm text-slate-300">所有生成的行程会自动保存，可随时查看与复制。</p>
      </header>
      {loading && <p className="text-sm text-slate-400">加载中...</p>}
      {error && <p className="text-sm text-rose-400">加载失败：{error}</p>}
      <div className="space-y-4">
        {plans.length === 0 && !loading ? (
          <p className="text-sm text-slate-400">暂无行程记录。</p>
        ) : (
          plans.map((plan) => (
            <article key={plan.id} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-emerald-200">{plan.plan?.request?.destination || '行程'}</h3>
              <p className="mt-1 text-xs text-slate-400">
                出发日期：{plan.plan?.request?.startDate || '未知'} | 天数：{plan.plan?.request?.days || '-'} | 预算：{plan.plan?.request?.budget || '-'} 元
              </p>
              <div className="mt-4 max-h-[320px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <MarkdownPreview content={plan.plan?.itinerary || ''} placeholder="暂无内容" />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default PlansPage;
