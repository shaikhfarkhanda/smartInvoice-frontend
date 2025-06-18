import axios from "./axios";

export const login = async (username: string, password: string) => {
    const response = await axios.post("auth/token/", {
        username,
        password,
    });

    const { access, refresh } = response.data;

    // ✅ Save tokens with consistent key names
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    return response;
};

export const logout = async () => {
    // ✅ Correct keys and typo fixed
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
