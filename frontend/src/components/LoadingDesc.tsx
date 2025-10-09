import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

interface ResultsLoadingProps {
  loading: boolean;
}

const LoadingDesc: React.FC<ResultsLoadingProps> = ({ loading }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (percentage < 100 && loading) {
      setTimeout(() => setPercentage((prev) => (prev += 25)), 15000);
    }
    if (loading === false) {
      setPercentage((prev) => (prev = 0));
    }
  }, [percentage, loading]);

  return (
    <div className="text-center my-4">
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="success" />
          <p className="mt-2 text-muted">
            Generating your playlist, this may take a few minutes
          </p>
          {percentage === 0 && (
            <p className="mt-2 text-muted">Sending data to backend...</p>
          )}
          {percentage === 25 && (
            <p className="mt-2 text-muted">Prompting LLM...</p>
          )}
          {percentage === 50 && (
            <p className="mt-2 text-muted">
              Generating playlist description...
            </p>
          )}
          {percentage === 75 && (
            <p className="mt-2 text-muted">
              Finding appropriate songs from description...
            </p>
          )}
          {percentage === 100 && (
            <p className="mt-2 text-muted">Uploading to Spotify...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingDesc;
