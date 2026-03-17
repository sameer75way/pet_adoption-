import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminSettings from "../pages/admin/Settings";
import StaffDashboard from "../pages/staff/Dashboard";
import StaffMedical from "../pages/staff/Medical";
import AdopterDashboard from "../pages/adopter/Dashboard";
import FavoritesPage from "../pages/adopter/Favorites";
import FosterPage from "../pages/adopter/Foster";
import PetsList from "../pages/pets/PetsList";
import PetDetail from "../pages/pets/PetDetail";
import PetCreate from "../pages/pets/PetCreate";
import PetEdit from "../pages/pets/PetEdit";
import Applications from "../pages/applications/Applications";
import AdoptionApplicationPage from "../pages/applications/Apply";
import MessagesPage from "../pages/messages/Messages";
import NotificationsPage from "../pages/notifications/Notifications";
import FosterApprovalsPage from "../pages/foster/FosterApprovals";
import AboutPage from "../pages/info/About";
import ContactPage from "../pages/info/Contact";
import FAQPage from "../pages/info/FAQ";
import SuccessStoriesPage from "../pages/info/SuccessStories";
import ManageStoriesPage from "../pages/stories/ManageStories";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const getDashboardRoute = () => {
    if (!isAuthenticated) return "/login";
    switch (user?.role) {
      case "Admin":
        return "/admin";
      case "Staff":
        return "/staff";
      case "Adopter":
        return "/adopter";
      default:
        return "/";
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="stories" element={<SuccessStoriesPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="pets" element={<PetsList />} />
        <Route path="pets/:id" element={<PetDetail />} />
        <Route path="pets/:id/apply" element={<AdoptionApplicationPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/pets" element={<PetsList />} />
          <Route path="admin/pets/new" element={<PetCreate />} />
          <Route path="admin/pets/:id/edit" element={<PetEdit />} />
          <Route path="admin/applications" element={<Applications />} />
          <Route path="admin/fosters" element={<FosterApprovalsPage />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/stories" element={<ManageStoriesPage />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={["Staff"]} />}>
          <Route path="staff" element={<StaffDashboard />} />
          <Route path="staff/pets" element={<PetsList />} />
          <Route path="staff/pets/new" element={<PetCreate />} />
          <Route path="staff/pets/:id/edit" element={<PetEdit />} />
          <Route path="staff/applications" element={<Applications />} />
          <Route path="staff/fosters" element={<FosterApprovalsPage />} />
          <Route path="staff/medical" element={<StaffMedical />} />
          <Route path="staff/stories" element={<ManageStoriesPage />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={["Adopter"]} />}>
          <Route path="adopter" element={<AdopterDashboard />} />
          <Route path="adopter/applications" element={<Applications />} />
          <Route path="adopter/favorites" element={<FavoritesPage />} />
          <Route path="adopter/foster" element={<FosterPage />} />
        </Route>
        
        <Route path="dashboard" element={<Navigate to={getDashboardRoute()} replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
