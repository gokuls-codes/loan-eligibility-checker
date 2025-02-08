"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AxiosInstance } from "../utils/axios-instance";
import { ENDPOINTS } from "@/constants";
import HistoryTable from "@/components/history/history-table";
import { Button } from "@/components/ui/button";

const HistoryPage = () => {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  const getHistory = async () => {
    try {
      const resp = await AxiosInstance.get(ENDPOINTS.history);
      setHistory(resp.data);
    } catch (err) {
      console.log(err);
      router.push("/login");
    }
  };

  const getUserProfile = async () => {
    try {
      const resp = await AxiosInstance.get(ENDPOINTS.profile);
      setUserProfile(resp.data);
    } catch (err) {
      console.log(err);
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await AxiosInstance.post(ENDPOINTS.logout);
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className=" w-full">
      <main className=" w-full max-w-md mx-auto p-4 space-y-4">
        <h1 className=" text-3xl font-semibold text-center">
          Hi, {userProfile?.name}{" "}
        </h1>
        <h2 className="text-center text-xl font-light">
          Your past eligiblity checks
        </h2>
        <HistoryTable history={history} />
        <div className=" w-full grid place-items-center">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out?
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
