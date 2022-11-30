import { BrowserRouter } from "react-router-dom";
import RenderOnAuthenticated from "./components/access/RenderOnAuthenticated";
import RenderOnAnonymous from "./components/access/RenderOnAnonymous";
import ComponetsContainer from "./components/ComponetsContainer";

function App() {
  return (
    <div className="container-fluid mx-auto">
      <BrowserRouter>
        <RenderOnAnonymous>
          <h1>WELCOME</h1>
        </RenderOnAnonymous>
        <RenderOnAuthenticated>
          <ComponetsContainer />
        </RenderOnAuthenticated>
      </BrowserRouter>
    </div>
  );
}

export default App;
