import React, { useState, useEffect } from 'react';
import { getAvailableTimeSlots, formatTimeSlot, TimeSlot, formatDate, isValidBookingDate } from '../services/calendarService';

interface CalendarBookingProps {
  selectedDate: string;
  selectedTime: string;
  onDateTimeSelect: (date: string, time: string) => void;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({
  selectedDate,
  selectedTime,
  onDateTimeSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(
    selectedDate ? new Date(selectedDate) : null
  );

  // Load available time slots when date changes
  useEffect(() => {
      if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableTimeSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (!isValidBookingDate(date)) return;
    
    const dateString = date.toISOString().split('T')[0];
    setSelectedDateObj(date);
    onDateTimeSelect(dateString, '');
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (!slot.available || !selectedDate) return;
    
    // Backend now consistently returns the correct format: { start: "ISO_DATE", end: "ISO_DATE", available: true }
    onDateTimeSelect(selectedDate, slot.start);
  };

  // Helper function to get the time value for comparison
  const getSlotTimeValue = (slot: TimeSlot): string => {
    return slot.start;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDateObj && date.toDateString() === selectedDateObj.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Select Date & Time
        </h3>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-background-secondary border border-border-primary rounded-lg p-4">
        <button
          type="button"
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-background-card rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h4 className="text-xl font-semibold text-text-primary">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        
        <button
          type="button"
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-background-card rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isValidDate = isValidBookingDate(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateSelect(date)}
                disabled={!isValidDate}
                className={`
                  p-3 text-sm rounded-lg transition-all duration-200 relative
                  ${isSelectedDate 
                    ? 'bg-gold-500 text-white font-semibold' 
                    : isValidDate && isCurrentMonthDate
                    ? 'bg-background-primary hover:bg-background-card text-text-primary hover:border-gold-300 border border-transparent'
                    : 'text-text-muted cursor-not-allowed'
                  }
                  ${isTodayDate && !isSelectedDate ? 'ring-2 ring-gold-300' : ''}
                `}
              >
                {date.getDate()}
                {isTodayDate && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gold-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDateObj && (
        <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
          <h4 className="text-lg font-semibold text-text-primary mb-2">
            {formatDate(selectedDateObj)}
          </h4>
          <p className="text-sm text-text-secondary">
            Select an available time slot below
          </p>
        </div>
      )}

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Available Time Slots
          </h4>
          
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-text-secondary">Loading available times...</span>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-all duration-300
                    ${selectedTime === getSlotTimeValue(slot)
                      ? 'bg-gold-500 text-white border-gold-500 shadow-gold-glow'
                      : slot.available
                      ? 'bg-background-primary border-border-primary text-text-primary hover:border-gold-500 hover:bg-background-card'
                      : 'bg-background-card border-border-primary text-text-muted cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {formatTimeSlot(slot)}
                  {!slot.available && (
                    <div className="text-xs mt-1 text-red-400">Booked</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <svg className="w-12 h-12 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No available time slots for this date.</p>
              <p className="text-sm mt-1">Please choose another date or contact us directly.</p>
            </div>
          )}
        </div>
      )}

      {/* Service Time Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-blue-400 text-sm font-medium">Service Time Notice</p>
            <p className="text-blue-300 text-xs mt-1">
              Service times may be delayed due to unforeseen circumstances such as weather conditions or previous appointment overruns. 
              We will contact you if any delays are expected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBooking; 