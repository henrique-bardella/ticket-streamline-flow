
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import StatusBadge from "@/components/StatusBadge";
import StyledButton from "@/components/StyledButton";
import InputField from "@/components/InputField";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { TicketStatus } from "@/types";
import { toast } from "sonner";

const TicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { getTicket, updateTicketStatus, addInteraction } = useTickets();
  const { currentUser, hasPermission } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the ticket if it exists
  const ticket = ticketId ? getTicket(ticketId) : undefined;

  // Redirect if ticket not found
  if (!ticket) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Ticket not found</h2>
          <StyledButton onClick={() => navigate("/tickets")}>
            Back to Tickets
          </StyledButton>
        </div>
      </MainLayout>
    );
  }

  // Handle status update
  const handleStatusUpdate = async (newStatus: TicketStatus) => {
    if (!ticketId) return;

    setIsSubmitting(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addInteraction(ticketId, newComment);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'PADE':
        return 'PADE';
      case 'META':
        return 'META';
      case 'ENCARTEIRAMENTO_POR_EXCECAO':
        return 'ENCARTEIRAMENTO POR EXCEÇÃO';
      default:
        return category;
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <StyledButton
          variant="outline"
          onClick={() => navigate("/tickets")}
          className="mb-4"
        >
          ← Back to Tickets
        </StyledButton>
      </div>

      <PageHeader 
        title={`${getCategoryDisplayName(ticket.category)} - ${ticket.solicitationNumber}`}
        description={`Created on ${format(new Date(ticket.createdAt), "MMMM d, yyyy")}`}
      />

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Status</h3>
          <div className="flex justify-between items-center">
            <StatusBadge status={ticket.status} />
            
            {/* Show status change buttons for admin and analyst */}
            {hasPermission(['admin', 'analyst']) && (
              <div className="flex gap-2">
                {ticket.status !== 'open' && (
                  <StyledButton 
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('open')}
                    disabled={isSubmitting}
                  >
                    Set Open
                  </StyledButton>
                )}
                {ticket.status !== 'in_progress' && (
                  <StyledButton 
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={isSubmitting}
                  >
                    In Progress
                  </StyledButton>
                )}
                {ticket.status !== 'resolved' && (
                  <StyledButton 
                    size="sm"
                    onClick={() => handleStatusUpdate('resolved')}
                    disabled={isSubmitting}
                  >
                    Resolve
                  </StyledButton>
                )}
              </div>
            )}
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Agency & Account</h3>
          <div>
            <p className="mb-2"><span className="font-semibold">Agency:</span> {ticket.agency}</p>
            <p><span className="font-semibold">Account Number:</span> {ticket.accountNumber}</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Last Activity</h3>
          <p className="text-sm text-muted-foreground">
            Last updated on {format(new Date(ticket.lastInteractionAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="mb-6">
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
          {Object.entries(ticket.additionalFields).map(([key, value]) => (
            <div key={key}>
              <p className="font-semibold capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </p>
              <p className="text-muted-foreground">{value as string}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Interactions</h3>
        <div className="space-y-4">
          {ticket.interactions.map((interaction) => (
            <GlassCard key={interaction.id} className="relative">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{interaction.userName}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(interaction.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p>{interaction.message}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-medium mb-4">Add Comment</h3>
        <form onSubmit={handleAddComment}>
          <InputField
            id="comment"
            label="Comment"
            type="textarea"
            value={newComment}
            onChange={setNewComment}
            placeholder="Enter your comment or update..."
            required
          />
          <div className="mt-4 flex justify-end">
            <StyledButton
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Comment"}
            </StyledButton>
          </div>
        </form>
      </GlassCard>
    </MainLayout>
  );
};

export default TicketDetail;
