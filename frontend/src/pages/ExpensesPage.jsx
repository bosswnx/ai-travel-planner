import { useEffect, useState } from 'react';
import { analyzeBudget, createExpense, fetchExpenses } from '../services/api.js';
import MarkdownPreview from '../components/MarkdownPreview.jsx';

const ExpensesPage = ({ context }) => {
  const { userId } = context;
  const [form, setForm] = useState({
    category: '交通',
    amount: 0,
    notes: '',
  });
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchExpenses(userId);
      setEntries(response.expenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadExpenses();
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, amount: Number(form.amount), userId };
      const response = await createExpense(payload);
      setEntries((prev) => [response.saved, ...prev]);
      setForm({ category: '交通', amount: 0, notes: '' });
    } catch (err) {
      alert(`记录失败：${err.message}`);
    }
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    setSummary('');
    try {
      const total = entries.reduce(
        (runningTotal, entry) => runningTotal + Number(entry.expense?.amount || 0),
        0,
      );
      const response = await analyzeBudget({
        userId,
        expenses: entries.map((entry) => entry.expense),
        budget: total,
      });
      setSummary(response.summary);
    } catch (err) {
      setSummary(`分析失败：${err.message}`);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-emerald-300">费用记录</h2>
          <p className="mt-2 text-sm text-slate-300">支持语音配合主页面快速记录开销。</p>
        </header>
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">类别</span>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                <option>交通</option>
                <option>住宿</option>
                <option>餐饮</option>
                <option>门票</option>
                <option>购物</option>
                <option>其他</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">金额</span>
              <input
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
              />
            </label>
          </div>
          <label className="block space-y-2 text-sm">
            <span className="text-slate-400">备注</span>
            <textarea
              rows="3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="带孩子在主题乐园购买纪念品"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
          >
            保存记录
          </button>
        </form>
        {loading ? (
          <p className="text-sm text-slate-400">加载中...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">加载失败：{error}</p>
        ) : (
          <div className="space-y-4">
            {entries.length === 0 ? (
              <p className="text-sm text-slate-400">暂无费用记录。</p>
            ) : (
              entries.map((entry) => (
                <article key={entry.id} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-200">{entry.expense?.category}</h3>
                      <p className="text-xs text-slate-400">{entry.expense?.notes || '无备注'}</p>
                    </div>
                    <span className="text-xl font-bold text-emerald-300">¥{entry.expense?.amount}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
      <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-emerald-300">预算洞察</h3>
          <button
            type="button"
            onClick={handleSummary}
            disabled={summaryLoading}
            className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-60"
          >
            {summaryLoading ? '分析中...' : '生成分析'}
          </button>
        </div>
        <div className="mt-4 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <MarkdownPreview content={summary} placeholder="点击生成分析获取建议" />
        </div>
      </section>
    </div>
  );
};

export default ExpensesPage;
