import React, { useState } from "react";
import HelmetTitle from "../../base/Helmet";
import ChatPanel from "../ChatPanel";
import SidePanel from "../SidePanel";

const Layout = ({ show }) => {
  const [sidePanel, setSidePanel] = useState(false);

  return (
    <div className="row">
      <HelmetTitle title="SayHello | Chat Room" />
      {show && (
        <>
          <SidePanel fireEvent={sidePanel} />
          <ChatPanel fireEvent={setSidePanel} />
        </>
      )}
    </div>
  );
};

export default Layout;
