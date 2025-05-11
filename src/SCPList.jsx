import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./SCPList.css";

const SCPList = () => {
  const [scps, setScps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSCPs();
  }, []);

  const fetchSCPs = async () => {
    const { data, error } = await supabase.from("scp_subjects").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error fetching SCPs:", error.message);
    } else {
      setScps(data);
    }
    setLoading(false);
  };

  if (loading) return <p className="loading">Loading SCP entries...</p>;

  return (
    <div className="scp-list">
      {scps.map((scp) => (
        <div className="scp-card" key={scp.id}>
          <img src={scp.image_url} alt={scp.item} className="scp-image" />
          <h2>{scp.item}</h2>
          <h3>{scp.classification}</h3>
          <p>{scp.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SCPList;
