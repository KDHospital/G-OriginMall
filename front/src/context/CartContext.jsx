import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = () => {
        const isLoggedIn = !!localStorage.getItem("member");
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }
        axiosInstance.get("/cart")
            .then((res) => setCartCount(res.data.items?.length ?? 0))
            .catch(() => setCartCount(0));
    };

    useEffect(() => {
        fetchCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);