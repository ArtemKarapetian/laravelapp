import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import HomePage from "./views/HomePage";
import Catalogue from "./views/Catalogue";
import ProductForm from "./views/ProductForm"; // Добавляем импорт компонента для формы товара

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/catalogue',
                element: <Catalogue />
            },
            {
                path: '/products/new', // Изменяем путь для создания нового товара
                element: <ProductForm key="productCreate" /> // Используем компонент для формы товара
            },
            {
                path: '/products/:id', // Изменяем путь для редактирования товара
                element: <ProductForm key="productUpdate" /> // Используем компонент для формы товара
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate" />
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default router;
