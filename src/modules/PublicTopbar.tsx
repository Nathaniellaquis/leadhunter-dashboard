import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import Logo from '@/icons/Logo.svg'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { TbMenu } from 'react-icons/tb'

export default function PublicTopbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center text-xl font-bold text-gray-900 hover:text-gray-700">
          <img src={Logo} alt="Leadhunter Logo" className="h-6 w-6 mr-2" />
          Leadhunter
        </Link>
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden sm:flex items-center space-x-6">
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                <Link to="/login">Log In</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-gray-700 hover:text-gray-900">
                <TbMenu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setOpen(false)}>Pricing</Link>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setOpen(false)}>Log In</Link>
                <Link to="/signup" className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setOpen(false)}>Sign Up</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
