import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUserRole } from "../services/profileService";
import { useAuth } from "./AuthContext";

type Role = "admin" | "user" | null;

type RoleContextType = {
  role: Role;
  loading: boolean;
};

const RoleContext = createContext<RoleContextType>({
  role: null,
  loading: true,
});

export function RoleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      if (!session) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const userRole = await getCurrentUserRole();

      if (userRole === "admin") {
        setRole("admin");
      } else {
        setRole("user");
      }

      setLoading(false);
    }

    loadRole();
  }, [session]);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}