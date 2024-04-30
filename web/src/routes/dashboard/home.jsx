import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Navbar />
      <Button>Hola!</Button>
    </div>
  );
}
