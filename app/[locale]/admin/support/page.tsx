'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Plus,
  Reply,
  Search,
  Filter,
  Download,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Archive,
  Trash2,
  Send,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

// Mock support tickets data
const supportTickets = [
  {
    id: '1',
    ticketId: 'SUP-2025-001',
    subject: 'Internet connection issues',
    description:
      'My internet has been very slow for the past 3 days. I can barely load web pages.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'Open',
    customer: 'KUM JUDE THADDEUS TEM',
    customerPhone: '+237 620 779 967',
    customerEmail: 'kum.thaddeus@email.com',
    assignedTo: 'John Doe',
    createdAt: '2025-09-15 10:30:00',
    updatedAt: '2025-09-15 14:20:00',
    responses: 3,
    satisfaction: null,
  },
  {
    id: '2',
    ticketId: 'SUP-2025-002',
    subject: 'Billing inquiry',
    description:
      'I was charged twice for my monthly subscription. Please refund the extra charge.',
    category: 'Billing Question',
    priority: 'Medium',
    status: 'In Progress',
    customer: 'MARIE CLAIRE NGO',
    customerPhone: '+237 698 123 456',
    customerEmail: 'marie.ngo@email.com',
    assignedTo: 'Jane Smith',
    createdAt: '2025-09-15 09:15:00',
    updatedAt: '2025-09-15 13:45:00',
    responses: 5,
    satisfaction: null,
  },
  {
    id: '3',
    ticketId: 'SUP-2025-003',
    subject: 'Request for new connection',
    description:
      'I want to install X-tremNet at my new office location. What are the requirements?',
    category: 'Suggestion',
    priority: 'Low',
    status: 'Resolved',
    customer: 'JEAN PIERRE KAMGA',
    customerPhone: '+237 655 789 012',
    customerEmail: 'jean.kamga@email.com',
    assignedTo: 'Mike Johnson',
    createdAt: '2025-09-14 16:20:00',
    updatedAt: '2025-09-15 11:30:00',
    responses: 8,
    satisfaction: 5,
  },
  {
    id: '4',
    ticketId: 'SUP-2025-004',
    subject: 'Account suspension appeal',
    description:
      'My account was suspended without warning. I need to understand why and get it reactivated.',
    category: 'Complaint',
    priority: 'High',
    status: 'Pending',
    customer: 'SOPHIE ETOGA',
    customerPhone: '+237 677 345 678',
    customerEmail: 'sophie.etoga@email.com',
    assignedTo: null,
    createdAt: '2025-09-15 15:45:00',
    updatedAt: '2025-09-15 15:45:00',
    responses: 0,
    satisfaction: null,
  },
];

// Mock support agents
const supportAgents = [
  {
    id: '1',
    name: 'John Doe',
    tickets: 12,
    avgResponseTime: '2h 15m',
    satisfaction: 4.5,
  },
  {
    id: '2',
    name: 'Jane Smith',
    tickets: 8,
    avgResponseTime: '1h 45m',
    satisfaction: 4.7,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    tickets: 15,
    avgResponseTime: '3h 30m',
    satisfaction: 4.2,
  },
];

export default function SupportPage() {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access support management.
          </p>
        </div>
      </div>
    );
  }

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = supportTickets.filter((t) => t.status === 'Open').length;
  const inProgressTickets = supportTickets.filter(
    (t) => t.status === 'In Progress',
  ).length;
  const resolvedTickets = supportTickets.filter(
    (t) => t.status === 'Resolved',
  ).length;
  const avgSatisfaction =
    supportTickets
      .filter((t) => t.satisfaction !== null)
      .reduce((sum, t) => sum + t.satisfaction, 0) /
      supportTickets.filter((t) => t.satisfaction !== null).length || 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Low':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Support Management
          </h1>
          <p className="text-muted-foreground">
            Manage customer support tickets and agent performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="font-bold text-xl">{openTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="font-bold text-xl">{inProgressTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="font-bold text-xl">{resolvedTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Satisfaction
                </p>
                <p className="font-bold text-xl">
                  {avgSatisfaction.toFixed(1)}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Agents Performance */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Agent Performance</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportAgents.map((agent) => (
              <Card key={agent.id} className="bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Support Agent
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Active Tickets:
                      </span>
                      <span className="font-medium">{agent.tickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Avg Response:
                      </span>
                      <span className="font-medium">
                        {agent.avgResponseTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Satisfaction:
                      </span>
                      <span className="font-medium">
                        {agent.satisfaction}/5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ticket.ticketId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline">{ticket.status}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Customer:</span>
                      <p className="font-medium">{ticket.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.customerPhone}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{ticket.category}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned: {ticket.assignedTo || 'Unassigned'}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Responses:</span>
                      <p className="font-medium">{ticket.responses}</p>
                      <p className="text-xs text-muted-foreground">
                        Created:{' '}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {ticket.satisfaction && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">
                        Customer Satisfaction:
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-3 w-3 rounded-full ${i < ticket.satisfaction ? 'bg-yellow-400' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {ticket.satisfaction}/5
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    {ticket.status !== 'Resolved' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
