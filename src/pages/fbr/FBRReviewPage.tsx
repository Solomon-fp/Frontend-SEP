import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FBRReviewPage = () => {
  const { returnId } = useParams();
  const [taxReturn, setTaxReturn] = useState<any>(null);

  // Fetch single tax return
  useEffect(() => {
    if (!returnId) return;
    axios
      .get(`http://localhost:5000/api/fbr/returns/${returnId}`)
      .then((res) => setTaxReturn(res.data))
      .catch((err) => console.error(err));
  }, [returnId]);

  const handleDecision = async (decision: "APPROVED" | "REJECTED" | "OBJECTION") => {
    if (!taxReturn) return;
    await axios.post(`http://localhost:5000/api/fbr/returns/${taxReturn.id}/decision`, { decision });
    // Refresh data
    const res = await axios.get(`http://localhost:5000/api/fbr/returns/${taxReturn.id}`);
    setTaxReturn(res.data);
  };

  if (!taxReturn) return <p>Loading...</p>;

  return (
    <div>
      <h1>Review Tax Return: {taxReturn.clientName}</h1>
      <p>Status: {taxReturn.status}</p>
      <button onClick={() => handleDecision("APPROVED")}>Approve</button>
      <button onClick={() => handleDecision("REJECTED")}>Reject</button>
      <button onClick={() => handleDecision("OBJECTION")}>Raise Objection</button>
    </div>
  );
};

export default FBRReviewPage;
