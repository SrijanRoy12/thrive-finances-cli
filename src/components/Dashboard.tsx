import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Target, LogOut } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { BudgetOverview } from "./BudgetOverview";
import { MonthlyChart } from "./MonthlyChart";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "Food", limit: 500, spent: 0 },
    { category: "Transport", limit: 200, spent: 0 },
    { category: "Entertainment", limit: 150, spent: 0 },
    { category: "Utilities", limit: 300, spent: 0 },
  ]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedTransactions = localStorage.getItem(`finance-transactions-${user.id}`);
      const savedBudgets = localStorage.getItem(`finance-budgets-${user.id}`);
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      }
    }
  }, [user?.id]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`finance-transactions-${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`finance-budgets-${user.id}`, JSON.stringify(budgets));
    }
  }, [budgets, user?.id]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  // Update budget spent amounts
  useEffect(() => {
    const updatedBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
    setBudgets(updatedBudgets);
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowTransactionForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-in-top">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg animate-fade-in animation-delay-200">
              Track your income, expenses, and budgets with style
            </p>
          </div>
          <div className="flex gap-3 animate-slide-in-left animation-delay-300">
            <Button 
              onClick={() => setShowTransactionForm(true)}
              variant="gradient"
              size="lg"
              className="shadow-glow hover-lift btn-magnetic animate-bounce-in animation-delay-400"
            >
              <Plus className="w-5 h-5 animate-pulse" />
              Add Transaction
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              size="lg"
              className="hover-scale animate-bounce-in animation-delay-500"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-elevated border-0 hover-lift hover-glow animate-bounce-in stagger-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-income animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-income animate-counter-up">
                ${totalIncome.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 animate-fade-in animation-delay-200">
                All time earnings
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0 hover-lift hover-glow animate-bounce-in stagger-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-expense animate-float animation-delay-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-expense animate-counter-up animation-delay-100">
                ${totalExpenses.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 animate-fade-in animation-delay-300">
                All time spending
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0 hover-lift hover-glow animate-bounce-in stagger-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary animate-float animation-delay-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold animate-counter-up animation-delay-200 ${netSavings >= 0 ? 'text-income' : 'text-expense'}`}>
                ${netSavings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 animate-fade-in animation-delay-400">
                {netSavings >= 0 ? 'Great savings!' : 'Budget deficit'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0 hover-lift hover-glow animate-bounce-in stagger-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Target className="h-4 w-4 text-primary animate-float animation-delay-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground animate-counter-up animation-delay-300">
                {transactions.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1 animate-fade-in animation-delay-500">
                Total recorded
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Budget Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-slide-in-left animation-delay-600">
            <MonthlyChart transactions={transactions} />
          </div>
          <div className="animate-slide-in-left animation-delay-700">
            <BudgetOverview budgets={budgets} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="animate-slide-in-bottom animation-delay-800">
          <TransactionList 
            transactions={transactions} 
            onDeleteTransaction={deleteTransaction}
          />
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </div>
    </div>
  );
};