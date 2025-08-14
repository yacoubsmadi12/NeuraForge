export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
       <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-cover bg-center animate-grid-pan -z-10"></div>
      {children}
    </div>
  )
}
