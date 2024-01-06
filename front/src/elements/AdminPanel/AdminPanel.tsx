import AdminCryptos from "./AdminCryptos";
import AdminFeed from "./AdminFeed";

const AdminPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-10">
      {/* <AdminCryptos /> */}
      <AdminFeed />
    </div>
  );
};

export default AdminPanel;
