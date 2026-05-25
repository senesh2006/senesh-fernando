import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Senesh Fernando" },
      { name: "description", content: "Site preferences and theme controls." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-16 sm:py-24 space-y-8">
      <div className="font-mono text-xs text-muted-foreground">// site.settings</div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings.</h1>
      <p className="text-muted-foreground">Use the <span className="kbd">t</span> shortcut anywhere on the site to flip themes. Preference is stored locally and syncs across tabs.</p>
      <div className="font-mono text-sm text-muted-foreground border border-border rounded-md p-4 space-y-1">
        <div>theme. follows OS by default · manual override saved to localStorage</div>
        <div>nav. j / k scroll · g+h home · g+a about · g+p projects · g+w writing · g+c contact</div>
        <div>help. press ? anywhere</div>
      </div>
    </div>
  );
}