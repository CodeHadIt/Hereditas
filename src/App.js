import React, { useEffect} from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import HomeLayout from "./layouts/HomeLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import TestatorDashboard from "./pages/TestatorDashboard/TestatorDashboard";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard/BeneficiaryDashboard";
import NotFound from "./pages/NotFound/NotFound";

function App() {

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please use app in a browser with an Ethereum wallet installed");
    }
  }, [])
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/dashboard/testator" element={<DashboardLayout />}>
          <Route index element={<TestatorDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="dashboard/beneficiary" element={<DashboardLayout />}>
          <Route index element={<BeneficiaryDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </>
    )
  );

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
