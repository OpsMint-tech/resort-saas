import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { resortApi, bookingApi } from "@/lib/api";
import {
  MapPin, Star, Wifi, Coffee, Car, AirVent, Waves,
  ShieldCheck, Dumbbell, Flower2, Loader2, ArrowLeft, Calendar,
  ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function ResortDetails() {
  const { id } = useParams();
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [checkIn, setCheckIn] = useState("2024-11-20");
  const [checkOut, setCheckOut] = useState("2024-11-25");
  const [guests, setGuests] = useState(1);

  const amenityIcons: Record<string, any> = {
    "Free WiFi": <Wifi className="h-5 w-5 mr-3 text-accent" />,
    "Breakfast": <Coffee className="h-5 w-5 mr-3 text-accent" />,
    "Free Parking": <Car className="h-5 w-5 mr-3 text-accent" />,
    "Air Conditioning": <AirVent className="h-5 w-5 mr-3 text-accent" />,
    "Pool Access": <Waves className="h-5 w-5 mr-3 text-accent" />,
    "Security": <ShieldCheck className="h-5 w-5 mr-3 text-accent" />,
    "Gym": <Dumbbell className="h-5 w-5 mr-3 text-accent" />,
    "Spa": <Flower2 className="h-5 w-5 mr-3 text-accent" />
  };

  useEffect(() => {
    fetchResort();
  }, [id]);

  const fetchResort = async () => {
    try {
      const data = await resortApi.getById(id as string);
      setResort(data);
    } catch (error: any) {
      toast.error("Failed to load resort details");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (!resort?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % resort.images.length);
  };

  const prevImage = () => {
    if (!resort?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + resort.images.length) % resort.images.length);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.info("Please log in to book this resort.");
      setLocation("/login");
      return;
    }

    setBookingLoading(true);
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const nightsCount = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      const basePrice = Number(resort.pricePerNight) * nightsCount;
      const taxAmount = Math.round(basePrice * 0.15);
      const finalTotal = basePrice + taxAmount;

      await bookingApi.create({
        resortId: resort.id,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: finalTotal,
        guests: guests
      });

      toast.success("Booking requested successfully!");
      setLocation("/my-bookings");
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resort) return <div className="p-12 text-center">Resort not found</div>;

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = Number(resort.pricePerNight || 0) * nights;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">
        {/* Header Gallery */}
        <div className="relative h-[60vh] w-full bg-muted overflow-hidden">
          {resort.images && resort.images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={resort.images[currentImageIndex]}
                alt={resort.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {resort.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    {resort.images.map((_: any, i: number) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <MapPin className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-8 left-8">
            <Link href="/">
              <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-none shadow-sm text-primary hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Explore
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-24 relative z-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h1 className="font-serif text-4xl font-bold text-primary mb-2">{resort.name}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2 text-accent" />
                      <span className="text-lg">{resort.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                    <Star className="h-5 w-5 fill-accent text-accent mr-2" />
                    <span className="text-lg font-bold text-primary">New <span className="text-muted-foreground text-sm font-normal">Property</span></span>
                  </div>
                </div>

                <div className="prose max-w-none text-muted-foreground mt-8">
                  <p className="text-lg leading-relaxed">{resort.description}</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-md border border-border/50">
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">Experience & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {resort.amenities && resort.amenities.length > 0 ? (
                    resort.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center text-muted-foreground text-sm">
                        {amenityIcons[amenity] || <CheckCircle2 className="h-5 w-5 mr-3 text-accent" />}
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic col-span-full">No specific amenities listed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-8 shadow-2xl border-2 border-primary/5">
                <div className="flex items-end gap-2 mb-6 pb-6 border-b border-border/50">
                  <span className="text-4xl font-bold text-primary">₹{resort.pricePerNight?.toLocaleString()}</span>
                  <span className="text-muted-foreground mb-1">/ night</span>
                </div>

                <div className="space-y-4 mb-8">
                  {user?.id === resort.ownerId ? (
                    <div className="bg-primary/5 rounded-xl p-6 text-center border-2 border-dashed border-primary/20">
                      <p className="text-sm font-medium text-primary mb-4">You are the owner of this property.</p>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link href={`/resorts/${resort.id}/edit`}>Edit Property Details</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Booking Fields */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Check-in Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border rounded-xl bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Check-out Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border rounded-xl bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Number of Guests</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="w-full p-3 border rounded-xl bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      {!localStorage.getItem('token') && (
                        <div className="bg-accent/5 rounded-xl p-4 text-center border border-accent/20 mb-4">
                          <p className="text-xs font-semibold text-accent mb-2">Login Required</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Please <Link href="/login" className="text-primary font-bold hover:underline">log in</Link> or <Link href="/register" className="text-primary font-bold hover:underline">register</Link> to secure your stay.
                          </p>
                        </div>
                      )}

                      <div className="space-y-4 mb-8 text-sm pt-6 border-t font-medium">
                        <div className="flex justify-between text-muted-foreground items-center">
                          <span className="text-secondary-foreground font-semibold">₹{Number(resort.pricePerNight).toLocaleString()} x {nights} nights</span>
                          <span className="text-primary font-bold pr-1">Subtotal: ₹{subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground/80 px-1 border-b border-border/20 pb-2">
                          <span>Taxes & Fees (15%)</span>
                          <span>₹{taxes?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary pt-3 text-2xl items-baseline">
                          <span className="font-serif">Total</span>
                          <span className="text-accent underline decoration-accent/20 underline-offset-8 decoration-2">₹{total?.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-lg h-14"
                        onClick={handleBooking}
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request to Book"}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4 italic font-serif">Quick booking, easy payments.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
