import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, CircleDollarSign, AlertCircle, CheckCircle, XCircle, Loader2, LineChart as LineIcon, PieChart as PieIcon, BarChart as BarIcon, ShieldAlert, Smartphone, Monitor } from "lucide-react";
import { bookingApi, resortApi } from "@/lib/api";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // To prevent multiple clicks

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, resortsRes] = await Promise.allSettled([
        bookingApi.getAdminDashboard(),
        resortApi.adminGetAll()
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      } else {
        toast.error("Failed to load global metrics");
      }

      if (resortsRes.status === 'fulfilled') {
        setResorts(resortsRes.value);
      } else {
        toast.error("Failed to load resort listings");
      }
    } catch (error: any) {
      toast.error("An error occurred loading the dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await resortApi.updateStatus(id, status);
      toast.success(`Resort ${status} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  const handleUpdateBookingStatus = async (id: string | number, status: string) => {
    setUpdating(true);
    try {
      await bookingApi.updateStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingResorts = resorts.filter(r => r.status === 'pending');
  const activeResorts = resorts.filter(r => r.status === 'active');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-1">Global Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and administrative controls.</p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Global Sales</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats?.summary?.totalSales?.toLocaleString()}</div>
            <p className="text-xs text-primary-foreground/60 mt-1">Total platform volume</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{stats?.summary?.confirmedRevenue?.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Ready for settlement</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.summary?.totalGuests || 0} Guests</div>
            <p className="text-xs text-muted-foreground mt-1">From {stats?.summary?.totalUsers} Users & {stats?.summary?.totalOwners} Owners</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Resorts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{activeResorts.length}</div>
            <p className="text-xs text-amber-600 mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {pendingResorts.length} pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="approvals" className="rounded-lg px-6">Resort Approvals</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg px-6">Performance</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-lg px-6">Master Ledger</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6">Security Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Pending Resort Applications</CardTitle>
              <CardDescription>Review and approve new property listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Property Name</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price/Night</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pendingResorts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground italic">
                          No pending registrations at the moment.
                        </td>
                      </tr>
                    )}
                    {pendingResorts.map((resort) => (
                      <tr key={resort.id} className="bg-card hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary">{resort.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{resort.location}</td>
                        <td className="px-6 py-4">{resort.owner?.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary">
                            {resort.category || 'Luxury'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">₹{resort.pricePerNight}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleUpdateStatus(resort.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleUpdateStatus(resort.id, 'inactive')}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          {/* Visual Analytics */}
          {stats?.bookingTrend?.length > 0 || stats?.statusBreakdown?.length > 0 || stats?.resortRevenue?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {stats?.bookingTrend?.length > 0 && (
                <Card className="border-border/50 shadow-sm lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <LineIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="font-serif text-xl">Platform Revenue Trend</CardTitle>
                    </div>
                    <CardDescription>Aggregate daily volume (Last 30 days)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.bookingTrend || []}>
                        <defs>
                          <linearGradient id="colorAmountAdmin" x1="0" y1="0" x2="0" y2="1">
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
                          contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                          labelFormatter={(val) => new Date(val).toLocaleDateString()}
                        />
                        <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAmountAdmin)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {stats?.statusBreakdown?.length > 0 && (
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <PieIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="font-serif text-xl">Global Booking Status</CardTitle>
                    </div>
                    <CardDescription>Platform-wide distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.statusBreakdown || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="status"
                        >
                          {stats?.statusBreakdown?.map((entry: any, index: number) => (
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

              {stats?.resortRevenue?.length > 0 && (
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="font-serif text-xl">Top Performing Resorts</CardTitle>
                    </div>
                    <CardDescription>Revenue by property</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.resortRevenue?.slice(0, 5) || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" fontSize={10} stroke="hsl(var(--muted-foreground))" tickFormatter={(val) => `₹${val}`} />
                        <YAxis dataKey="name" type="category" fontSize={10} width={80} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="totalAmount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Resort Performance Details</CardTitle>
              <CardDescription>Comprehensive breakdown by property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Resort Name</th>
                      <th className="px-6 py-4">Total Bookings</th>
                      <th className="px-6 py-4">Total Revenue</th>
                      <th className="px-6 py-4 text-right">Conversion Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats?.resortRevenue?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary">{item.name}</td>
                        <td className="px-6 py-4">{item.count} stays</td>
                        <td className="px-6 py-4 font-bold text-primary">₹{item.totalAmount?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-none">
                            High Growth
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {(!stats?.resortRevenue || stats.resortRevenue.length === 0) && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-muted-foreground italic">
                          No revenue data available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Master Money Flow</CardTitle>
              <CardDescription>Real-time transaction log across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Transaction Date</th>
                      <th className="px-6 py-4">Resort</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Stay Period</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats?.moneyFlow?.map((item: any) => (
                      <tr key={item.bookingId} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(item.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-primary">{item.resortName}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.customer}</span>
                            <span className="text-[10px] text-muted-foreground">{item.email}</span>
                            <span className="text-[10px] text-muted-foreground">{item.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">₹{item.amount}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{item.stayPeriod}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            item.status === 'confirmed' ? 'bg-green-500' :
                              item.status === 'pending' ? 'bg-amber-500' : 'bg-destructive'
                          }>
                            {item.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleUpdateBookingStatus(item.bookingId, 'confirmed')}
                                disabled={updating}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateBookingStatus(item.bookingId, 'cancelled')}
                                disabled={updating}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stats?.security?.deviceBreakdown?.length > 0 && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-accent" />
                    <CardTitle className="font-serif text-xl">Device Distribution</CardTitle>
                  </div>
                  <CardDescription>User access by platform</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.security?.deviceBreakdown || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="deviceType"
                      >
                        {stats?.security?.deviceBreakdown?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-accent" />
                  <CardTitle className="font-serif text-xl">Recent System Access</CardTitle>
                </div>
                <CardDescription>Security log of IPs and detected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">IP Address</th>
                        <th className="px-6 py-4">Device / OS</th>
                        <th className="px-6 py-4 text-right">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats?.security?.recentLogins?.map((login: any) => (
                        <tr key={login.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-primary">{login.name}</span>
                              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{login.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">{login.lastIp || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs">
                              {login.deviceType?.toLowerCase().includes('mac') || login.deviceType?.toLowerCase().includes('windows') ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                              <span>{login.deviceName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                            {new Date(login.updatedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {(!stats?.security?.recentLogins || stats.security.recentLogins.length === 0) && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-muted-foreground italic">
                            No security logs available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
