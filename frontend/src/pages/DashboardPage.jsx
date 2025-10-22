import { useState } from 'react';
import { createPlan, analyzeBudget } from '../services/api.js';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
import MarkdownPreview from '../components/MarkdownPreview.jsx';
import DestinationMap from '../components/DestinationMap.jsx';
import { appConfig } from '../config.js';

const defaultForm = {
  destination: '',
  startDate: '',
  days: 5,
  budget: 10000,
  travelers: 2,
  preferences: '美食, 家庭友好',
  notes: '',
};

const DashboardPage = ({ context }) => {
  const { userId } = context;
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState('');
  const [budgetSummary, setBudgetSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const { listen, listening, supported } = useSpeechRecognition();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const payload = { ...form, userId };
      const response = await createPlan(payload);
      setResult(response.itinerary);
    } catch (error) {
      setResult(`生成失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBudget = async () => {
    setBudgetLoading(true);
    setBudgetSummary('');
    try {
      const payload = {
        userId,
        budget: form.budget,
        expenses: [
          { category: '交通', amount: Math.round(form.budget * 0.25) },
          { category: '住宿', amount: Math.round(form.budget * 0.35) },
        ],
      };
      const response = await analyzeBudget(payload);
      setBudgetSummary(response.summary);
    } catch (error) {
      setBudgetSummary(`预算分析失败：${error.message}`);
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleVoice = () => {
    listen({
      onResult: (text) => {
        setForm((prev) => ({ ...prev, notes: `${prev.notes}\n${text}`.trim() }));
      },
      onError: (error) => {
        alert(`语音识别失败：${error}`);
      },
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-emerald-500/5">
        <h2 className="text-2xl font-semibold text-emerald-300">行程需求</h2>
        <p className="mt-2 text-sm text-slate-300">填写旅行目标，或通过语音输入补充细节。</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">目的地</span>
              <input
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
                placeholder="日本 东京"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">出发日期</span>
              <input
                type="date"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">旅行天数</span>
              <input
                type="number"
                min="1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.days}
                onChange={(event) => setForm({ ...form, days: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">预算（元）</span>
              <input
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.budget}
                onChange={(event) => setForm({ ...form, budget: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">同行人数</span>
              <input
                type="number"
                min="1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.travelers}
                onChange={(event) => setForm({ ...form, travelers: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">偏好</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
                value={form.preferences}
                onChange={(event) => setForm({ ...form, preferences: event.target.value })}
                placeholder="美食, 动漫, 亲子"
              />
            </label>
          </div>
          <label className="block space-y-2 text-sm">
            <span className="text-slate-400">备注 & 语音补充</span>
            <textarea
              rows="4"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-400 focus:outline-none"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="孩子 6 岁，想安排一次主题乐园体验"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? '生成中...' : '生成智能行程'}
            </button>
            <button
              type="button"
              onClick={handleBudget}
              disabled={budgetLoading}
              className="rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {budgetLoading ? '预算分析中...' : '预算分析'}
            </button>
            <button
              type="button"
              onClick={handleVoice}
              disabled={!supported || listening}
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {supported ? (listening ? '正在聆听...' : '语音输入') : '浏览器不支持语音'}
            </button>
          </div>
        </form>
        <div>
          <h3 className="text-lg font-semibold text-emerald-200">目的地地图</h3>
          <p className="mt-1 text-xs text-slate-400">
            {appConfig.amapKey ? '地图将根据目的地自动定位。' : '在配置文件中补充地图 Key 后可实时预览目的地位置。'}
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl">
            <DestinationMap destination={form.destination} />
          </div>
        </div>
      </section>
      <section className="space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold text-emerald-300">行程结果</h3>
          <p className="mt-1 text-xs text-slate-400">行程以 Markdown 格式呈现，可直接复制至文档或分享。</p>
          <div className="mt-4 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <MarkdownPreview content={result} placeholder="生成的行程会显示在这里" />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold text-emerald-300">预算分析</h3>
          <div className="mt-4 max-h-[240px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <MarkdownPreview content={budgetSummary} placeholder="预算分析结果会显示在这里" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
