export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="w-full flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="w-full !text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mini Shop Task. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
