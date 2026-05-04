import { useMemo, useState } from "react";
import { Copy, FileText, KeyRound, Loader2 } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import { createTenantId } from "../../auth/services/authService";

const apiUrl = "http://localhost:5000";

const WidgetDocs = () => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const [tenantId, setTenantId] = useState(storedUser?.tenantId || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const installSnippet = useMemo(
    () => `<script>
  window.ChatWidgetConfig = {
    tenantId: "${tenantId || "YOUR_TENANT_ID"}",
    apiUrl: "${apiUrl}",
    title: "Support Chat",
    welcomeMessage: "Hi! How can we help you today?"
  };
</script>
<script src="${apiUrl}/widget.js" async></script>`,
    [tenantId]
  );

  const handleCreateTenantId = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await createTenantId();
      setTenantId(data.tenantId);

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...currentUser, tenantId: data.tenantId })
      );

      setMessage("Tenant ID is ready");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating tenant ID");
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(installSnippet);
    setMessage("Install script copied");
  };

  const copyTenantId = async () => {
    if (!tenantId) return;
    await navigator.clipboard.writeText(tenantId);
    setMessage("Tenant ID copied");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 text-purple-600 p-3 rounded">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Widget Docs</h1>
            <p className="text-sm text-gray-500">
              Generate your tenant ID and add the chat widget to a customer website.
            </p>
          </div>
        </div>

        <section className="bg-white rounded shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Tenant ID</h2>
              <p className="text-sm text-gray-600">
                This ID is sent in the widget request header as x-api-key.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateTenantId}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-600 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {tenantId ? "Show Tenant ID" : "Create Tenant ID"}
            </button>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <input
              value={tenantId || "No tenant ID generated yet"}
              readOnly
              className="flex-1 border rounded px-3 py-2 bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={copyTenantId}
              disabled={!tenantId}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-700 disabled:opacity-60"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>

          {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
        </section>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Install Script</h2>
          <p className="text-sm text-gray-600 mb-4">
            Paste this before the closing body tag on the user website.
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={copySnippet}
              className="absolute right-3 top-3 bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              title="Copy install script"
              aria-label="Copy install script"
            >
              <Copy size={16} />
            </button>

            <pre className="bg-gray-950 text-gray-100 rounded p-4 overflow-x-auto text-sm">
              <code>{installSnippet}</code>
            </pre>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "1. Create Tenant ID",
              body: "Click Create Tenant ID. The backend stores a random UUID on your user account.",
            },
            {
              title: "2. Install Widget",
              body: "Paste the script on the customer website. The widget sends tenantId in the x-api-key header.",
            },
            {
              title: "3. Backend Verifies",
              body: "If the tenant ID exists, chatbot requests are accepted. Otherwise the widget request is blocked.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded shadow p-5">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default WidgetDocs;
