import { RegisterForm } from "@/app/_components/authentication/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register to our main page of social-app'
}

const RegisterPage = () => {
  return (
    <div className='lg:w-[60%] xl:w-[60%] my-[120px] mx-4 lg:mx-auto'>
      <RegisterForm />
    </div>
  );
}
 
export default RegisterPage;