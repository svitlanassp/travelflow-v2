import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import ScheduleTab from '../components/ScheduleTab/ScheduleTab';
import BudgetTab from '../components/BudgetTab/BudgetTab';
import AddExpenseModal from '../components/AddExpenseModal/AddExpenseModal';
import EditExpenseModal from '../components/EditExpenseModal/EditExpenseModal';
import AddEventModal from '../components/AddEventModal/AddEventModal';
import EditTripModal from '../components/EditTripModal/EditTripModal';
import ConfirmModal from '../components/UI/ConfirmModal';
import TripActionsMenu from '../components/UI/TripActionsMenu';
import CategoryFilterDropdown from '../components/UI/CategoryFilterDropdown';
import { api } from '../services/api';
import { CATEGORY_STYLES } from '../constants/categories'; 
import './TripDetailsPage.css';

function TripDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState('schedule'); 
    
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);

    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const [isEditTripOpen, setIsEditTripOpen] = useState(false);
    const [isDeleteTripOpen, setIsDeleteTripOpen] = useState(false);
    const [isDeletingTrip, setIsDeletingTrip] = useState(false);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const data = await api.getTrip(id);
                setTrip(data);
            } catch (error) {
                console.error("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTripDetails();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="app-wrapper">
                <Header />
                <div className="page-container loading-container">
                    <div className="loading-state">loading trip details...</div>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    const filterOptions = [
        { id: 'all', label: 'all categories', icon: '🌍', bg: 'var(--purple-light)', main: 'var(--purple-main)' },
        ...Object.entries(CATEGORY_STYLES).map(([key, value]) => ({
            id: key, ...value
        }))
    ];
    const selectedOption = filterOptions.find(opt => opt.id === categoryFilter);

    const handleExpenseAdded = (newExpense) => {
        setTrip(prevTrip => ({
            ...prevTrip,
            expenses: [...prevTrip.expenses, newExpense],
            total_spent: (parseFloat(prevTrip.total_spent || 0) + parseFloat(newExpense.amount)).toString()
        }));
        setIsAddExpenseOpen(false);
    };

    const handleEventAdded = (newEvent) => {
        setTrip(prevTrip => ({
            ...prevTrip,
            places: [...prevTrip.places, newEvent],
            total_spent: (parseFloat(prevTrip.total_spent || 0) + parseFloat(newEvent.cost || 0)).toString()
        }));
        setIsAddEventOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        
        try {
            if (itemToDelete.itemType === 'expense') {
                await api.deleteExpense(itemToDelete.id);
                setTrip(prev => ({
                    ...prev,
                    expenses: prev.expenses.filter(e => e.id !== itemToDelete.id),
                    total_spent: (parseFloat(prev.total_spent || 0) - parseFloat(itemToDelete.amount || 0)).toString()
                }));
            } else if (itemToDelete.itemType === 'place') {
                await api.deletePlace(itemToDelete.id);
                setTrip(prev => ({
                    ...prev,
                    places: prev.places.filter(p => p.id !== itemToDelete.id),
                    total_spent: (parseFloat(prev.total_spent || 0) - parseFloat(itemToDelete.cost || 0)).toString()
                }));
            }
            setItemToDelete(null); 
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Oops! Failed to delete this item.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (item) => {
        if (item.itemType === 'expense') {
            setExpenseToEdit(item);
        } else if (item.itemType === 'place') {
            // ТУТ В МАЙБУТНЬОМУ БУДЕ: setEventToEdit(item);
            console.log("Відкриваємо кольорову модалку Edit Event для:", item.title);
        }
    };

    const handleExpenseUpdated = (updatedExpense) => {
        setTrip(prevTrip => {
            const oldExpense = prevTrip.expenses.find(e => e.id === updatedExpense.id);
            const priceDifference = parseFloat(updatedExpense.amount) - parseFloat(oldExpense.amount);

            return {
                ...prevTrip,
                expenses: prevTrip.expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e),
                total_spent: (parseFloat(prevTrip.total_spent || 0) + priceDifference).toString()
            };
        });
        setExpenseToEdit(null); 
    };

    const handleTripUpdated = (updatedTrip) => {
        setTrip(updatedTrip); // Просто оновлюємо весь об'єкт подорожі
        setIsEditTripOpen(false);
    };

    const handleTripDelete = async () => {
        try {
            setIsDeletingTrip(true);
            await api.deleteTrip(trip.id);
            // Якщо видалення успішне — викидаємо юзера назад на сторінку всіх подорожей
            navigate('/trips'); 
        } catch (error) {
            console.error("Failed to delete trip:", error);
            alert("Oops! Could not delete this trip.");
        } finally {
            setIsDeletingTrip(false);
        }
    };


    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container trip-details-container">
                
                <div className="subheader">
                    <div className="subheader-left">
                        <button className="back-btn" onClick={() => navigate('/trips')}>←</button>
                        
                        <div className="trip-title-wrapper">
                            <h1 className="trip-title">{trip.title}</h1>
                            <TripActionsMenu 
                                variant="icon-vertical"
                                onEdit={() => setIsEditTripOpen(true)} // 👈 ТУТ
                                onDelete={() => setIsDeleteTripOpen(true)} // 👈 І ТУТ
                            />
                        </div>

                        <div className="tabs">
                            <div className={`tab-glider ${activeTab}`}></div>
                            <button 
                                className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                                onClick={() => setActiveTab('schedule')}
                            >schedule</button>
                            <button 
                                className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
                                onClick={() => setActiveTab('budget')}
                            >budget</button>
                        </div>
                    </div>

                    {activeTab === 'schedule' && (
                        <div className="subheader-right">
                            <CategoryFilterDropdown 
                                categoryFilter={categoryFilter} 
                                setCategoryFilter={setCategoryFilter} 
                            />
                            <button className="btn-primary btn-add" onClick={() => setIsAddEventOpen(true)}>+</button>
                        </div>
                    )}
                </div>

                {activeTab === 'schedule' ? (
                    <ScheduleTab trip={trip} categoryFilter={categoryFilter} />
                ) : (
                    <BudgetTab 
                        trip={trip} 
                        onAddExpense={() => setIsAddExpenseOpen(true)} 
                        onDeleteClick={(item) => setItemToDelete(item)}
                        onEditClick={handleEditClick}
                    />
                )}

            </div>
            <AddExpenseModal 
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                tripId={trip.id}
                onExpenseAdded={handleExpenseAdded}
            />

            <AddEventModal 
                isOpen={isAddEventOpen}
                onClose={() => setIsAddEventOpen(false)}
                tripId={trip.id}
                onEventAdded={handleEventAdded}
            />

            <ConfirmModal 
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="delete item?"
                message={`Are you sure you want to delete "${itemToDelete?.title}"? This will affect your budget calculation.`}
                confirmText="delete"
                isProcessing={isDeleting}
            />

            <EditExpenseModal 
                isOpen={!!expenseToEdit}
                onClose={() => setExpenseToEdit(null)}
                expenseData={expenseToEdit}
                onExpenseUpdated={handleExpenseUpdated}
            />

            <EditTripModal 
                isOpen={isEditTripOpen}
                onClose={() => setIsEditTripOpen(false)}
                tripData={trip}
                onTripUpdated={handleTripUpdated}
            />

            <ConfirmModal 
                isOpen={isDeleteTripOpen}
                onClose={() => setIsDeleteTripOpen(false)}
                onConfirm={handleTripDelete}
                title="delete trip?"
                message={
                    <>
                        Are you sure you want to delete <strong>{trip.title}</strong>? 
                        This will erase all schedule and budget data forever!
                    </>
                }
                confirmText="delete trip"
                isProcessing={isDeletingTrip}
            />
        </div>
    );
}

export default TripDetailsPage;