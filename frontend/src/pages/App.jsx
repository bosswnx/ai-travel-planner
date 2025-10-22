import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import DashboardPage from './DashboardPage.jsx';
import PlansPage from './PlansPage.jsx';
import ExpensesPage from './ExpensesPage.jsx';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`;

const App = () => {
  const [userId, setUserId] = useState('guest');

  useEffect(() => {
    const stored = localStorage.getItem('travel-user-id');
    if (stored) {
      setUserId(stored);
    }
  }, []);

  const context = useMemo(() => ({ userId, setUserId }), [userId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">AI 智能旅行助手</h1>
            <p className="mt-1 text-sm text-slate-300">
              通过语音与文字输入，快速生成行程、预算与消费管理。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="userId" className="text-xs uppercase tracking-wide text-slate-400">
              用户 ID
            </label>
            <input
              id="userId"
              value={userId}
              onChange={(event) => {
                const value = event.target.value.trim();
                setUserId(value);
                localStorage.setItem('travel-user-id', value);
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 px-6 pb-4">
          <NavLink to="/" className={navLinkClass} end>
            智能行程
          </NavLink>
          <NavLink to="/plans" className={navLinkClass}>
            行程记录
          </NavLink>
          <NavLink to="/expenses" className={navLinkClass}>
            费用管理
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<DashboardPage context={context} />} />
          <Route path="/plans" element={<PlansPage context={context} />} />
          <Route path="/expenses" element={<ExpensesPage context={context} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
