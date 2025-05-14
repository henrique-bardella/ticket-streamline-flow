
import { useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import { useTickets } from "@/contexts/TicketContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TicketCategory, TicketStatus } from "@/types";

const Dashboard = () => {
  const { allTickets } = useTickets();

  // Status distribution data
  const statusData = useMemo(() => {
    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
    };

    allTickets.forEach((ticket) => {
      statusCounts[ticket.status]++;
    });

    return [
      { name: "Open", value: statusCounts.open, color: "#3b82f6" },
      { name: "In Progress", value: statusCounts.in_progress, color: "#f59e0b" },
      { name: "Resolved", value: statusCounts.resolved, color: "#10b981" },
    ];
  }, [allTickets]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {
      PADE: 0,
      META: 0,
      ENCARTEIRAMENTO_POR_EXCECAO: 0,
    };

    allTickets.forEach((ticket) => {
      categoryCounts[ticket.category]++;
    });

    return [
      { name: "PADE", count: categoryCounts.PADE },
      { name: "META", count: categoryCounts.META },
      { name: "EXCECAO", count: categoryCounts.ENCARTEIRAMENTO_POR_EXCECAO },
    ];
  }, [allTickets]);

  // Get the total count for each status
  const openCount = allTickets.filter(t => t.status === 'open').length;
  const inProgressCount = allTickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = allTickets.filter(t => t.status === 'resolved').length;

  // Define an array of ticket categories to use instead of using Object.values(TicketCategory)
  const ticketCategories: TicketCategory[] = ['PADE', 'META', 'ENCARTEIRAMENTO_POR_EXCECAO'];

  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard" 
        description="View statistics and performance metrics for all tickets"
      />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <GlassCard>
          <h3 className="text-lg font-medium mb-1">Open Tickets</h3>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-blue-600">{openCount}</p>
            <p className="text-sm text-muted-foreground">Awaiting action</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-medium mb-1">In Progress</h3>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-amber-600">{inProgressCount}</p>
            <p className="text-sm text-muted-foreground">Currently being worked on</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-medium mb-1">Resolved</h3>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-emerald-600">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">Completed tickets</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-4">
          <h3 className="text-lg font-medium mb-6 text-center">Status Distribution</h3>
          {allTickets.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  nameKey="name"
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} tickets`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </GlassCard>
        
        <GlassCard className="p-4">
          <h3 className="text-lg font-medium mb-6 text-center">Tickets by Category</h3>
          {allTickets.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} tickets`]} />
                <Bar dataKey="count" fill="#972D7A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-medium mb-4">Ticket Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Open</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">In Progress</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resolved</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {ticketCategories.map((category) => {
                const categoryTickets = allTickets.filter(t => t.category === category);
                const openCount = categoryTickets.filter(t => t.status === 'open').length;
                const inProgressCount = categoryTickets.filter(t => t.status === 'in_progress').length;
                const resolvedCount = categoryTickets.filter(t => t.status === 'resolved').length;
                
                return (
                  <tr key={category} className="border-b border-gray-200">
                    <td className="px-4 py-3">
                      {category === 'ENCARTEIRAMENTO_POR_EXCECAO' ? 'ENCARTEIRAMENTO POR EXCEÇÃO' : category}
                    </td>
                    <td className="px-4 py-3">{openCount}</td>
                    <td className="px-4 py-3">{inProgressCount}</td>
                    <td className="px-4 py-3">{resolvedCount}</td>
                    <td className="px-4 py-3 font-medium">{categoryTickets.length}</td>
                  </tr>
                );
              })}
              <tr className="bg-muted/20">
                <td className="px-4 py-3 font-medium">Total</td>
                <td className="px-4 py-3 font-medium">{openCount}</td>
                <td className="px-4 py-3 font-medium">{inProgressCount}</td>
                <td className="px-4 py-3 font-medium">{resolvedCount}</td>
                <td className="px-4 py-3 font-medium">{allTickets.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </MainLayout>
  );
};

export default Dashboard;
