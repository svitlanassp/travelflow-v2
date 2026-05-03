import { AnimatePresence } from 'framer-motion';
import AddExpenseModal from '../AddExpenseModal/AddExpenseModal';
import AddEventModal from '../AddEventModal/AddEventModal';
import EditExpenseModal from '../EditExpenseModal/EditExpenseModal';
import EditEventModal from '../EditEventModal/EditEventModal';
import EditTripModal from '../EditTripModal/EditTripModal';
import ConfirmModal from '../UI/ConfirmModal';
import ErrorModal from '../UI/ErrorModal';

function TripModals({ 
    trip, modals, setters, handlers
}) {
    return (
        <>
            <AddExpenseModal isOpen={modals.isAddExpenseOpen} onClose={() => setters.setIsAddExpenseOpen(false)} tripId={trip.id} onExpenseAdded={handlers.handleExpenseAdded} onError={setters.setGlobalError} />
            <AddEventModal isOpen={modals.isAddEventOpen} onClose={() => setters.setIsAddEventOpen(false)} tripId={trip.id} minDate={trip.start_date} maxDate={trip.end_date} onEventAdded={handlers.handleEventAdded} onError={setters.setGlobalError} initialDate={modals.selectedDateForNewEvent} />
            <EditExpenseModal isOpen={!!modals.expenseToEdit} onClose={() => setters.setExpenseToEdit(null)} expenseData={modals.expenseToEdit} onExpenseUpdated={handlers.handleExpenseUpdated} onError={setters.setGlobalError} />
            <EditTripModal isOpen={modals.isEditTripOpen} onClose={() => setters.setIsEditTripOpen(false)} tripData={trip} onTripUpdated={handlers.handleTripUpdated} onError={setters.setGlobalError} />
            
            <ConfirmModal isOpen={!!modals.itemToDelete} onClose={() => setters.setItemToDelete(null)} onConfirm={handlers.handleDeleteConfirm} title="delete item?" message={`Are you sure you want to delete "${modals.itemToDelete?.title}"?`} confirmText="delete" isProcessing={modals.isDeleting} />
            <ConfirmModal isOpen={modals.isDeleteTripOpen} onClose={() => setters.setIsDeleteTripOpen(false)} onConfirm={handlers.handleTripDelete} title="delete trip?" message={<>Are you sure you want to delete <strong>{trip.title}</strong>? This will erase all schedule and budget data forever!</>} confirmText="delete trip" isProcessing={modals.isDeletingTrip} />
            
            <ErrorModal isOpen={!!modals.globalError} message={modals.globalError} onClose={() => setters.setGlobalError(null)} />

            <AnimatePresence>
                {modals.eventToEdit && (
                    <EditEventModal isOpen={!!modals.eventToEdit} onClose={() => setters.setEventToEdit(null)} eventData={modals.eventToEdit} minDate={trip.start_date} maxDate={trip.end_date} onEventUpdated={handlers.handleEventUpdated} onDeleteClick={setters.setItemToDelete} onError={setters.setGlobalError} />
                )}
            </AnimatePresence>
        </>
    );
}

export default TripModals;