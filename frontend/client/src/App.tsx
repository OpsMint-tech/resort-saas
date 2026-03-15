import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ResortDetails from "@/pages/ResortDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import AdminDashboard from "@/pages/AdminDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";
import AddResort from "@/pages/AddResort";
import EditResort from "@/pages/EditResort";
import UserBookings from "@/pages/UserBookings";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify" component={Verify} />

      <Route path="/admin/dashboard"><Layout><AdminDashboard /></Layout></Route>
      <Route path="/owner/dashboard"><Layout><OwnerDashboard /></Layout></Route>
      <Route path="/add-resort"><Layout><AddResort /></Layout></Route>
      <Route path="/resorts/:id/edit"><Layout><EditResort /></Layout></Route>
      <Route path="/my-bookings"><Layout><UserBookings /></Layout></Route>

      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/resorts/:id">
        <Layout><ResortDetails /></Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors position="top-right" expand={true} />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
