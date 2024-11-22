import { BasicLayout } from "./components/layout";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/layout/Dashboard";
import { Login } from "./features/auth/login";
import ProtectedRoutes from "./config/routes/protectedRoutes";
import PublicRoute from "./config/routes/publicRoutes";
import { EditProduct, Products } from "./features/products";
import { CreateProduct } from "./features/products/pages/CreateProduct";
import {
  Categories,
  CreateCategory,
  EditCategory,
} from "./features/categories";
import { MediaGallery } from "./features/media";
import {  CreateOrder, EditOrder, Orders, ShowOrder } from "./features/orders";
import { CreateCustomer, Customers, EditCustomer } from "./features/customers";
import { Operations } from "./features/operations";
import {  WorkOrders } from "./features/work-orders";
import EmployeeAccess from "./features/products/pages/EmployeeAccess";
import Events from "./features/products/pages/EventLayout";
import { CreateEvents } from "./features/products/pages/CreateEvents";
import EmergencyContacts from "./features/products/pages/EmergencyContacts";


function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Dashboard />} />
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/create" element={<CreateProduct />} />
          {/* Categories */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          {/* Customers */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/create" element={<CreateCustomer />} />
          <Route path="customers/edit/:id" element={<EditCustomer />} />
          {/* Orders */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<ShowOrder />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />
          {/* Operations */}
          <Route path="operations" element={<Operations />} />
          {/* Media */}
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="employee-access" element={<EmployeeAccess />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<CreateEvents />} />
          <Route path="emergency-contacts" element={<EmergencyContacts />} />
          <Route path="media" element={<MediaGallery />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
