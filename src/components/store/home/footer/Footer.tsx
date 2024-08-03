export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gap-5 mt-24">
      <hr className="border-t border-gray-200 my-8 mx-24" />
      <nav className="flex justify-center items-center gap-12 text-muted-foreground">
        <a href="#">About</a>
        <a href="#">Jobs</a>
        <a href="#">Accessibility</a>
        <a href="#">Partners</a>
        <a href="#">Press</a>
      </nav>
      <div className="text-center mt-8 text-muted-foreground">
        &copy; {currentYear} Kotek. All rights reserved.
      </div>
    </footer>
  );
};
