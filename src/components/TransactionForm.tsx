import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
  onClose: () => void;
}

const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Entertainment", "Utilities", "Shopping", 
  "Healthcare", "Education", "Insurance", "Other"
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Investment", "Business", "Gift", "Other"
];

export const TransactionForm = ({ onSubmit, onClose }: TransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      return;
    }

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md bg-card shadow-elevated animate-zoom-in hover-glow">
        <CardHeader className="flex flex-row items-center justify-between animate-slide-in-top">
          <CardTitle className="bg-gradient-primary bg-clip-text text-transparent text-xl">
            Add Transaction
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover-scale">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="animate-slide-in-bottom animation-delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 animate-fade-in stagger-1">
              <Label htmlFor="type" className="text-sm font-medium">Type</Label>
              <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                <SelectTrigger className="hover-scale transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Income</SelectItem>
                  <SelectItem value="expense">💸 Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 animate-fade-in stagger-2">
              <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 hover-scale"
              />
            </div>

            <div className="space-y-2 animate-fade-in stagger-3">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="hover-scale transition-all duration-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover-scale">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 animate-fade-in stagger-4">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 hover-scale"
              />
            </div>

            <div className="space-y-2 animate-fade-in stagger-5">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 hover-scale"
              />
            </div>

            <div className="flex gap-3 pt-4 animate-slide-in-bottom stagger-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 hover-scale"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant={type === 'income' ? 'income' : 'expense'}
                className="flex-1 btn-magnetic animate-pulse-glow"
              >
                <Plus className="w-4 h-4 mr-2 animate-spin" />
                Add {type === 'income' ? 'Income' : 'Expense'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};