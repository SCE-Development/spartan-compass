import SmartSearch from "@/components/smart-search";

export default function Page() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center pt-8">
      <div className="flex items-center justify-center gap-x-4 gap-y-4 flex-col md:flex-row">
        <SmartSearch type="page" />
      </div>
    </div>
  );
}
