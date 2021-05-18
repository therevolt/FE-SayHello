import React, { useState } from "react";
import HelmetTitle from "../../base/Helmet";
import ChatPanel from "../ChatPanel";
import SidePanel from "../SidePanel";
import UserPanel from "../UsersPanel";

const Layout = ({ show }) => {
  const [sidePanel, setSidePanel] = useState(false);
  const [userPanel, setUserPanel] = useState(false);

  return (
    <div className="row">
      <HelmetTitle title="SayHello | Chat Room" />
      {show && (
        <>
          <SidePanel fireEvent={sidePanel} />
          <ChatPanel fireEvent={setSidePanel} fireEvent2={[userPanel, setUserPanel]} />
          {userPanel && <UserPanel fireEvent={setUserPanel} />}
        </>
      )}
    </div>
  );
};

export default Layout;
