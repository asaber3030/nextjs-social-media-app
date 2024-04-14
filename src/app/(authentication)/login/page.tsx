import { LoginForm } from "@/app/_components/authentication/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to our main page of social-app'
}

const LoginPage = () => {
  return (
    <div className='lg:w-[60%] xl:w-[60%] my-[120px] mx-auto'>
      <LoginForm />
    </div>
  );
}
 
export default LoginPage;