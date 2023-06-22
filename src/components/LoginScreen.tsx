import { signIn } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";

export const LoginScreen = () => {
  return (
    <div className="text-center">
      <div className="mb-2">Sign in to get started!</div>
      <button
        className="rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700"
        type="button"
        onClick={() => void signIn()}
      >
        <FaSignInAlt className="inline-flex" />
        <span className="ml-2">Sign In</span>
      </button>
    </div>
  );
};
