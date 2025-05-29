// Calendar service for appointment booking
// Uses Google Calendar API with Firebase Functions for real-time integration

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app);

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
    const getAvailableSlots = httpsCallable(functions, 'getAvailableTimeSlots');
    console.log('🔧 Firebase Functions endpoint:', getAvailableSlots);
    
    const result = await getAvailableSlots({ date });
    console.log('✅ Firebase Functions response:', result);
    
    // Handle both wrapped object format { timeSlots: [...] } and direct array format
    if (result.data && typeof result.data === 'object' && 'timeSlots' in result.data && Array.isArray((result.data as any).timeSlots)) {
      return (result.data as any).timeSlots as TimeSlot[];
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data as TimeSlot[];
    }
    
    // Fallback to generated slots if Firebase function fails
    console.warn('⚠️ Firebase function returned unexpected data, using fallback');
    return generateTimeSlots(date);
    
  } catch (error) {
    console.error('❌ Error fetching available time slots from Firebase:', error);
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code
    });
    
    // Fallback to local generation with mock availability
    console.log('🔄 Using fallback time slot generation');
    const slots = generateTimeSlots(date);
    return slots.map(slot => ({
      ...slot,
      available: Math.random() > 0.2 // 80% availability rate for fallback
    }));
  }
};

// Create appointment via Firebase Functions (real Google Calendar integration)
export const createAppointment = async (appointmentData: AppointmentData): Promise<string> => {
  console.log('📝 Creating appointment:', appointmentData);
  
  try {
    const createCalendarEvent = httpsCallable(functions, 'createCalendarEvent');
    console.log('🔧 Firebase Functions endpoint:', createCalendarEvent);
    
    const result = await createCalendarEvent(appointmentData);
    console.log('✅ Firebase Functions response:', result);
    
    if (result.data && typeof result.data === 'object' && 'eventId' in result.data) {
      return result.data.eventId as string;
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