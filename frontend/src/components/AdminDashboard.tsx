import { useState, useEffect } from 'react';
import api from "@/services/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, DollarSign, Users, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

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

interface AdminDashboardProps {
  isDarkMode: boolean;
}

export default function AdminDashboard({ isDarkMode }: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, '_id' | 'currentParticipants'>>({
    title: '',
    date: '',
    time: '',
    venue: '',
    price: 0,
    category: 'workshop',
    description: '',
    image: '',
    maxParticipants: 50
  });

  useEffect(() => {

    const fetchEvents = async () => {

        try {

            const res =
                await api.get(
                    "/events/get-event"
                );

            setEvents(
                res.data.allEvents
            );

        }
        catch(err){
            console.log(err);
        }
    };

    fetchEvents();

}, []);

  

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue) {
      toast.error('Please fill in all required fields');
      return;
    }

  try {

    const token =
        localStorage.getItem(
            "accessToken"
        );

    const res =
        await api.post(
            "/events/create",
            newEvent,
            {
                headers:{
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    setEvents(
        prev=>[
            ...prev,
            res.data.event
        ]
    );

      setNewEvent({
      title: '',
      date: '',
      time: '',
      venue:'',
      price: 0,
      category: 'workshop',
      description: '',
      image: '',
      maxParticipants: 50
    });
    setIsAddingEvent(false);
    toast.success('Event added successfully!');
  }
  catch(err){
    toast.error(
        "Failed to create event"
    );
 }
}

const handleEditEvent = (
    event: Event
) => {
    setEditingEvent({
        ...event
    });
};


const handleSaveEdit = async () => {

    if (!editingEvent) return;

    try {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        await api.put(
            `/events/update-event/${editingEvent._id}`,
            editingEvent,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        setEvents(prev =>
            prev.map(event =>
                event._id === editingEvent._id
                    ? editingEvent
                    : event
            )
        );

        setEditingEvent(null);

        toast.success(
            "Event updated successfully!"
        );

    }
    catch(err){

        toast.error(
            "Failed to update event"
        );

    }
};

const handleDeleteEvent = async (
    eventId:string
) => {

    try {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        await api.delete(
            `/events/delete-event/${eventId}`,
            {
                headers:{
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        setEvents(
            prev =>
            prev.filter(
                event =>
                event._id !== eventId
            )
        );

        toast.success(
            "Event deleted successfully!"
        );

    }
    catch(err){

        toast.error(
            "Failed to delete event"
        );

    }
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <TabsTrigger value="events" className={`transition-colors duration-300 ${
            isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'
          }`}>
            Manage Events
          </TabsTrigger>
          <TabsTrigger value="analytics" className={`transition-colors duration-300 ${
            isDarkMode ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'
          }`}>
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {/* Add Event Button */}
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Event Management
            </h3>
            <Button
              onClick={() => setIsAddingEvent(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Add Event Form */}
          {isAddingEvent && (
            <Card className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Add New Event
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingEvent(false)}
                    className={`transition-colors duration-300 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Event Title *
                    </Label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </Label>
                    <Select value={newEvent.category} onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}>
                      <SelectTrigger className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date *
                    </Label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time *
                    </Label>
                    <Input
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="e.g., 10:00 AM - 4:00 PM"
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location *
                    </Label>
                    <Input
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price
                    </Label>
                    <Input
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({ ...newEvent, price:Number(e.target.value) })}
                      placeholder="e.g., ₹500 or Free"
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Max Participants
                    </Label>
                    <Input
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: parseInt(e.target.value) || 50 })}
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Image URL
                    </Label>
                    <Input
                      value={newEvent.image}
                      onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <Label className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className={`transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddEvent} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Event
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event._id} className={`transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-4">
                  {editingEvent?._id === event._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editingEvent.title}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                        <Select value={editingEvent.category} onValueChange={(value) => setEditingEvent({ ...editingEvent, category: value })}>
                          <SelectTrigger className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={editingEvent.date}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                        <Input
                          value={editingEvent.time}
                          onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                        <Input
                          value={editingEvent.venue}
                          onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                        <Input
                          value={editingEvent.price}
                          onChange={(e) => setEditingEvent({ ...editingEvent, price:Number(e.target.value) })}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                      <Textarea
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        rows={2}
                        className={`transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveEdit} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingEvent(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className={`font-semibold text-lg transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {event.title}
                          </h4>
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className={`flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className={`flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time}
                          </div>
                          <div className={`flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.venue}
                          </div>
                          <div className={`flex items-center transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <DollarSign className="w-4 h-4 mr-1" />
                            {event.price === 0
                            ? "Free"
                            : `₹${event.price}`}
                          </div>
                        </div>
                        <div className={`flex items-center mt-2 text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <Users className="w-4 h-4 mr-1" />
                          {event.currentParticipants} / {event.maxParticipants} participants
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className={`transition-colors duration-300 ${
                            isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Events
                </div>
              </CardContent>
            </Card>
            <Card className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {events.reduce((sum, event) => sum + event.currentParticipants, 0)}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Participants
                </div>
              </CardContent>
            </Card>
            <Card className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((events.reduce((sum, event) => sum + event.currentParticipants, 0) / 
                    events.reduce((sum, event) => sum + event.maxParticipants, 1)) * 100)}%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Average Fill Rate
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}