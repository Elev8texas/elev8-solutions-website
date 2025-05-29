// Calendar service for appointment booking
// Uses Google Calendar API with domain-wide delegation for internal use

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
}

export interface AppointmentData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: string[];
  startTime: string;
  endTime: string;
  address?: string;
  notes?: string;
}

// Business hours configuration
export const getBusinessHours = (date: Date): { start: Date; end: Date } => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  const start = new Date(date);
  const end = new Date(date);
  
  if (dayOfWeek === 0) { // Sunday
    // Emergency only - no regular hours
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  } else if (dayOfWeek === 6) { // Saturday
    start.setHours(8, 0, 0, 0); // 8 AM
    end.setHours(16, 0, 0, 0);  // 4 PM
  } else { // Monday - Friday
    start.setHours(7, 0, 0, 0); // 7 AM
    end.setHours(18, 0, 0, 0);  // 6 PM
  }
  
  return { start, end };
};

// Check if a date/time is within business hours
export const isWithinBusinessHours = (dateTime: Date): boolean => {
  const { start, end } = getBusinessHours(dateTime);
  return dateTime >= start && dateTime <= end;
};

// Format time slot for display
export const formatTimeSlot = (timeSlot: TimeSlot): string => {
  const start = new Date(timeSlot.start);
  const end = new Date(timeSlot.end);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Generate available time slots for a given date
export const generateTimeSlots = (date: string): TimeSlot[] => {
  const selectedDate = new Date(date);
  const { start, end } = getBusinessHours(selectedDate);
  
  // No slots if outside business hours
  if (start.getTime() === end.getTime()) {
    return [];
  }
  
  const timeSlots: TimeSlot[] = [];
  const current = new Date(start);
  
  while (current < end) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + 60 * 60 * 1000); // 1 hour slots
    
    timeSlots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      available: true // Will be updated based on existing bookings
    });
    
    current.setHours(current.getHours() + 1);
  }
  
  return timeSlots;
};

// Mock function to get available time slots (will be replaced with actual API call)
export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    // Generate base time slots
    const slots = generateTimeSlots(date);
    
    // TODO: Replace with actual API call to check existing bookings
    // For now, randomly mark some slots as unavailable for demonstration
    return slots.map(slot => ({
      ...slot,
      available: Math.random() > 0.3 // 70% availability rate
    }));
    
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
};

// Mock function to create appointment (will be replaced with actual API call)
export const createAppointment = async (appointmentData: AppointmentData): Promise<string> => {
  try {
    // TODO: Replace with actual API call to create calendar event
    console.log('Creating appointment:', appointmentData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock appointment ID
    return `apt_${Date.now()}`;
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Unable to schedule appointment. Please try again or contact us directly.');
  }
};

// Get formatted date string for calendar display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Check if a date is a valid booking date (not in the past, within reasonable future)
export const isValidBookingDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months in advance
  
  return date >= today && date <= maxDate;
};

export default {
  getAvailableTimeSlots,
  createAppointment,
  formatTimeSlot,
  formatDate,
  getBusinessHours,
  isWithinBusinessHours,
  isValidBookingDate,
  generateTimeSlots
}; 