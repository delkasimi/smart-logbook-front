import { useState, useEffect } from "react";
import config from "../../configuration/config";

const useProcedureDetails = (procedureId) => {
  const [procedureDetails, setProcedureDetails] = useState(null);
  useEffect(() => {
    const fetchProcedureDetails = async () => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/procedure/details/${procedureId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProcedureDetails(data);
      } catch (error) {
        console.error("Error fetching operation types:", error);
      }
    };

    if (procedureId) {
      fetchProcedureDetails();
    }
  }, [procedureId]);

  return procedureDetails;
};

export default useProcedureDetails;
