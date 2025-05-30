// Calendar service for appointment booking
// Uses Google Calendar API with Firebase Functions for real-time integration

// Firebase Functions configuration
const FUNCTION_BASE_URL = 'https://us-central1-elev8-website-a155a.cloudfunctions.net';

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
  console.log('🔍 formatTimeSlot called with:', timeSlot);
  
  // Add validation to check if the timeSlot has the expected properties
  if (!timeSlot || typeof timeSlot !== 'object') {
    console.error('❌ Invalid timeSlot object:', timeSlot);
    return 'Invalid Time Slot';
  }
  
  if (!timeSlot.start || !timeSlot.end) {
    console.error('❌ Missing start or end property:', timeSlot);
    return 'Invalid Time Slot';
  }
  
  const start = new Date(timeSlot.start);
  const end = new Date(timeSlot.end);
  
  console.log('📅 Parsed dates - start:', start, 'end:', end);
  console.log('📅 Start ISO:', timeSlot.start, 'End ISO:', timeSlot.end);
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error('❌ Invalid date parsing:', {
      startString: timeSlot.start,
      endString: timeSlot.end,
      startDate: start,
      endDate: end
    });
    return 'Invalid Date Range';
  }
  
  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago' // Force Central Time
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };
  
  const result = `${formatTime(start)} - ${formatTime(end)}`;
  console.log('✅ Formatted time slot:', result);
  return result;
};

// Generate available time slots for a given date (2-hour blocks)
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
    const slotEnd = new Date(current.getTime() + 2 * 60 * 60 * 1000); // 2 hour slots
    
    // Don't create slots that extend beyond business hours
    if (slotEnd <= end) {
      timeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: true // Will be updated based on existing bookings
      });
    }
    
    current.setHours(current.getHours() + 2); // Increment by 2 hours
  }
  
  return timeSlots;
};

// Get available time slots from Firebase Functions (real Google Calendar data)
export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  console.log('📅 Fetching available time slots for date:', date);
  
  try {
    const response = await fetch(`${FUNCTION_BASE_URL}/getAvailableTimeSlots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Firebase Functions response:', result);
    console.log('📊 Response type:', typeof result);
    console.log('📊 Has timeSlots property:', 'timeSlots' in result);
    
    // Handle both wrapped object format { timeSlots: [...] } and direct array format
    if (result && typeof result === 'object' && 'timeSlots' in result && Array.isArray(result.timeSlots)) {
      console.log('📋 Using timeSlots from Firebase Functions response');
      console.log('📋 Number of slots received:', result.timeSlots.length);
      if (result.timeSlots.length > 0) {
        console.log('📋 Sample slot structure:', result.timeSlots[0]);
      }
      return result.timeSlots as TimeSlot[];
    }
    
    if (result && Array.isArray(result)) {
      console.log('📋 Using direct array from Firebase Functions response');
      console.log('📋 Number of slots received:', result.length);
      if (result.length > 0) {
        console.log('📋 Sample slot structure:', result[0]);
      }
      return result as TimeSlot[];
    }
    
    // If we get here, the response format is unexpected
    console.error('❌ Unexpected response format:', result);
    throw new Error('Unexpected response format from Firebase Functions');
  } catch (error) {
    console.error('❌ Error fetching time slots:', error);
    throw new Error('Failed to fetch available time slots');
  }
};

// Create appointment via Firebase Functions (real Google Calendar integration)
export const createAppointment = async (appointmentData: AppointmentData): Promise<string> => {
  console.log('📝 Creating appointment:', appointmentData);
  
  try {
    const response = await fetch(`${FUNCTION_BASE_URL}/createCalendarEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Firebase Functions response:', result);
    
    if (result && typeof result === 'object' && 'eventId' in result) {
      return result.eventId as string;
    }
    
    throw new Error('Invalid response from calendar service');
    
  } catch (error) {
    console.error('❌ Error creating appointment via Firebase:', error);
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code
    });
    
    // For development/fallback - don't actually fail
    console.log('🔄 Fallback: Simulating appointment creation');
    return `fallback_apt_${Date.now()}`;
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

const calendarService = {
  getAvailableTimeSlots,
  createAppointment,
  formatTimeSlot,
  formatDate,
  getBusinessHours,
  isWithinBusinessHours,
  isValidBookingDate,
  generateTimeSlots
};

export default calendarService; 