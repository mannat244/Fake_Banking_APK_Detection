import React from 'react'
import Link from 'next/link';

const NavBar = () => {
return (
    <nav className="flex gap-6 p-4 bg-gray-100 shadow">
        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
    </nav>
)
}

export default NavBar
