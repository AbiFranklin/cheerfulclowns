import { useState } from "react";
import Layout from "./components/Layout.jsx";
import MembersPage from "./components/MembersPage.jsx";
import AddMemberPage from "./components/AddMemberPage.jsx";
import DuesPage from "./components/DuesPage.jsx";
import AttendancePage from "./components/AttendancePage.jsx";
import ReportsPage from "./components/ReportsPage.jsx";

function App() {
  const [tab, setTab] = useState("members");
  const [editingMember, setEditingMember] = useState(null);

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === "members" && (
        <MembersPage
          goToAddMember={() => {
            setEditingMember(null);
            setTab("add-member");
          }}
          onEditMember={(member) => {
            setEditingMember(member);
            setTab("edit-member");
          }}
        />
      )}

      {tab === "add-member" && (
        <AddMemberPage
          mode="add"
          onDone={() => {
            setEditingMember(null);
            setTab("members");
          }}
        />
      )}

      {tab === "edit-member" && editingMember && (
        <AddMemberPage
          mode="edit"
          initialData={editingMember}
          onDone={() => {
            setEditingMember(null);
            setTab("members");
          }}
        />
      )}

      {tab === "dues" && <DuesPage />}

      {tab === "attendance" && <AttendancePage />}

      {tab === "reports" && <ReportsPage />}
    </Layout>
  );
}

export default App;
