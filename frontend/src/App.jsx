// src/App.jsx

import { useState } from "react";
import Layout from "./components/Layout.jsx";
import MembersPage from "./components/MembersPage.jsx";
import AddMemberPage from "./components/AddMemberPage.jsx";
import DuesPage from "./components/DuesPage.jsx";
import AttendancePage from "./components/AttendancePage.jsx";
import ReportsPage from "./components/ReportsPage.jsx";

function App() {
  const [tab, setTab] = useState("members");

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === "members" && (
        <MembersPage goToAddMember={() => setTab("add-member")} />
      )}

      {tab === "add-member" && (
        <AddMemberPage onDone={() => setTab("members")} />
      )}

      {tab === "dues" && <DuesPage />}

      {tab === "attendance" && <AttendancePage />}

      {tab === "reports" && <ReportsPage />}
    </Layout>
  );
}

export default App;
