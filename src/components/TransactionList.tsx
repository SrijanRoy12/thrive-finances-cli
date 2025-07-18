import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Transaction } from "./Dashboard";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList = ({ transactions, onDeleteTransaction }: TransactionListProps) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="bg-gradient-card shadow-elevated border-0 hover-lift">
      <CardHeader className="animate-slide-in-top">
        <CardTitle className="flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
          💳 Recent Transactions
          <Badge variant="secondary" className="animate-bounce">{transactions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground animate-bounce-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm">Add your first transaction to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-300 hover-lift border border-border/20 animate-slide-in-left ${
                  index < 6 ? `stagger-${index + 1}` : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full hover-scale transition-all duration-300 ${
                    transaction.type === 'income' 
                      ? 'bg-income/20 text-income animate-pulse-glow' 
                      : 'bg-expense/20 text-expense animate-pulse-glow'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 animate-float" />
                    ) : (
                      <TrendingDown className="w-5 h-5 animate-float" />
                    )}
                  </div>
                  <div className="animate-fade-in animation-delay-200">
                    <p className="font-semibold text-lg">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-muted/50 text-xs font-medium">
                        {transaction.category}
                      </span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 animate-fade-in animation-delay-300">
                  <span className={`font-bold text-xl ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  } animate-counter-up`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-muted-foreground hover:text-destructive hover-scale"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};