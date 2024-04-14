import { Footer } from "../_components/footer";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-between h-[100%]">
      <div className='flex-1'>
        {children}
      </div>
      <Footer />
    </div>
  );
}
 
export default AuthenticationLayout;