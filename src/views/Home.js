import React from 'react';
import { Outlet, Link } from "react-router-dom";

class Home extends React.Component {

  render() {
    return (
      <div>
          <p>
            Hello, this is the home page.
            <nav>
                <Link to="/login">
                  <button type="button">Login here</button>
                </Link>
            </nav>
          </p>
      </div>
      );
  }
}

export default Home;
