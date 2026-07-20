  import api from "@/services/api";
  import { useState, useEffect } from 'react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Calendar, Clock, MapPin, Users } from 'lucide-react';
  import EventRegistration from './EventRegistration';



  interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    price: number;
    category: string;
    description: string;
    image: string;
    maxParticipants: number;
    currentParticipants: number;
  }

  interface EventsSectionProps {
    isDarkMode: boolean;
  }

  export default function EventsSection({ isDarkMode }: EventsSectionProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    // Load events from localStorage
    useEffect(() => {
    const fetchEvents = async () => {

        try {

            const res = await api.get(
                "/events/get-event"
            );

            setEvents(
                res.data.allEvents
            );

        }
        catch(err){
            console.error(err);
        }
    };

    fetchEvents();

    }, []);

    const handleRegister = (event: Event) => {
      setSelectedEvent(event);
      setIsRegistrationOpen(true);
    };

    const handleRegistrationSuccess = (
    eventId: string
    ) => {

    setEvents(prev =>
        prev.map(event =>
            event._id === eventId
                ? {
                    ...event,
                    currentParticipants:
                        event.currentParticipants + 1
                  }
                : event
        )
    );
    };

    const getCategoryColor = (category: string) => {
      const colors = {
        workshop: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cultural: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        competition: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        career: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      };
      return colors[category as keyof typeof colors] || colors.workshop;
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return (
      <section id="events" className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Upcoming Events
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join exciting workshops, competitions, and cultural events designed to enhance your skills and expand your network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event._id} className={`group hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 hover:shadow-2xl'
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className={`transition-colors duration-300 ${
                          isDarkMode
                            ? 'bg-gray-900/80 text-white'
                            : 'bg-white/90 text-gray-900'
                        }`}
                      >
                        {event.price === 0
                          ? "Free"
                          : `₹${event.price}`}
                      </Badge>
                    </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className={`text-sm line-clamp-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className={`flex items-center text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      {formatDate(event.date)}
                    </div>
                    <div className={`flex items-center text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      {event.time}
                    </div>
                    <div className={`flex items-center text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <MapPin className="w-4 h-4 mr-2 text-red-600" />
                      {event.venue}
                    </div>
                    <div className={`flex items-center text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Users className="w-4 h-4 mr-2 text-purple-600" />
                      {event.currentParticipants} / {event.maxParticipants} registered
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => handleRegister(event)}
                      disabled={event.currentParticipants >= event.maxParticipants}
                      className={`w-full transition-all duration-300 ${
                        event.currentParticipants >= event.maxParticipants
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
                      }`}
                    >
                      {event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Register Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-xl transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No events available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {selectedEvent && (
          <EventRegistration
            event={selectedEvent}
            isOpen={isRegistrationOpen}
            onClose={() => {
              setIsRegistrationOpen(false);
              setSelectedEvent(null);
            }}
            onSuccess={handleRegistrationSuccess}
            isDarkMode={isDarkMode}
          />
        )}
      </section>
    );
  }