import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, TrendingUp, CalendarDays, Plus, Loader2, Edit, Mail, Phone, User, Check, X, Trash2, PieChart as PieIcon, BarChart as BarIcon, LineChart as LineIcon } from "lucide-react";
import { bookingApi, resortApi } from "@/lib/api";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    try {
      const [dashboardRes, resortsRes] = await Promise.allSettled([
        bookingApi.getOwnerDashboard(),
        resortApi.getOwnerResorts()
      ]);

      if (dashboardRes.status === 'fulfilled') {
        setDashboard(dashboardRes.value);
      } else {
        console.error("Dashboard Stats Error:", dashboardRes.reason);
        toast.error("Failed to load revenue data");
      }

      if (resortsRes.status === 'fulfilled') {
        setResorts(resortsRes.value);
      } else {
        console.error("Resorts Fetch Error:", resortsRes.reason);
        toast.error("Failed to load your resorts");
      }
    } catch (error: any) {
      toast.error("Unexpected error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await bookingApi.updateStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      fetchOwnerData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDeleteResort = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resort? This cannot be undone.")) return;
    try {
      await resortApi.delete(id);
      toast.success("Resort deleted successfully");
      fetchOwnerData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete resort");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Owner Portal</h1>
          <p className="text-muted-foreground">Manage your properties and track revenue.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/add-resort">
            <a><Plus className="h-4 w-4 mr-2" /> Add New Resort</a>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-border/50 shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Confirmed Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{dashboard?.summary?.confirmedRevenue?.toLocaleString()}</div>
            <p className="text-xs text-primary-foreground/60 mt-1">Ready for settlement</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{dashboard?.summary?.pendingRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From pending bookings</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{dashboard?.summary?.totalGuests || 0} Guests</div>
            <p className="text-xs text-muted-foreground mt-1">Across {dashboard?.summary?.totalResorts} active properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics */}
      {dashboard?.bookingTrend?.length > 0 || dashboard?.statusBreakdown?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {dashboard?.bookingTrend?.length > 0 && (
            <Card className="border-border/50 shadow-sm lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LineIcon className="h-5 w-5 text-accent" />
                  <CardTitle className="font-serif text-xl">Revenue Trend</CardTitle>
                </div>
                <CardDescription>Daily performance overview (Last 30 days)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard?.bookingTrend || []}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      fontSize={10}
                      tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickFormatter={(val) => `₹${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(val) => new Date(val).toLocaleDateString()}
                      formatter={(val) => [`₹${val}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {dashboard?.statusBreakdown?.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieIcon className="h-5 w-5 text-accent" />
                  <CardTitle className="font-serif text-xl">Booking Distribution</CardTitle>
                </div>
                <CardDescription>By status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard?.statusBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {dashboard?.statusBreakdown?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.status === 'confirmed' ? '#10b981' :
                            entry.status === 'pending' ? '#f59e0b' : '#ef4444'
                        } />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {dashboard?.resortRevenue?.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarIcon className="h-5 w-5 text-accent" />
                  <CardTitle className="font-serif text-xl">Top Resorts</CardTitle>
                </div>
                <CardDescription>Revenue contribution by property</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard?.resortRevenue || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={10} stroke="hsl(var(--muted-foreground))" tickFormatter={(val) => `₹${val}`} />
                    <YAxis dataKey="name" type="category" fontSize={10} width={80} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                      formatter={(val) => [`₹${val}`, 'Revenue']}
                    />
                    <Bar dataKey="totalAmount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-primary">My Resorts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resorts.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                No resorts found. Start by adding one!
              </Card>
            )}
            {resorts.map(resort => (
              <Card key={resort.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-muted flex items-center justify-center">
                  {resort.images && resort.images.length > 0 ? (
                    <img src={resort.images[0]} alt={resort.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="h-12 w-12 text-muted-foreground/30" />
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={
                      resort.status === 'active' ? 'bg-green-500' :
                        resort.status === 'pending' ? 'bg-amber-500' : 'bg-muted text-muted-foreground'
                    }>
                      {resort.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-primary mb-1 line-clamp-1">{resort.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resort.location}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <div className="font-medium text-primary">₹{resort.pricePerNight} <span className="text-xs text-muted-foreground font-normal">/ night</span></div>
                    <div className="flex gap-2 text-right">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild title="Edit Resort">
                        <Link href={`/resorts/${resort.id}/edit`}>
                          <a><Edit className="h-3.5 w-3.5" /></a>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" onClick={() => handleDeleteResort(resort.id)} title="Delete Resort">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8" asChild>
                        <Link href={`/resorts/${resort.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Recent Bookings & Guest Details</CardTitle>
              <CardDescription>Track your revenue and customer contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {dashboard?.moneyFlow?.length === 0 && (
                <p className="text-center text-muted-foreground py-8 italic">No transactions yet.</p>
              )}
              {dashboard?.moneyFlow?.map((tx: any) => (
                <div key={tx.bookingId} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-accent" />
                        <p className="font-medium text-sm text-primary">{tx.customer}</p>
                      </div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Mail className="h-2.5 w-2.5" /> {tx.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Phone className="h-2.5 w-2.5" /> {tx.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">₹{tx.amount}</p>
                      <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 ${tx.status === 'confirmed' ? 'text-green-600 border-green-200 bg-green-50' :
                        tx.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                          'text-red-600 border-red-200 bg-red-50'
                        }`}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{tx.resortName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-accent/80">{tx.stayPeriod}</p>
                    </div>

                    {tx.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleStatusUpdate(tx.bookingId, 'confirmed')}
                          title="Confirm Booking"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(tx.bookingId, 'cancelled')}
                          title="Reject Booking"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
