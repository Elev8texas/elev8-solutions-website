// Browser-compatible Google Calendar integration using Firebase Functions
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app);

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
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Get available time slots for scheduling using Firebase Functions
export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    const getSlots = httpsCallable(functions, 'getAvailableTimeSlots');
    const result = await getSlots({ date });
    
    if (result.data && (result.data as any).timeSlots) {
      return (result.data as any).timeSlots;
    }
    
    console.warn('No time slots returned from Firebase Function');
    return generateMockTimeSlots(date);
    
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    // Return mock time slots as fallback
    return generateMockTimeSlots(date);
  }
};

// Generate mock time slots for development/fallback
const generateMockTimeSlots = (date: string): TimeSlot[] => {
  const startOfDay = new Date(date);
  startOfDay.setHours(8, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(18, 0, 0, 0);
  
  const timeSlots: TimeSlot[] = [];
  const current = new Date(startOfDay);
  
  while (current < endOfDay) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + 60 * 60 * 1000);
    
    // Mock some slots as unavailable for realism
    const isAvailable = Math.random() > 0.3; // 70% availability
    
    timeSlots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      available: isAvailable
    });
    
    current.setHours(current.getHours() + 1);
  }
  
  return timeSlots;
};

// Create a calendar event using Firebase Functions
export const createServiceAppointment = async (
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  service: string,
  startTime: string,
  endTime: string,
  address?: string
): Promise<string> => {
  try {
    const createEvent = httpsCallable(functions, 'createCalendarEvent');
    
    const result = await createEvent({
      customerName,
      customerEmail,
      customerPhone,
      service,
      startTime,
      endTime,
      address
    });
    
    const data = result.data as any;
    
    if (data.success) {
      console.log(`Calendar event created: ${data.eventId}`);
      console.log(`Appointment saved: ${data.appointmentId}`);
      return data.eventId;
    } else {
      throw new Error('Failed to create calendar event');
    }
    
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Unable to schedule appointment. Please try again or contact us directly.');
  }
};

// Update appointment status using Firebase Functions
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string,
  calendarEventId?: string
): Promise<boolean> => {
  try {
    const updateStatus = httpsCallable(functions, 'updateAppointmentStatus');
    
    const result = await updateStatus({
      appointmentId,
      status,
      calendarEventId
    });
    
    const data = result.data as any;
    return data.success || false;
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
};

// Get business hours for a specific date
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

// eslint-disable-next-line import/no-anonymous-default-export
const googleCalendarService = {
  getAvailableTimeSlots,
  createServiceAppointment,
  updateAppointmentStatus,
  getBusinessHours,
  isWithinBusinessHours,
  formatTimeSlot
};

export default googleCalendarService; 