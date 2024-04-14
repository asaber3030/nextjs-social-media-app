export const SettingsSectionTitle = ({ label }: { label: string }) => {
  return (
    <aside className='xl:min-w-[200px] bg-lightBg p-4 rounded-md mb-2 shadow-lg'>
      <h3 className='font-bold'>{label}</h3>
    </aside>   
  );
}