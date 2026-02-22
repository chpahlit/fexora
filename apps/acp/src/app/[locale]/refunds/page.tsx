"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app-shell";

interface RefundRequest {
  id: string;
  transactionId: string;
  userId: string;
  username: string;
  amount: number;
  type: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

interface RefundLog {
  id: string;
  transactionId: string;
  userId: string;
  username: string;
  amount: number;
  reason: string;
  processedBy: string;
  processedAt: string;
}

export default function RefundsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showManual, setShowManual] = useState(false);
  const [manualTxId, setManualTxId] = useState("");
  const [manualReason, setManualReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const { data: pendingData } = useQuery({
    queryKey: ["admin", "refunds", "pending"],
    queryFn: () => client.get<RefundRequest[]>("/admin/refunds?status=pending"),
  });
  const pending = pendingData?.success ? pendingData.data ?? [] : [];

  const { data: logData } = useQuery({
    queryKey: ["admin", "refunds", "log"],
    queryFn: () => client.get<RefundLog[]>("/admin/refunds/log"),
  });
  const log = logData?.success ? logData.data ?? [] : [];

  async function handleProcess(id: string, action: "approve" | "reject") {
    setProcessing(id);
    await client.post(`/admin/refunds/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
    setProcessing(null);
  }

  async function handleManualRefund() {
    if (!manualTxId.trim() || !manualReason.trim()) return;
    setProcessing("manual");
    await client.post("/admin/refunds/manual", {
      transactionId: manualTxId,
      reason: manualReason,
    });
    queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
    setProcessing(null);
    setManualTxId("");
    setManualReason("");
    setShowManual(false);
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Refund Management</h1>
          <p className="text-sm text-muted-foreground">
            Process refund requests and issue manual refunds
          </p>
        </div>
        <Button onClick={() => setShowManual(!showManual)}>
          {showManual ? "Cancel" : "Manual Refund"}
        </Button>
      </div>

      {/* Manual Refund Form */}
      {showManual && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issue Manual Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={manualTxId}
                onChange={(e) => setManualTxId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                placeholder="Reason for refund (required for audit trail)"
                rows={3}
              />
            </div>
            <Button
              onClick={handleManualRefund}
              disabled={processing === "manual" || !manualTxId.trim() || !manualReason.trim()}
            >
              {processing === "manual" ? "Processing..." : "Process Refund"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{log.length}</p>
            <p className="text-xs text-muted-foreground">Total Refunds Processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{log.reduce((s, l) => s + l.amount, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Refunded (Coins)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="log">Refund Log</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">User</th>
                  <th className="p-3 text-left font-medium">Transaction</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-right font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Reason</th>
                  <th className="p-3 text-right font-medium">Requested</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((req) => (
                  <tr key={req.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{req.username}</td>
                    <td className="p-3 text-xs font-mono">{req.transactionId.slice(0, 8)}...</td>
                    <td className="p-3"><Badge variant="secondary">{req.type}</Badge></td>
                    <td className="p-3 text-right font-bold">{req.amount.toLocaleString()}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{req.reason ?? "—"}</td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleProcess(req.id, "approve")}
                          disabled={processing === req.id}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcess(req.id, "reject")}
                          disabled={processing === req.id}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No pending refund requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="log" className="mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">User</th>
                  <th className="p-3 text-left font-medium">Transaction</th>
                  <th className="p-3 text-right font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Reason</th>
                  <th className="p-3 text-left font-medium">Processed By</th>
                  <th className="p-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{entry.username}</td>
                    <td className="p-3 text-xs font-mono">{entry.transactionId.slice(0, 8)}...</td>
                    <td className="p-3 text-right font-bold">{entry.amount.toLocaleString()}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{entry.reason}</td>
                    <td className="p-3">{entry.processedBy}</td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(entry.processedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {log.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No refund log entries</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </AppShell>
  );
}
