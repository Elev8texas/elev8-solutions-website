// Browser-compatible Google Calendar integration using REST API
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const CALENDAR_ID = process.env.REACT_APP_GOOGLE_CALENDAR_ID || 'primary';

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

// Get available time slots for scheduling (browser-compatible)
export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('Google API key not configured, returning mock time slots');
      return generateMockTimeSlots(date);
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0); // 8 AM start
    
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); // 6 PM end

    // Use Google Calendar API REST endpoint
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
      `key=${GOOGLE_API_KEY}&` +
      `timeMin=${startOfDay.toISOString()}&` +
      `timeMax=${endOfDay.toISOString()}&` +
      `singleEvents=true&` +
      `orderBy=startTime`
    );

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    const existingEvents = data.items || [];
    
    // Generate time slots (1-hour intervals)
    const timeSlots: TimeSlot[] = [];
    const current = new Date(startOfDay);
    
    while (current < endOfDay) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + 60 * 60 * 1000); // 1 hour later
      
      // Check if this slot conflicts with existing events
      const isAvailable = !existingEvents.some((event: any) => {
        if (!event.start?.dateTime || !event.end?.dateTime) return false;
        
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        
        return (slotStart < eventEnd && slotEnd > eventStart);
      });
      
      timeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: isAvailable
      });
      
      current.setHours(current.getHours() + 1);
    }
    
    return timeSlots;
    
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

// Create a calendar event (this would typically be done server-side)
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
    // Note: Creating calendar events from the browser requires OAuth2 authentication
    // For production, this should be done server-side via Firebase Functions
    console.log('Appointment request:', {
      customerName,
      customerEmail,
      customerPhone,
      service,
      startTime,
      endTime,
      address
    });
    
    // For now, we'll just log the appointment and return a mock ID
    // In production, this would send the data to your backend/Firebase Function
    // which would then create the actual calendar event
    
    const mockEventId = `mock_${Date.now()}`;
    console.log(`Mock calendar event created with ID: ${mockEventId}`);
    
    return mockEventId;
    
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Unable to schedule appointment');
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
  getBusinessHours,
  isWithinBusinessHours,
  formatTimeSlot
};

export default googleCalendarService; 