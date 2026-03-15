import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, Loader2 } from "lucide-react";
import { bookingApi } from "@/lib/api";
import { toast } from "sonner";

export default function UserBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredBookings = bookings.filter(booking =>
    booking.resort?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your resort reservations.</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stays..."
            className="pl-10 pr-4 py-2 rounded-xl border border-border bg-white w-full md:w-80 h-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      <div className="space-y-6">
        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
            <p className="text-muted-foreground text-lg mb-4">No bookings found matching your search.</p>
            <a href="/" className="text-primary font-bold hover:underline">Explore Resorts</a>
          </div>
        )}
        {filteredBookings.map(booking => (
          <Card key={booking.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-muted">
                {booking.resort?.images && booking.resort.images.length > 0 ? (
                  <img src={booking.resort.images[0]} alt={booking.resort.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">#{booking.id.substring(0, 8).toUpperCase()}</span>
                      <Badge className={
                        booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' :
                          booking.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' :
                            booking.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 'bg-muted text-muted-foreground'
                      }>
                        {booking.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-1">{booking.resort?.name || "Unavailable Resort"}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-accent" /> {booking.resort?.location || "Location Unavailable"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">₹{booking.totalPrice}</div>
                    <div className="text-sm text-muted-foreground">Total Price</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="font-medium">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-bold">{booking.guests || 1}</span>
                  </div>
                  <button className="text-primary font-bold hover:text-accent transition-colors flex items-center">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
