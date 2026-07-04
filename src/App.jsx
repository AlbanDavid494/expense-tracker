import { useState, useEffect } from 'react';

export default function App() {
  // State Initialization with LocalStorage Persistence
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // Sync state to local storage automatically
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Financial Computations
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = income - expenses;

  // Add Action Handler
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid description and amount.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text: text.trim(),
      amount: parseFloat(amount),
      type: type,
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  // Delete Action Handler
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        
        {/* Header Title */}
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">Expenditure Tracker</h1>

        {/* Dynamic Balance Display Dashboard */}
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white mb-6 shadow-md">
          <p className="text-sm opacity-80 uppercase tracking-wider font-medium">Your Balance</p>
          <h2 className="text-3xl font-extrabold mt-1">
            ₦{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Cash Flow Summary Analytics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Income</span>
            <p className="text-xl font-bold text-emerald-700 mt-1">₦{income.toFixed(2)}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Expenses</span>
            <p className="text-xl font-bold text-rose-700 mt-1">₦{expenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Interactive Interactive Form Component */}
        <form onSubmit={handleAddTransaction} className="space-y-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 border-b pb-2 border-slate-200">Add New Transaction</h3>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g., Grocery Shopping"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Amount (₦)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Flow Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition colors duration-200 shadow-sm"
          >
            Record Transaction
          </button>
        </form>

        {/* Dynamic History Output List */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 tracking-wide">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No recent entries recorded.
            </p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className={`flex justify-between items-center p-3 text-sm rounded-lg border bg-white shadow-sm transition-all group ${
                    t.type === 'income' ? 'border-l-4 border-l-emerald-500 border-slate-200' : 'border-l-4 border-l-rose-500 border-slate-200'
                  }`}
                >
                  <span className="font-medium text-slate-700 capitalize">{t.text}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}₦{t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
