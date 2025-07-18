import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "./Dashboard";

interface MonthlyChartProps {
  transactions: Transaction[];
}

export const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: 0,
        expenses: 0,
      };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expenses += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const chartData = Object.values(monthlyData).sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  return (
    <Card className="bg-gradient-card shadow-elevated border-0 hover-lift">
      <CardHeader className="animate-slide-in-top">
        <CardTitle className="flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
          📊 Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground animate-bounce-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-lg font-medium">No data to display</p>
            <p className="text-sm">Add some transactions to see your monthly overview!</p>
          </div>
        ) : (
          <div className="animate-fade-in animation-delay-300">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} className="animate-slide-in-bottom">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1)',
                  }}
                />
                <Bar 
                  dataKey="income" 
                  fill="hsl(var(--income))" 
                  name="Income"
                  radius={[4, 4, 0, 0]}
                  className="hover-lift"
                />
                <Bar 
                  dataKey="expenses" 
                  fill="hsl(var(--expense))" 
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                  className="hover-lift"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};