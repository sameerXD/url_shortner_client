"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Table from "./components/Table";
import { IUrl, IUser, getAllUrls } from "./utils/userApi";

const Page = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<IUser>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    if (!token) {
      let tokenCache = localStorage.getItem("token");
      if (tokenCache) {
        setToken("Bearer "+tokenCache);
      }
    }
  }, []);

  const handleButtonClick = () => {
    // When the button is clicked, focus the Table component
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar />
      {token ? (
        <Table user={user} token={token} />
      ) : (
        <Hero
          setUser={setUser}
          handleButtonClick={handleButtonClick}
          user={user}
          setToken={setToken}
          token={token}
        />
      )}
    </div>
  );
};

export default Page;
