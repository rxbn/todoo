import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { LoginScreen } from "~/components/LoginScreen";
import { TodoApp } from "~/components/TodoApp";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <main>
      {session.status === "unauthenticated" && <LoginScreen />}
      {session.status === "authenticated" && (
        <TodoApp userName={session.data.user.name} />
      )}
    </main>
  );
};

export default Home;
