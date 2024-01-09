import React from 'react';
import { Link } from 'react-router-dom';

const Content = ({ children }) => {
  return (
    <div className="content-wrapper" style={{ minHeight: '596px' }}>
      {/* Content Header (Page header) */}
      

      {/* Main content */}
      <section class="content-header"></section>
      <section className="content">
        <div className="container-fluid">
        { children }
          {/* Row with boxes */}

        </div>
      </section>
    </div>
  );
};

export default Content;
