import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "./Dashboard";

interface BudgetOverviewProps {
  budgets: Budget[];
}

export const BudgetOverview = ({ budgets }: BudgetOverviewProps) => {
  return (
    <Card className="bg-gradient-card shadow-elevated border-0 hover-lift">
      <CardHeader className="animate-slide-in-top">
        <CardTitle className="flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
          🎯 Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = budget.spent > budget.limit;
            
            return (
              <div key={budget.category} className={`space-y-3 p-4 rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-300 hover-lift animate-slide-in-left ${
                index < 6 ? `stagger-${index + 1}` : ''
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg animate-fade-in">{budget.category}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    isOverBudget ? 'text-expense bg-expense/10 animate-shake' : 'text-muted-foreground bg-muted/20'
                  } animate-counter-up animation-delay-200`}>
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-3 progress-animated ${isOverBudget ? 'animate-pulse' : ''}`}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${isOverBudget ? 'text-expense animate-pulse' : 'text-success'}`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  {isOverBudget && (
                    <span className="text-expense font-bold animate-bounce bg-expense/10 px-2 py-1 rounded-full">
                      ⚠️ Over by ${(budget.spent - budget.limit).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <div className="text-center py-12 text-muted-foreground animate-bounce-in">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-lg font-medium">No budgets set up yet</p>
              <p className="text-sm">Create budgets to track your spending!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};