import { Link } from "react-router-dom";

function ErrorPage() {
    return (
      <div className="errorPage">
        <h1>404 / Routing Error</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        
        <button>
          <Link to="/">
            Go Back
          </Link>
        </button>
      </div>
    );
  }
  
  export default ErrorPage;
  