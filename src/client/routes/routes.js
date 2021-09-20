import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import NotFound from "../pages/404";

const routes = [
    {
        exact: true,
        path: "/",
        component: Home,
    },
    {
        exact: true,
        path: "/about",
        component: About,
    },
    {
        exact: true,
        path: "/services",
        component: Services,
    },
    {
        exact: true,
        path: "/contact",
        component: Contact,
    },
    {
        name: "NotFound",
        component: NotFound,
    },
];

export default routes;
