import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import ScheduleTab from '../components/ScheduleTab/ScheduleTab';
import BudgetTab from '../components/BudgetTab/BudgetTab';
import TripSubheader from '../components/TripSubheader/TripSubheader';
import TripModals from '../components/TripModals/TripModals';
import { api } from '../services/api';
import './TripDetailsPage.css';

function TripDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState('schedule'); 
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [globalError, setGlobalError] = useState(null);
    const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState(null);

    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isEditTripOpen, setIsEditTripOpen] = useState(false);
    const [isDeleteTripOpen, setIsDeleteTripOpen] = useState(false);

    const [itemToDelete, setItemToDelete] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [eventToEdit, setEventToEdit] = useState(null); 

    const [isDeleting, setIsDeleting] = useState(false);
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
            setGlobalError("Oops! Failed to delete this item. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (item) => {
        if (item.itemType === 'expense') {
            setExpenseToEdit(item);
        } else if (item.itemType === 'place') {
            setEventToEdit(item);
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

    const handleEventUpdated = (updatedEvent) => {
        setTrip(prevTrip => {
            const oldEvent = prevTrip.places.find(p => p.id === updatedEvent.id);
            const priceDifference = parseFloat(updatedEvent.cost || 0) - parseFloat(oldEvent.cost || 0);

            return {
                ...prevTrip,
                places: prevTrip.places.map(p => p.id === updatedEvent.id ? updatedEvent : p),
                total_spent: (parseFloat(prevTrip.total_spent || 0) + priceDifference).toString()
            };
        });
        setEventToEdit(null); 
    };

    const handleTripUpdated = (updatedTrip) => {
        setTrip(updatedTrip); 
        setIsEditTripOpen(false);
    };

    const handleTripDelete = async () => {
        try {
            setIsDeletingTrip(true);
            await api.deleteTrip(trip.id);
            navigate('/trips'); 
        } catch (error) {
            setGlobalError("Oops! Could not delete this trip. Server might be down.");
        } finally {
            setIsDeletingTrip(false);
        }
    };

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

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container trip-details-container">
                
                <TripSubheader 
                    trip={trip}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    onAddClick={() => {
                        setSelectedDateForNewEvent(null); 
                        setIsAddEventOpen(true);
                    }}
                    onEditTrip={() => setIsEditTripOpen(true)}
                    onDeleteTrip={() => setIsDeleteTripOpen(true)}
                />

                {activeTab === 'schedule' ? (
                    <ScheduleTab 
                        trip={trip} 
                        categoryFilter={categoryFilter} 
                        onEventClick={handleEditClick} 
                        onQuickAddClick={(date) => {
                            setSelectedDateForNewEvent(date); 
                            setIsAddEventOpen(true);         
                        }}
                    />
                ) : (
                    <BudgetTab 
                        trip={trip} 
                        onAddExpense={() => setIsAddExpenseOpen(true)} 
                        onDeleteClick={setItemToDelete}
                        onEditClick={handleEditClick}
                    />
                )}

            </div>

            <TripModals 
                trip={trip}
                modals={{
                    isAddExpenseOpen, isAddEventOpen, itemToDelete, isDeleting, 
                    expenseToEdit, eventToEdit, isEditTripOpen, isDeleteTripOpen, 
                    isDeletingTrip, globalError, selectedDateForNewEvent
                }}
                setters={{
                    setIsAddExpenseOpen, setIsAddEventOpen, setItemToDelete, 
                    setExpenseToEdit, setEventToEdit, setIsEditTripOpen, 
                    setIsDeleteTripOpen, setGlobalError
                }}
                handlers={{
                    handleExpenseAdded, handleEventAdded, handleDeleteConfirm, 
                    handleExpenseUpdated, handleEventUpdated, handleTripUpdated, 
                    handleTripDelete
                }}
            />
        </div>
    );
}

export default TripDetailsPage;