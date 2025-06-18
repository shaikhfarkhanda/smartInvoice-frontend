import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Logout:React.FC = () => {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        setIsLoggedIn(false);
        navigate("/login");
    }, []);

    return null;
};

export default Logout;