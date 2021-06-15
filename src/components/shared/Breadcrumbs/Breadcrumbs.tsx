import React from 'react';

const { REACT_APP_TITLE } = process.env;

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="wmnds-breadcrumb">
      <ol className="wmnds-breadcrumb__list">
        <li className="wmnds-breadcrumb__list-item">
          <a href="//wmnetwork.co.uk" className="wmnds-breadcrumb__link">
            Home
          </a>
        </li>
        <li className="wmnds-breadcrumb__list-item">
          <a
            href="/"
            className="wmnds-breadcrumb__link wmnds-breadcrumb__link--current"
            aria-current="page"
          >
            {REACT_APP_TITLE}
          </a>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
