import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Outlet />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
