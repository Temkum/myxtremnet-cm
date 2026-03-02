'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
} from 'lucide-react';

const feedbackData = [
  {
    id: 1,
    title: 'Difficulte',
    detail: "Salut! Je n'arrive plus a...",
    status: 'Answered',
    date: '01/09/2025',
    fullDetail:
      "Salut! Je n'arrive plus a me connecter a mon compte. J'ai essaye plusieurs fois mais ca ne marche pas.",
    response:
      'Bonjour, veuillez verifier votre mot de passe et reessayer. Si le probleme persiste, contactez notre support.',
  },
  {
    id: 2,
    title: 'Pas de Da...',
    detail: 'Bonjour...',
    status: 'Answered',
    date: '28/08/2025',
    fullDetail: "Bonjour, je n'ai pas de donnees malgre mon abonnement actif.",
    response:
      'Bonjour, nous avons verifie votre compte. Le probleme a ete resolu. Veuillez redemarer votre appareil.',
  },
  {
    id: 3,
    title: 'Pas de C...',
    detail: "Bonjour Camtel, J'aimerais...",
    status: 'Answered',
    date: '25/08/2025',
    fullDetail:
      "Bonjour Camtel, J'aimerais savoir comment je peux verifier ma consommation de donnees.",
    response:
      "Bonjour, vous pouvez consulter votre consommation dans la section 'Account Information' de votre portail.",
  },
  {
    id: 4,
    title: 'AIDE',
    detail: 'Bonjour comment consulter sa consommation...',
    status: 'Answered',
    date: '20/08/2025',
    fullDetail:
      'Bonjour comment consulter sa consommation de donnees sur le portail?',
    response:
      'Bonjour, connectez-vous a votre compte et allez dans Service > Account Information pour voir votre consommation.',
  },
  {
    id: 5,
    title: 'Comment...',
    detail: 'Svp je voulais changer mon mot de passe...',
    status: 'Answered',
    date: '15/08/2025',
    fullDetail:
      "Svp je voulais changer mon mot de passe mais je ne trouve pas l'option.",
    response:
      "Bonjour, allez dans votre profil en haut a droite et cliquez sur 'Change Password'.",
  },
  {
    id: 6,
    title: 'Manque d...',
    detail: "Lorsqu'on veut activer une offre dans...",
    status: 'Answered',
    date: '10/08/2025',
    fullDetail:
      "Lorsqu'on veut activer une offre dans l'application, ca affiche une erreur.",
    response:
      'Bonjour, nous avons identifie un probleme technique. Il a ete corrige. Veuillez reessayer.',
  },
  {
    id: 7,
    title: 'Transfert...',
    detail: 'Comment transferer le credit de son solde...',
    status: 'Answered',
    date: '05/08/2025',
    fullDetail:
      'Comment transferer le credit de son solde vers un autre numero Camtel?',
    response:
      "Bonjour, le transfert de credit n'est pas disponible pour le moment sur les comptes X-tremNet.",
  },
  {
    id: 8,
    title: 'bloquer',
    detail: 'Mon compte myxtremnet a ete bloque...',
    status: 'Answered',
    date: '01/08/2025',
    fullDetail:
      'Mon compte myxtremnet a ete bloque apres plusieurs tentatives de connexion echouees.',
    response:
      'Bonjour, votre compte a ete debloque. Veuillez utiliser le mot de passe par defaut et le changer ensuite.',
  },
];

export default function SupportPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<
    (typeof feedbackData)[0] | null
  >(null);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'answered':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Answered
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Feedback & Support
          </h1>
          <p className="text-muted-foreground">
            Submit and track your support requests
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Feedback</DialogTitle>
              <DialogDescription>
                Send us your questions, suggestions, or report an issue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Describe your issue or feedback in detail..."
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full">Submit Feedback</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-xl font-bold">{feedbackData.length}</p>
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
                <p className="text-sm text-muted-foreground">Answered</p>
                <p className="text-xl font-bold">
                  {feedbackData.filter((f) => f.status === 'Answered').length}
                </p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="public">Public Message</SelectItem>
                <SelectItem value="private">Private Message</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Enquiry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader className="border-b border-border flex flex-row items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Feedback Messages</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your submitted support requests
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-32">Title</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackData.map((feedback) => (
                  <TableRow key={feedback.id} className="hover:bg-secondary/30">
                    <TableCell className="font-medium text-primary">
                      {feedback.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {feedback.detail}
                    </TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFeedback(feedback)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{feedback.title}</DialogTitle>
                            <DialogDescription>
                              Submitted on {feedback.date}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label className="text-muted-foreground">
                                Your Message
                              </Label>
                              <p className="mt-1 p-3 bg-secondary rounded-lg">
                                {feedback.fullDetail}
                              </p>
                            </div>
                            {feedback.response && (
                              <div>
                                <Label className="text-muted-foreground">
                                  Response from Camtel
                                </Label>
                                <p className="mt-1 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                                  {feedback.response}
                                </p>
                              </div>
                            )}
                            <div className="flex justify-end">
                              {getStatusBadge(feedback.status)}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          First
        </Button>
        <Button variant="outline" size="sm" disabled>
          Prev
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
        <Button variant="outline" size="sm">
          Last
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
