//PDFViewer.js
import React, { useState } from "react";

const PDFViewer = ({ pdfURL }) => {

  const [pdfUrl, setPdfUrl] = useState(null);

  

  return (
    <div style={{ marginLeft: 20 }}>
      
        <object data="/data/test.pdf" type="application/pdf" width="100%" height="100%">
        
        
      </object>
      
    </div>
  );
};

export default PDFViewer;