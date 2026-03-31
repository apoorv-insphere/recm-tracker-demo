"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Authenticated from "./Authenticated";




const CustomLayout = ({ children }: any) => {
  const pathname = usePathname();
  const [clientRender, setClientRender] = useState(false);
  const [sidebarToggler, setSidebarToggler] = useState(false);
  const [responsiveSidebar, setResponsiveSidebar] = useState(false);

  useEffect(() => {
    setClientRender(true);
  }, []);

  if (!clientRender) {
    return null;
  }

  const paths = pathname.split("/");
  let pathnameClass = "";
  paths[1] == ""
    ? (pathnameClass = "login")
    : (pathnameClass = paths[1]);

  return (
    <>
      <div
        className={`admin-mainContainer theme1 ${sidebarToggler ? 'sidebar_collapsed' : ''} ${pathnameClass}`}
      >
    
          <>
            <Authenticated
              responsiveSidebar={responsiveSidebar}
              setResponsiveSidebar={setResponsiveSidebar}
              sidebarState={setSidebarToggler}
            >
              {children}
            </Authenticated>
          </>
    
      </div>
    </>
  );
};

export default CustomLayout;
