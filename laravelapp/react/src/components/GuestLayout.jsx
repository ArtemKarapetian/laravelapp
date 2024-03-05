import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function GuestLayout() {
  const { user, token } = useStateContext();

  if (token) {
    return <Navigate to="/catalogue" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
