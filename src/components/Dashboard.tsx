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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your income, expenses, and budgets
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowTransactionForm(true)}
              variant="gradient"
              size="lg"
              className="shadow-glow"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              size="lg"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-elevated border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-income" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                ${totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                ${totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-income' : 'text-expense'}`}>
                ${netSavings.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elevated border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {transactions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Budget Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart transactions={transactions} />
          <BudgetOverview budgets={budgets} />
        </div>

        {/* Recent Transactions */}
        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={deleteTransaction}
        />

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