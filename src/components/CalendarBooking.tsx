import React, { useState, useCallback, useEffect } from 'react';
import { getAvailableTimeSlots, formatTimeSlot, TimeSlot } from '../services/googleCalendar';

interface CalendarBookingProps {
  selectedDate: string;
  selectedTime: string;
  onDateTimeSelect: (date: string, time: string) => void;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({
  selectedDate,
  selectedTime,
  onDateTimeSelect,
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadAvailableDates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (selectedDate) {
        const slots = await getAvailableTimeSlots(selectedDate);
        setAvailableSlots(slots);
      }
    } catch (err) {
      console.error('Error loading available dates:', err);
      setError('Unable to load available time slots. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  const handleDateChange = (date: string) => {
    onDateTimeSelect(date, '');
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      onDateTimeSelect(selectedDate, timeSlot.start);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <label htmlFor="appointment-date" className="block text-sm font-medium text-text-primary mb-2">
          Select Date *
        </label>
        <input
          type="date"
          id="appointment-date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={today}
          className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
          required
        />
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Select Time *
          </label>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-text-secondary">Loading available times...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={loadAvailableDates}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Try again
              </button>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-300 ${
                    selectedTime === slot.start
                      ? 'bg-gold-500 text-white border-gold-500'
                      : slot.available
                      ? 'bg-background-primary border-border-primary text-text-primary hover:border-gold-500 hover:bg-background-secondary'
                      : 'bg-background-secondary border-border-primary text-text-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  {formatTimeSlot(slot)}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              No available time slots for this date. Please choose another date.
            </div>
          )}
        </div>
      )}

      {/* Business Hours Info */}
      <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-2">Business Hours</h4>
        <div className="text-sm text-text-secondary space-y-1">
          <div>Monday - Friday: 7:00 AM - 6:00 PM</div>
          <div>Saturday: 8:00 AM - 4:00 PM</div>
          <div>Sunday: Emergency services only</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBooking; 