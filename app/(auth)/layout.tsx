const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-y-hidden  bg-vintage-default max-h-svh  ">
      {children}
    </div>
  );
};

export default Layout;
