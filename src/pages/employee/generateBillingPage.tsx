import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Client {
  id: string;
  name: string;
}

interface Bill {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING";
  generatedBy: string;
}

const GenerateBillingPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isBilling, setIsBilling] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const currentUserId = "USER_123"; // Replace with actual current user ID

  /* FETCH CLIENTS */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/client")
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* FETCH BILLS FOR CURRENT USER */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/employee/billing/list?userId=${currentUserId}`)
      .then((res) => setBills(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* GENERATE BILL */
  const generateBill = async () => {
    if (!clientId || !amount || !dueDate) {
      alert("Client, amount and due date are required");
      return;
    }
    setIsBilling(true);

    await axios.post("http://localhost:5000/api/employee/billing/generate", {
      clientId,
      description,
      amount: Number(amount),
      dueDate,
      generatedBy: currentUserId,
    });

    alert("Bill generated successfully");

    // reset form
    setClientId("");
    setDescription("");
    setAmount("");
    setDueDate("");
    setIsBilling(false);

    // refresh bills
    const res = await axios.get(`http://localhost:5000/api/employee/billing/list?userId=${currentUserId}`);
    setBills(res.data);
  };

  return (
    <DashboardLayout title="Generate Bill">
      <div className="flex gap-6">
        {/* Left: Create Bill Form */}
        <Card className="p-6 max-w-xl flex-1">
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>

          {/* CLIENT SELECT */}
          <label className="block mb-1">Select Client</label>
          <select
            className="w-full border p-2 rounded mb-4"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">-- Select Client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <label className="block mb-1">Description</label>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Tax filing services"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* AMOUNT */}
          <label className="block mb-1">Amount (Rs)</label>
          <input
            type="number"
            className="w-full border p-2 rounded mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* DUE DATE */}
          <label className="block mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded mb-6"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Button onClick={generateBill} className="w-full" disabled={isBilling}>
            {isBilling ? "Generating..." : "Generate Bill"}
          </Button>
        </Card>

        {/* Right: Bills List */}
        <Card className="p-6 flex-1">
          <h2 className="text-xl font-semibold mb-4">Your Generated Bills</h2>
          {bills.length === 0 ? (
            <p>No bills generated yet.</p>
          ) : (
            <ul>
              {bills.map((bill) => (
                <li key={bill.id} className="border-b py-2 flex justify-between">
                  <div>
                    <p className="font-medium">{bill.clientName}</p>
                    <p>Rs {bill.amount} - Due {bill.dueDate}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-white font-semibold ${
                      bill.status === "PAID" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {bill.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GenerateBillingPage;
