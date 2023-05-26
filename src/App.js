import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import HomeLayout from "./layouts/HomeLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import TestatorDashboard from "./pages/TestatorDashboard/TestatorDashboard";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard/BeneficiaryDashboard";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/dashboard/testator" element={<DashboardLayout />}>
          <Route index element={<TestatorDashboard />} />
        </Route>
        <Route path="dashboard/beneficiary" element={<DashboardLayout />}>
          <Route index element={<BeneficiaryDashboard />} />
        </Route>
      </>
    )
  );

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
