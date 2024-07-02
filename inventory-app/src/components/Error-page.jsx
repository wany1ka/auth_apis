import { useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();
  const error = location.state && location.state.error;

  return (
    <div id="error-page" className="text-center mt-10 font-serif pt-10">
      <h1 className="text-red-600 text-3xl font-bold">Oops!</h1>
      <p className="text-lg">Sorry, an unexpected error has occurred.</p>
      <p>
        <i className="text-xl">{error ? error.message : "Page Not Found!"}</i>
      </p>
    </div>
  );
}

