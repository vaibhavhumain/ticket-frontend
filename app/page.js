import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto flex flex-col items-center text-center space-y-8 px-6">
        
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold text-slate-800 leading-snug">
          🎟 Ticket System
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          A simple and powerful platform where <span className="font-semibold">employees</span> can raise queries, 
          <span className="font-semibold"> developers</span> can resolve them, and 
          <span className="font-semibold"> admins</span> can manage everything — all in one place.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Raise Tickets</h3>
            <p className="text-slate-500 text-sm">
              Employees can submit issues, feature requests, or queries with ease.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Track Progress</h3>
            <p className="text-slate-500 text-sm">
              Stay updated with statuses like Open, In-Progress, Resolved, or Closed.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Admin Dashboard</h3>
            <p className="text-slate-500 text-sm">
              Manage assignments, monitor developers, and analyze reports in real time.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-4">
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/register">Register</a>
          </Button>
        </div>

      </div>
    </main>
  );
}
