import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "./Dashboard";

interface BudgetOverviewProps {
  budgets: Budget[];
}

export const BudgetOverview = ({ budgets }: BudgetOverviewProps) => {
  return (
    <Card className="bg-gradient-card shadow-elevated border-0">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = budget.spent > budget.limit;
            
            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category}</span>
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-expense' : 'text-muted-foreground'
                  }`}>
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                {isOverBudget && (
                  <p className="text-xs text-expense">
                    Over budget by ${(budget.spent - budget.limit).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No budgets set up yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};