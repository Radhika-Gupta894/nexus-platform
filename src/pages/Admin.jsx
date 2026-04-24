import React from "react";
import StatsCards from "../components/StatsCards";
import AdminPanel from "../components/AdminPanel";

const Admin = ({ user }) => {
  return (
    <div className="min-h-screen bg-[var(--color-nexus-bg)] p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[var(--color-nexus-text)] tracking-tighter">
          NEXUS <span className="text-[var(--color-nexus-primary)]">COMMAND</span>
        </h1>
        <p className="text-[var(--color-nexus-text-muted)] text-sm font-medium mt-2">Strategic Intelligence & Resource Coordination</p>
      </div>

      <StatsCards />

      <div className="mt-10">
        <AdminPanel user={user} />
      </div>
    </div>
  );
};

export default Admin;