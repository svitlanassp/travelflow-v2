import { getCategoryStyle, CATEGORY_STYLES } from '../../constants/categories';
import './BudgetTab.css';

function BudgetTab({ trip, onAddExpense, onDeleteClick, onEditClick }) {
    const totalBudget = parseFloat(trip.total_budget) || 0;
    const totalSpent = parseFloat(trip.total_spent) || 0;
    const remaining = totalBudget - totalSpent;
    
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const daysCount = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const dailyAverage = totalSpent / daysCount;

    const totalProgress = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    const categoryTotals = {};
    Object.keys(CATEGORY_STYLES).forEach(key => categoryTotals[key] = 0);

    trip.places.forEach(p => {
        const cost = parseFloat(p.cost) || 0;
        if (categoryTotals[p.category] !== undefined) categoryTotals[p.category] += cost;
        else categoryTotals['others'] += cost;
    });

    trip.expenses.forEach(e => {
        const amount = parseFloat(e.amount) || 0;
        if (categoryTotals[e.category] !== undefined) categoryTotals[e.category] += amount;
        else categoryTotals['others'] += amount;
    });

    const formatExpenseDate = (dateStr) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
    };

    const normalizedExpenses = trip.expenses.map(e => ({
        ...e,
        itemType: 'expense', 
        displayAmount: parseFloat(e.amount),
        displayDate: e.date
    }));

    const normalizedPlaces = trip.places
        .filter(p => parseFloat(p.cost) > 0)
        .map(p => ({
            ...p,
            itemType: 'place', 
            displayAmount: parseFloat(p.cost),
            displayDate: p.visit_date
        }));

    const allTransactions = [...normalizedExpenses, ...normalizedPlaces].sort((a, b) => {
        return new Date(b.displayDate) - new Date(a.displayDate);
    });

    return (
        <div className="budget-tab-container">
            
            <div className="metrics-grid">
                <div className="metric-card">
                    <p className="metric-label">total budget</p>
                    <h2 className="metric-value">${totalBudget.toFixed(2)}</h2>
                    <p className="metric-subtext">set for this trip</p>
                </div>
                <div className="metric-card">
                    <p className="metric-label">total spent</p>
                    <h2 className="metric-value">${totalSpent.toFixed(2)}</h2>
                    <p className="metric-subtext">across {trip.expenses.length + trip.places.length} items</p>
                </div>
                <div className="metric-card">
                    <p className="metric-label">remaining</p>
                    <h2 className="metric-value">${Math.max(0, remaining).toFixed(2)}</h2>
                    <p className="metric-subtext">
                        {totalBudget > 0 ? `${(100 - totalProgress).toFixed(0)}% of budget left` : 'no budget set'}
                    </p>
                </div>
                <div className="metric-card">
                    <p className="metric-label">daily average</p>
                    <h2 className="metric-value">${dailyAverage.toFixed(2)}</h2>
                    <p className="metric-subtext">per day so far</p>
                </div>
            </div>

            <div className="budget-content-grid">
                
                <div className="breakdown-section card">
                    <h3 className="section-title">spending breakdown</h3>
                    
                    <div className="main-progress-container">
                        <div className="main-progress-labels">
                            <span>$0</span>
                            <span style={{ color: 'var(--purple-main)', fontWeight: 600 }}>${totalSpent.toFixed(0)}</span>
                            <span>${totalBudget.toFixed(0)}</span>
                        </div>
                        <div className="main-progress-track">
                            <div className="main-progress-fill" style={{ width: `${totalProgress}%` }}></div>
                        </div>
                    </div>

                    <div className="categories-breakdown">
                        {Object.entries(CATEGORY_STYLES).map(([catKey, style]) => {
                            const amount = categoryTotals[catKey];
                            if (amount === 0) return null; 
                            
                            const percent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;

                            return (
                                <div key={catKey} className="category-row">
                                    <div className="cat-row-left">
                                        <div className="cat-dot" style={{ backgroundColor: style.main }}></div>
                                        <span className="cat-name" style={{ color: style.main }}>{style.label}</span>
                                    </div>
                                    <div className="cat-row-middle">
                                        <div className="cat-progress-track">
                                            <div className="cat-progress-fill" style={{ width: `${percent}%`, backgroundColor: style.main }}></div>
                                        </div>
                                    </div>
                                    <div className="cat-row-right">
                                        <span className="cat-amount" style={{ color: style.main }}>${amount.toFixed(0)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="expenses-section card">
                    <div className="expenses-header">
                        <h3 className="section-title">all expenses</h3>
                        <button className="btn-primary btn-sm" onClick={onAddExpense}>+ new expense</button>
                    </div>

                    <div className="expenses-list">
                        {allTransactions.length === 0 ? (
                            <div className="empty-expenses">no expenses yet</div>
                        ) : (
                            allTransactions.map(item => {
                                const style = getCategoryStyle(item.category);
                                return (
                                    <div key={`${item.itemType}-${item.id}`} className="expense-item" onClick={() => onEditClick(item)}>
                                        <div className="expense-item-left">
                                            <div className="expense-icon" style={{ backgroundColor: style.bg, color: style.main }}>
                                                {style.icon}
                                            </div>
                                            <div className="expense-info">
                                                <h4 className="expense-name">
                                                    {item.title} 
                                                </h4>
                                                <span className="expense-date">{formatExpenseDate(item.displayDate)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="expense-item-right">
                                            <div className="expense-badge" style={{ backgroundColor: style.main, color: style.dark }}>
                                                {style.label}
                                            </div>
                                            <div className="expense-price">${item.displayAmount.toFixed(2)}</div>
                                            
                                            <button 
                                                className="delete-expense-btn" 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    onDeleteClick(item);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BudgetTab;