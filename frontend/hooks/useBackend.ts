import { useAuth } from '../contexts/AuthContext';
import backend from "~backend/client";

// Returns the backend client with authentication.
export function useBackend() {
  const { token } = useAuth();
  
  if (!token) return backend;
  
  return backend.with({
    auth: () => ({ authorization: `Bearer ${token}` })
  });
}
