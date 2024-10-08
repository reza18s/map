import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex h-dvh w-full items-center">
      <Sidebar />
      <Map />
    </div>
  );
}
