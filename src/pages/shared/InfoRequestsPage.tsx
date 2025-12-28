import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/* ================= TYPES ================= */

interface TaxReturn {
  id: number;
  clientId?: string;
  clientName?: string;
  taxYear?: string;
  status?: string;
}

type InfoStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface InfoRequest {
  id: number;
  returnId?: string;
  subject?: string;
  status?: InfoStatus;
  createdAt?: string;
  messages: {
    sender: string;
    message: string;
    timestamp: string;
  }[];
}

/* ================= COMPONENT ================= */

export default function InfoRequestsPage({
  userType = 'client',
}: {
  userType?: 'client' | 'employee';
}) {
  const { user } = useAuth();
  const [returns, setReturns] = useState<TaxReturn[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null);
  const [requests, setRequests] = useState<InfoRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<InfoRequest | null>(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [requestText, setRequestText] = useState('');

  /* ================= FETCH RETURNS ================= */
  useEffect(() => {
    fetch('http://localhost:5000/api/client/returns')
      .then(res => res.json())
      .then(data => {
        setReturns(data);
        setSelectedReturn(data[0] || null);
      });
  }, []);

  /* ================= FETCH REQUESTS ================= */
  useEffect(() => {
    if (!selectedReturn) return;

    fetch(`http://localhost:5000/api/info-request?returnId=${selectedReturn.id}`)
      .then(res => res.json())
      .then((data: InfoRequest[]) => {
        // Ensure messages is parsed as array
        const parsed = data.map(r => ({
          ...r,
          messages: Array.isArray(r.messages) ? r.messages : [],
        }));
        setRequests(parsed);
      });
  }, [selectedReturn]);

  /* ================= FILTER BY STATUS ================= */
  const pending = requests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS');
  const responded = requests.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED');

  /* ================= CREATE REQUEST ================= */
  const createRequest = async () => {
    if (!selectedReturn) return;
    await fetch('http://localhost:5000/api/info-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: selectedReturn.clientId,
        clientName: selectedReturn.clientName,
        returnId: selectedReturn.id,
        subject,
        message: requestText,
      }),
    });

    setSubject('');
    setRequestText('');

    const res = await fetch(
      `http://localhost:5000/api/info-request?returnId=${selectedReturn.id}`
    );
    setRequests(await res.json());
  };

  /* ================= SEND MESSAGE ================= */
  const sendReply = async () => {
    if (!selectedRequest || !message) return;

    await fetch(`http://localhost:5000/api/info-request/${selectedRequest.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: userType === 'client' ? 'Client' : 'Employee',
        message,
      }),
    });

    setMessage('');

    const res = await fetch(
      `http://localhost:5000/api/info-request?returnId=${selectedReturn?.id}`
    );
    const updated = await res.json();
    setRequests(updated);
    // Update selectedRequest with latest messages
    setSelectedRequest(updated.find((r: InfoRequest) => r.id === selectedRequest.id) || null);
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout title="Requests">
      {/* RETURNS BAR */}
      <Card className="p-4 mb-4 flex gap-4 overflow-x-auto">
        {returns.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedReturn(r)}
            className={cn(
              'min-w-[180px] p-4 rounded-lg border text-left',
              selectedReturn?.id === r.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            )}
          >
            <p className="font-semibold">{r.clientName || 'Unknown Client'}</p>
            <p className="text-sm opacity-80">Tax Year {r.taxYear}</p>
            <p className="text-xs opacity-70">Return #{r.id}</p>
          </button>
        ))}
      </Card>

      {/* EMPLOYEE REQUEST FORM */}
      {userType === 'employee' && (
        <Card className="p-4 mb-4">
          <Input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Request message"
            value={requestText}
            onChange={e => setRequestText(e.target.value)}
            className="mb-2"
          />
          <Button onClick={createRequest}>Request Information</Button>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* REQUEST LIST */}
        <Card>
          <Tabs defaultValue="pending">
            <TabsList className="w-full">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="responded">Responded</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pending.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className="p-3 block w-full text-left"
                >
                  <Clock className="inline w-4 h-4 mr-2" />
                  {r.subject}
                </button>
              ))}
            </TabsContent>

            <TabsContent value="responded">
              {responded.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className="p-3 block w-full text-left"
                >
                  <CheckCircle className="inline w-4 h-4 mr-2" />
                  {r.subject}
                </button>
              ))}
            </TabsContent>
          </Tabs>
        </Card>

        {/* CHAT */}
        <Card className="col-span-2 p-4 flex flex-col">
          {selectedRequest ? (
            <>
              {/* Messages History */}
              <div className="flex-1 space-y-3 overflow-auto">
                {selectedRequest.messages.map((m, i) => (
                  <div key={i}>
                    <b>{m.sender}</b>: {m.message}
                  </div>
                ))}
              </div>

              {/* Employee actions only if not resolved */}
              {selectedRequest.status !== 'RESOLVED' && (
                <div className="flex gap-2 mt-3">
                  {/* Reply Input (client or employee) */}
                  <Input value={message} onChange={e => setMessage(e.target.value)} />
                  <Button onClick={sendReply}>
                    <Send className="w-4 h-4" />
                  </Button>

                  {/* Resolve Button (employee only) */}
                  {userType === 'employee' && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={async () => {
                        await fetch(`http://localhost:5000/api/info-request/${selectedRequest.id}/resolve`, {
                          method: 'POST',
                        });

                        // Refresh requests
                        const res = await fetch(
                          `http://localhost:5000/api/info-request?returnId=${selectedReturn?.id}`
                        );
                        const updated = await res.json();
                        setRequests(updated);

                        // Update selected request
                        setSelectedRequest(updated.find((r: InfoRequest) => r.id === selectedRequest.id) || null);
                      }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <MessageSquare className="m-auto text-muted-foreground" />
          )}
        </Card>


      </div>
    </DashboardLayout>
  );
}
