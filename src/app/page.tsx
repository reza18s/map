// File: src/app/page.tsx
"use client";
import dynamic from "next/dynamic";
import { useAppStore } from "@/store/store"; // Import the Zustand store
import { useEffect } from "react";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), {
  ssr: false,
});

export default function Home() {
  const {
    addPointModal,
    setAddPointModal,
    showPointList,
    setShowPointList,
    points,
    setPoints,
  } = useAppStore();

  useEffect(() => {
    // Fetch points data and update the store
    // Example: fetchPoints().then((data) => setPoints(data));
  }, []);

  return (
    <div className="flex h-screen w-full items-center">
      <Sidebar
        addPointModal={addPointModal}
        setAddPointModal={setAddPointModal}
        showPointList={showPointList}
        setShowPointList={setShowPointList}
      />
      <Map
        addPointModal={addPointModal}
        setAddPointModal={setAddPointModal}
        showPointList={showPointList}
        setShowPointList={setShowPointList}
        points={points}
      />
    </div>
  );
}
